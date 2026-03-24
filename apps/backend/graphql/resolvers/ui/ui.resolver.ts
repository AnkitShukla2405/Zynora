import { User } from "@/model/user.model";
import { GraphQLError } from "graphql/error/GraphQLError";
import Seller from "@/model/sellerRegistration.model"

const throwAuthError = () => {
  throw new GraphQLError("User not authenticated", {
    extensions: { code: "UNAUTHENTICATED" },
  });
};

interface ContextType {
    user?: {
        _id: string,
        email: string;
    }
}

export const uiResolver = {
  Query: {
    getSellerAuthForEmail: async (
      _: unknown,
      __: unknown,
      { user }: ContextType,
    ) => {
      if (!user) throwAuthError();
      const dbUser = await User.findById(user?._id).select("email");

      if (!dbUser) throwAuthError();

      return {
        email: dbUser?.email,
      };
    },

    getSellerNameForUi: async (_:unknown, __: unknown, {user}: {user: any}) => {

      if (!user) throwAuthError();
      const dbUser = await User.findById(user?._id);

      if (!dbUser) throwAuthError();

      if(!dbUser.roles.includes("SELLER")) {
        throw new Error("You are not a seller")
      }

      const seller = await Seller.findOne({
  userId: dbUser._id,
});

      if(!seller) {
        throw new Error("You are not a seller");
      }

      return {
        name: seller.storeDisplayName,
        image: seller.storeLogo
      }

    },

    isUserExists: async (_: any, __:any, {user}: any) => {
      if(!user) {
        return {
          isUserExist: false,
        }
      }

      return {
        isUserExist: true
      }
    }
  },
};
