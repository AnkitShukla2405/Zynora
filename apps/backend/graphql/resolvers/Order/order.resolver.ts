import { Order } from "@/model/orders.model";
import { GraphQLError } from "graphql/error/GraphQLError";

export const orderResolvers = {
  Query: {
    getUserOrders: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const orders = await Order.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

      return orders.map((order) => ({
        id: order.orderNumber,
        status:(order.orderStatus === "placed" ? "processing" : order.orderStatus).toUpperCase(),
        date: new Date(order.createdAt).toDateString(),

        estimatedDelivery: order.estimatedDelivery
          ? new Date(order.estimatedDelivery).toDateString()
          : null,

        deliveredOn: order.deliveredAt
          ? new Date(order.deliveredAt).toDateString()
          : null,

        address: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}`,

        total: order.pricing.total,

        paymentMethod: order.paymentMethod,

        trackingId: order.trackingId,

        items: order.items.map((item: any) => ({
          name: item.productSnapshot.name,
          brand: item.productSnapshot.brand,
          image: item.productSnapshot.image,

          qty: item.quantity,
          price: item.price,

          size: item.variantSnapshot?.attributes?.size || null,
          color: item.variantSnapshot?.attributes?.color || null,
        })),
      }));
    },
  },
};
