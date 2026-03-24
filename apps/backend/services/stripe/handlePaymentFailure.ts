import Stripe from "stripe";
import { Order } from "@/model/orders.model";
import client from "@/lib/redis";

export async function handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent,
) {
    const { orderId, userId } = paymentIntent.metadata
    const userLockKey = `payment:user:${userId}`;

    if(!orderId) return;

    await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
        orderStatus: "cancelled"
    })

    await client.del(userLockKey)
}