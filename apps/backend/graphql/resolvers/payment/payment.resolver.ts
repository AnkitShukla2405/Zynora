import { Order } from "@/model/orders.model";
import client from "@/lib/redis";
import { getUserCartItem } from "@/utils/cart/loggedInUserCart";
import createOrderSnapshot from "@/services/createOrderSnapshot";
import Stripe from "stripe";
import { fail } from "@/helper/cartItem";
import reserveStock, { getReservedStock } from "@/services/stockReservation.services";

import { GraphQLError } from "graphql/error/GraphQLError";

const secretKey = process.env.STRIPE_SECRET_KEY as string;

if (!secretKey) {
  fail("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(secretKey);

interface BuyNowInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export const paymentResolver = {
  Mutation: {
    proceedToPayment: async (
      _: unknown,
      { selectedAddressId }: { selectedAddressId: string },
      { user, request }: any,
    ) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      const idemKey = request.headers.get("Payment-Idempotency-Key");

      if (!idemKey) {
        throw new Error("Payment idempotency key is missing.");
      }

      const scopedKey = `payment:user:${user._id}:${idemKey}`;
      const lockKey = `idem:lock:${scopedKey}`;
      const resultKey = `idem:result:${scopedKey}`;
      let userLockAcquired = false;
      const userLockKey = `payment:user:${user._id}`;

      const existingResult = await client.get(resultKey);

      if (existingResult) return JSON.parse(existingResult.toString());

      const lock = await client.set(lockKey, "1", {
        NX: true,
        EX: 15 * 60,
      });

      if (!lock) {
        throw new Error("Processing... please wait.");
      }

      try {
        const cartItems = await getReservedStock(user._id);

        if (cartItems.length === 0) {
          throw new GraphQLError("Cart is empty", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        const pipeline = client.multi();

        for (let i = 0; i < cartItems.length; i++) {
          const item = cartItems[i];

          const globalKey = `stock:reserved:variant:${item.variantId}`;
          const userKey = `stock:reserved:user:${user._id}:${item.variantId}`;
          console.log(`LOOKING FOR KEY: "${userKey}"`);

          console.log("Checking reservation:", userKey);

          const userReserved = await client.get(userKey);

          console.log(
            "Reserved qty:",
            userReserved,
            "Cart qty:",
            item.quantity,
          );

          const remainingTTL = await client.ttl(userKey);
          console.log(
            `DEBUG: Key ${userKey} has ${remainingTTL} seconds left.`,
          );

          if (!userReserved || Number(userReserved) < item.quantity) {
            throw new Error("RESERVATION_EXPIRED");
          }

          pipeline.expire(globalKey, 15 * 60).expire(userKey, 15 * 60);
        }

        await pipeline.exec();

        const userLock = await client.set(userLockKey, "LOCKED", {
          NX: true,
          EX: 15 * 60,
        });

        if (!userLock) {
          throw new Error("Another payment is in progress");
        }

        userLockAcquired = true;

        const order = await createOrderSnapshot(
          user._id,
          selectedAddressId,
          idemKey,
        );

        if (!order) {
          throw new Error("Your order is not created");
        }

        const session = await stripe.checkout.sessions.create(
          {
            mode: "payment",
            customer_email: user.email,
            payment_method_types: ["card", "amazon_pay"],
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: `Order #${order.orderNumber}`,
                  },
                  unit_amount: Math.round(order.pricing.total * 100),
                },
                quantity: 1,
              },
            ],

            payment_intent_data: {
              metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                userId: user._id.toString(),
              },
            },

            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          },

          {
            idempotencyKey: idemKey,
          },
        );

        await Order.findByIdAndUpdate(order._id, {
          stripeCheckoutSessionId: session.id,
          checkoutUrl: session.url,
          paymentMethod: "card",
        });

        const response = {
          success: true,
          message: "Checkout session is created",
          orderId: order._id,
          checkoutUrl: session.url,
        };

        await client.set(resultKey, JSON.stringify(response), {
          EX: 24 * 60 * 60,
        });
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        await client.del(lockKey);
        if (userLockAcquired) {
          await client.del(userLockKey);
        }
      }
    },

    buyNow: async (_: unknown, { input }: { input: BuyNowInput }, { user }: any) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });

        const reserve = await reserveStock({
          userId: user._id,
          items: [
            {
              productId: input.productId,
              variantId: input.variantId,
              quantity: input.quantity,
            },
          ],
        });

        if (!reserve.success) {
          throw new Error("Stock reservation failed");
        }

        const response = {
          success: true,
          message: "Stock reserved successfully for Buy Now",
        };
        
        return response;

    }
  },
};
