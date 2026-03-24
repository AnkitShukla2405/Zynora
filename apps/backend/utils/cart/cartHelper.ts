import client from "@/lib/redis"

const MAX_QTY_PER_ITEM = 20;
const GUEST_CART_TTL = 60 * 60 * 24 * 7; // 7 days

export async function addOrDecreaseGuestItems(guestId: string, productId: string, variantId: string, qty: number ) {
    if(qty === 0) return;

    const cartKey = `cart:guest:${guestId}`
    const cartItemKey = `${productId}:${variantId}`

    const exists = await client.hExists(cartKey, cartItemKey)
    if(!exists && qty < 0) return null;

    const newQtyRaw = await client.hIncrBy(cartKey, cartItemKey, qty)
    const newQty = Number(newQtyRaw);

    if(newQty <= 0) {
        await client.hDel(cartKey, cartItemKey)
    }

      if (newQty > MAX_QTY_PER_ITEM) {
    await client.hSet(cartKey, cartItemKey, MAX_QTY_PER_ITEM);
  }

  await client.expire(cartKey, GUEST_CART_TTL);

}

export async function addOrDecreaseUserItems(userId: string, productId: string, variantId: string, qty: number ) {
    if(qty === 0) return;

    const cartKey = `cart:user:${userId}`
    const cartItemKey = `${productId}:${variantId}`

    const exists = await client.hExists(cartKey, cartItemKey)
    if(!exists && qty < 0) return null;

    const newQtyRaw = await client.hIncrBy(cartKey, cartItemKey, qty)
    const newQty = Number(newQtyRaw);

    if(newQty <= 0) {
        await client.hDel(cartKey, cartItemKey)
    }

      if (newQty > MAX_QTY_PER_ITEM) {
    await client.hSet(cartKey, cartItemKey, MAX_QTY_PER_ITEM);
  }

  await client.expire(cartKey, GUEST_CART_TTL);

}