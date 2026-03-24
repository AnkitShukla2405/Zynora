import client from "@/lib/redis";
import { Product } from "@/model/productRegistration.model";
import { success } from "zod";

type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export default async function getCartItemForMapping(cartItem: any) {
  const productId = cartItem.map((item) => item.productId);
  console.log(productId);

  const products = await Product.find(
    { _id: { $in: productId } },
    {
      name: 1,
      brand: 1,
      sellingPrice: 1,
      mrp: 1,
      discountPercentage: 1,
      variants: 1,
    },
  );

  const productMap = new Map(products.map((v) => [v._id.toString(), v]));

  const enrichCartItem = cartItem
    .map((item) => {
      const product = productMap.get(item.productId.toString());

      if (!product) return null;

      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString(),
      );

      if (!variant) return null;

      return {
        productId: product._id.toString(),
        variantId: variant._id.toString(),

        title: product.name,
        brand: product.brand,

        image: variant.variantImages?.[0]?.key ?? "",

        price: product.sellingPrice,
        originalPrice: product.mrp,
        discount: product.discountPercentage,

        quantity: item.quantity,
        maxStock: variant.stock,

        sellerName: product.brand,

        variants: variant.attributes.map((a: any) => ({
          name: a.key,
          value: a.value
        })),
      };
    })
    .filter(Boolean);


  return enrichCartItem;
}

export async function validateCartItem(cartItem: CartItem[]) {
  if (!Array.isArray(cartItem) || cartItem.length === 0) {
    throw new Error("EMPTY_CART");
  }

    console.log("CART PRODUCT IDS:", cartItem.map(i => i.productId.toString()));
  const productId = cartItem.map((item) => item.productId);

  console.log("variantIds", productId.map(i => [i]));
  

  const products = await Product.find(
    { _id: { $in: productId } },
    { _id: 1, variants: 1 },
  );

  console.log("DB PRODUCTS:", products.map(p => p._id.toString()));

  const variantStockMap = new Map<string, number>()

  for(const product of products) {
    for (const variant of product.variants) {
      variantStockMap.set(variant._id.toString(), variant.stock)
    }
  }

  for (const item of cartItem) {
    if (item.quantity <= 0) {
      console.log("Invalid Quantity")
    }

    const availableStock = variantStockMap.get(item.variantId.toString()); 

    

    if (availableStock === undefined) {
      console.error("Product not found")
    }

    if (item.quantity > availableStock) {
      throw new Error(`INSUFFICIENT_STOCK:${item.variantId}:${availableStock}`);
    }
  }

  return variantStockMap;
}


export async function cachedResult(key: string, data: any) {
  await client.set(key, JSON.stringify(data), {EX: 86400})
}

export async function accuireIdemLock(lockKey: string) {
  return client.set(lockKey, "PROCESSING", {
    NX: true,
    EX: 300
  })
}

export function fail(message: string) {
  return {
    success: false,
    message,
  }
}

export async function cachedFail(key: string, message: string) {
  const result = fail(message)

  await cachedResult(key, result)
  return result;
}