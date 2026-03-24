import client from "@/lib/redis";


export  async function loggedUserAddtoCart(
    userId: string,
    productId: string,
    variantId: string,
    qty: number,
) {

    if(!userId || !productId || !variantId) {
        throw new Error("Missing cart parameters");
    }

    if(qty <= 0) {
        throw new Error("Invalid quantity"); 
    }

    const cartKey = `cart:user:${userId}`
    const cartItemKey = `${productId}:${variantId}`

    await client.hIncrBy(cartKey, cartItemKey, qty)

    await client.expire(cartKey, 7 * 24 * 60 * 60)

    return {
        success: true,
    }
}

export  async function getUserCartItem(userId: string) {
    const cartKey = `cart:user:${userId}`
    const item =  await client.hGetAll(cartKey)

    return Object.entries(item).map(([key, qty]) => {
        const [productId, variantId] = key.split(":");

    return {
      productId,
      variantId,
      quantity: Number(qty),
    };
    })
}