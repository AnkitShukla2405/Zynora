import { guestUserAddToCart, getGuestCart } from "@/utils/cart/guestCart";
import {
  loggedUserAddtoCart,
  getUserCartItem,
} from "@/utils/cart/loggedInUserCart";
import { v4 as uuid } from "uuid";
import getCartItemForMapping, {
  accuireIdemLock,
  cachedFail,
  cachedResult,
  fail,
  validateCartItem,
} from "@/helper/cartItem";
import {
  addOrDecreaseUserItems,
  addOrDecreaseGuestItems,
} from "@/utils/cart/cartHelper";
import { mergeCarts } from "@/utils/cart/mergeCart";
import client from "@/lib/redis";
import reserveStock from "@/services/stockReservation.services";
import { serialize } from "cookie";
import { GraphQLError } from "graphql/error/GraphQLError";

export const cartResolver = {
  Query: {
    getCartData: async (
      _: any,
      __: any,
      { user, guestId }: { user: any; guestId: string },
    ) => {
      let cartItem = [];

      try {
        if (user) {
          if (user.roles.includes("USER")) {
            cartItem = await getUserCartItem(user._id);
            if (!cartItem || cartItem.length === 0) {
              return [];
            }

            const result = await getCartItemForMapping(cartItem);
            const cartLength = cartItem.reduce(
              (acc, item) => acc + item.quantity,
              0,
            );

            return {
              result,
              cartLength,
            };
          }
        }
      } catch (error) {
        console.warn("Invalid access token, falling back to guest cart", error);
      }

      if (guestId) {
        cartItem = await getGuestCart(guestId);
        console.log(cartItem);

        const result = await getCartItemForMapping(cartItem);

        const cartLength = cartItem.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        return {
          result,
          cartLength: cartLength,
        };
      }

      return {
        result: [],
        cartLength: 0,
      };
    },

    getCheckoutCartData: async (_: any, __: any, { user }: { user: any }) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      if (!user.roles.includes("USER")) {
        throw new GraphQLError("Unauthorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      const cartItem = await getUserCartItem(user._id);
      if (!cartItem || cartItem.length === 0) {
        return [];
      }

      const result = await getCartItemForMapping(cartItem);
      console.log("Ordwer", result);
      return result;
    },
  },

  Mutation: {
    createCart: async (
      _: unknown,
      {
        productId,
        variantId,
        qty,
      }: {
        productId: string;
        variantId: string;
        qty: number;
      },
      {
        user,
        guestId,
        res,
      }: {
        user: any;
        guestId: any;
        res: any;
      },
    ) => {
      if (!productId || !variantId || qty <= 0) {
        throw new Error("Invalid cart input");
      }

      if (user && Array.isArray(user.roles) && user.roles.includes("USER")) {
        await loggedUserAddtoCart(
          user._id.toString(),
          productId,
          variantId,
          qty,
        );
        return { success: true };
      }

      if (!guestId) {
        const currentGuestId = uuid();

        res.setHeader(
          "Set-Cookie",
          serialize("guestId", currentGuestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }),
        );

        await guestUserAddToCart(currentGuestId, productId, variantId, qty);
      } else {
        await guestUserAddToCart(guestId, productId, variantId, qty);
      }
      return { success: true };
    },

    changeCartQuantity: async (
      _: unknown,
      {
        productId,
        variantId,
        qty,
      }: { productId: string; variantId: string; qty: number },
      { user, guestId }: { user: any; guestId: string },
    ) => {
      try {
        if (user && Array.isArray(user.roles) && user.roles.includes("USER")) {
          await addOrDecreaseUserItems(user._id, productId, variantId, qty);
          return {
            success: true,
            message: "User Item updated",
          };
        }
      } catch (error) {
        console.warn("Invalid access token, falling back to guest cart", error);
      }

      if (guestId) {
        await addOrDecreaseGuestItems(guestId, productId, variantId, qty);
        return {
          success: true,
          message: "Guest Item updated",
        };
      }

      return {
        success: false,
        message: "Error occurs",
      };
    },

    proceedToCheckout: async (
      _: unknown,
      __: unknown,
      { user, guestId, request }: { user: any; guestId: string; request: any },
    ) => {
      let userLockKey: string | null = null;

      const idemKey = request.headers.get("idempotency-key");

      if (!idemKey) return fail("Idempotency key is missing");

      if (!user && !guestId) return fail("Your zynora cart is empty");

      const scopedKey = user
        ? `checkout:user:${user._id}:${idemKey}`
        : `checkout:guest:${guestId}:${idemKey}`;

      const lockKey = `idem:lock:${scopedKey}`;
      const resultKey = `idem:result:${scopedKey}`;

      const lock = await accuireIdemLock(lockKey);

      if (!lock) {
        const cached = await client.get(resultKey);
        return cached
          ? JSON.parse(cached.toString())
          : fail("Checkout already in progress");
      }

      try {
        if (guestId) {
          const item = await getGuestCart(guestId);

          console.log(guestId);

          if (item.length > 0) {
            await validateCartItem(item);
          }
          if (!user || !user._id) {
            throw new GraphQLError("User not authenticated", {
              extensions: { code: "UNAUTHENTICATED" },
            });
          }

          const merge = await mergeCarts(user._id, guestId);

          if (!merge) {
            throw new GraphQLError("User not authenticated", {
              extensions: { code: "UNAUTHENTICATED" },
            });
          }

          const cartItems = await getUserCartItem(user._id);

          const reserve = await reserveStock({
            userId: user._id,
            items: cartItems,
          });

          if (!reserve.success) {
            throw new Error("Stock reservation failed");
          }

          const response = {
            success: true,
            message: "Stock reserved successfully",
            redirectTo: "/checkout",
          };

          await cachedResult(resultKey, response);
          return response;
        }

        if (user && user.roles.includes("USER")) {
          userLockKey = `checkout:user:${user._id}`;
          const userLock = await client.set(userLockKey, "LOCKED", {
            NX: true,
            EX: 120,
          });
          if (!userLock) return fail("Another checkout is already running");

          const cartItems = await getUserCartItem(user._id);

          if (cartItems.length < 1) {
            return fail("Your cart is empty");
          }

          const reserve = await reserveStock({
            userId: user._id,
            items: cartItems,
          });

          if (!reserve.success) {
            return fail("Stock reservation failed");
          }

          const response = {
            success: true,
            message: "Your stock is successfully reserved",
            redirectTo: "/checkout",
          };

          await cachedResult(resultKey, response);
          return response;
        }
      } catch (error) {
        console.error(error);
        return fail(error instanceof Error ? error.message : "Checkout failed");
      } finally {
        await client.del(lockKey);
        if (userLockKey) await client.del(userLockKey);
      }
    },
  },
};
