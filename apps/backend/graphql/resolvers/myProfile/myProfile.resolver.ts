import { Order } from "@/model/orders.model";
import { Address } from "@/model/userAddress.model";
import { GraphQLError } from "graphql/error/GraphQLError";

export const myProfileResolver = {
  Query: {
    getUserInfo: async (_: unknown, __: unknown, { user }: { user: any }) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const name = user.email.split("@")[0];
      const d = new Date(user.createdAt);
      const memberSince = d.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const order = await Order.aggregate([
        {
          $match: {
            userId: user._id,
          },
        },
        {
          $count: "totalCount",
        },
      ]);

      const totalOrders = order[0]?.totalCount || 0;

      const userData = {
        name,
        email: user.email,
        memberSince,
        totalOrders,
      };

      const userAddresses = await Address.aggregate([
        {
          $match: {
            userId: user._id,
          },
        },

        {
          $project: {
            id: "$_id",
            tag: "$type",
            default: "$isDefault",
            line1: "$addressLine1",
            line2: "$addressLine2",
          },
        },
      ]);

      return {
        userData,
        userAddresses,
      };
    },
  },

  Mutation: {
    addressDelete: async (
      _: unknown,
      { id }: { id: string },
      { user }: { user: any },
    ) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const deleteOrders = await Address.deleteOne({ _id: id, userId: user._id });

      if (deleteOrders.deletedCount === 0) {
        return {
          success: false,
          message: "Address deletion failed.",
        };
      }

      return {
        success: true,
        message: "Address deletion successfull.",
      };
    },
  },
};
