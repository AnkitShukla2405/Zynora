import client from "@/lib/redis";

export async function mergeCarts(userId: string, guestId: string) {
    if(!userId || !guestId) return {
        success: true,
    }

    const guestCartKey = `cart:guest:${guestId}`
    const userCartKey = `cart:user:${userId}`

    const guestCartItem = await client.hGetAll(guestCartKey)

    if(!guestCartItem || Object.keys(guestCartItem).length === 0) {
        return {
            success: true
        }
    }

    const multi = client.multi()

    for(const [cartItemKey, qty] of Object.entries(guestCartItem)) {
        const quantity = Number(qty)

        if(!Number.isFinite(quantity) || quantity <= 0) continue;
        multi.hIncrBy(
            userCartKey,
            cartItemKey,
            Number(qty)
        )
    }

    const userExists = await client.exists(userCartKey);

    if(!userExists) {
        multi.expire(userCartKey, 7 * 24 * 60 * 60)
    }
    
    multi.del(guestCartKey);

    await multi.exec();

  return { success: true };
}