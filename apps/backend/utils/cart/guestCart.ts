import client from "@/lib/redis";

export async function guestUserAddToCart(
    guestId: string,
    productId: string,
    variantId: string,
    qty: number
) {
    if(!guestId || !productId || !variantId) {
        throw new Error("Missing cart parameters");
    }

    if(qty <= 0) {
        throw new Error("Invalid quantity"); 
    }

    const cartKey = `cart:guest:${guestId}`
    const cartItemKey = `${productId}:${variantId}`

    await client.hIncrBy(cartKey, cartItemKey, qty)

    await client.expire(cartKey, 7 * 24 * 60 * 60);

    return {
        success: true
    }
}


export async function getGuestCart(guestId: string) {
    const cartKey = `cart:guest:${guestId}`
    const item = await client.hGetAll(cartKey)


    return Object.entries(item).map(([key, qty]) => {
        const [productId, variantId] = key.split(":")

        return {
            productId,
            variantId,
            quantity: Number(qty)
        }
    })
}

export async function getGuestCartData(guestId: string) {
        if (!guestId) {
        throw new Error("Guest ID is required");
    }

    const cartKey = `cart:guest:${guestId}`;
    const item = await client.hGetAll(cartKey);


    const uniqueItem = Object.keys(item).length;

    const totalQuantity = Object.values(item).reduce(
        (sum, quantity) => sum + Number(quantity), 0
    )

    return {
        item,
        uniqueItem,
        totalQuantity
    }
}