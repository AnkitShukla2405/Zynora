import { validateCartItem } from "@/helper/cartItem";
import client from "@/lib/redis";

type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export default async function reserveStock({
  userId,
  items,
}: {
  userId: string;
  items: CartItem[];
}) {
  const dbStockMap = await validateCartItem(items);

  const successfullyReserved: CartItem[] = [];
  try {
    for (const item of items) {
      console.log("RESERVING ITEM:", item);
      const globalKey = `stock:reserved:variant:${item.variantId}`;
      const userKey = `stock:reserved:user:${userId}:${item.variantId}`;
      const userSetKey: string = `stock:reserved:user:${userId}:variants`;
      const userMetaKey = `stock:reserved:user:${userId}:meta`;

      const dbStock = dbStockMap.get(item.variantId);

      if (!dbStock) {
        throw new Error("INVALID_VARIANT");
      }

      let success = false;
      let retries = 0;
      while (!success && retries < 5) {
        await client.watch(globalKey);

        const reserved = Number(await client.get(globalKey)) || 0;

        if (reserved + item.quantity > dbStock) {
          await client.unwatch();
          throw new Error(`OUT_OF_STOCK_${item.variantId}`);
        }

        const RESERVATION_TTL = 20 * 60;

        const tx = client.multi();

        tx.incrBy(globalKey, item.quantity)
          .expire(globalKey, RESERVATION_TTL)
          .incrBy(userKey, item.quantity)
          .expire(userKey, RESERVATION_TTL)
          .sAdd(userSetKey, item.variantId)
          .expire(userSetKey, RESERVATION_TTL)
          .hSet(userMetaKey, item.variantId, item.productId)
          .expire(userMetaKey, RESERVATION_TTL);

        const result = await tx.exec();

        if (result) {
          success = true;
          successfullyReserved.push(item);
        } else {
          retries++;
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
        }
      }

      if (!success) {
        throw new Error("STOCK_RESERVATION_FAILED");
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    if (successfullyReserved.length > 0) {
      const rollbackTx = client.multi();

      for (const item of successfullyReserved) {
        const globalKey = `stock:reserved:variant:${item.variantId}`;
        const userKey = `stock:reserved:user:${userId}:${item.variantId}`;
        const userSetKey: string = `stock:reserved:user:${userId}:variants`;
        const userMetaKey = `stock:reserved:user:${userId}:meta`;

        rollbackTx.decrBy(globalKey, item.quantity);
        rollbackTx.decrBy(userKey, item.quantity);
        rollbackTx.sRem(userSetKey, item.variantId);
        rollbackTx.hDel(userMetaKey, item.variantId);
      }

      await rollbackTx.exec();
    }
    throw error;
  }
}

export async function getReservedStock(userId: string) {
  const userSetKey: string = `stock:reserved:user:${userId}:variants`;
  const userMetaKey = `stock:reserved:user:${userId}:meta`;

  const raw = await client.sMembers(userSetKey);

  const variantIds = Array.from(raw).map((v) => (Array.isArray(v) ? v[0] : v));

  const pipeline = client.multi();

  variantIds.forEach((variantId: string) => {
    const userKey = `stock:reserved:user:${userId}:${variantId}`;
    pipeline.get(userKey);
    pipeline.hGet(userMetaKey, variantId);
  });

  const results = await pipeline.exec();

  console.log("RAW REDIS RESULTS:", results);

  if (!results) return [];

  const final = [];

  for (let i = 0; i < variantIds.length; i++) {
    const quantity = Number(results?.[i * 2] || 0);
    const productId = results?.[i * 2 + 1];

    final.push({
      productId,
      variantId: variantIds[i],
      quantity,
    });
  }
  return final;
}
