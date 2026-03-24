import mongoose from "mongoose";
import Stripe from "stripe";

import { Order } from "@/model/orders.model";
import { Product } from "@/model/productRegistration.model";
import client from "@/lib/redis";

export async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent,
) {
  const { orderId, userId } = paymentIntent.metadata;
  console.log(userId);
  const cartKey = `cart:user:${userId}`;
  const userLockKey = `payment:user:${userId}`;

  if (!orderId || !userId) return;

  console.log("I am here")

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) return;

    if (order.paymentStatus === "paid") {
      console.log("Webhook already processed:", orderId);
      await session.commitTransaction();
      return;
    }

    if (paymentIntent.amount_received !== Math.round(order.pricing.total * 100)) {
      throw new Error("Payment amount mismatch");
    }

    const redisKeys: string[] = [];
    const cartFields: string[] = [];

    for (const item of order.items) {
      const field = `${item.productId}:${item.variantSnapshot.variantId}`;
      cartFields.push(field);

      const result = await Product.updateOne(
        {
          _id: new mongoose.Types.ObjectId(item.productId),
          variants: {
            $elemMatch: {
              _id: new mongoose.Types.ObjectId(item.variantSnapshot.variantId),
              stock: { $gte: item.quantity },
            },
          },
        },
        {
          $inc: { "variants.$.stock": -item.quantity },
        },
        { session },
      );

      if (result.matchedCount !== 1) {
        throw new Error(`Stock update failed for product ${item.productId}`);
      }

      if (result.modifiedCount !== 1) {
        throw new Error(`Stock update failed for product ${item.productId}`);
      }

      redisKeys.push(
        `stock:reserved:variant:${item.variantSnapshot.variantId}`,
        `stock:reserved:user:${userId}:${item.variantSnapshot.variantId}`,
      );
    }

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.paymentId = paymentIntent.id;

    await order.save({ session });
    await session.commitTransaction();

    if (cartFields.length > 0) {
      await client.hDel(cartKey, cartFields);
    }

    if (redisKeys.length > 0) {
      await client.del([...redisKeys, userLockKey]);
    }
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
