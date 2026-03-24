import { Address } from "@/model/userAddress.model";
import { GraphQLError } from "graphql/error/GraphQLError";

type AddressFormValues = {
  name: string;
  mobile: string;
  pincode: string;
  city: string;
  address1: string;
  address2?: string;
  state: string;
  country?: string;
  type: "HOME" | "WORK";
};

export const addressResolver = {
  Query: {
    getSavedAdresses: async (_: unknown, __: unknown, { user }: any) => {
      console.log("user From Context:", user)
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

        console.log(user)
      try {
        const address = await Address.find(
          { userId: user._id },
          {
            _id: 1,
            userId: 1,
            name: 1,
            mobile: 1,
            pincode: 1,
            city: 1,
            state: 1,
            country: 1,
            addressLine1: 1,
            addressLine2: 1,
            type: 1,
          },
        );

        return address.map((i) => ({
          id: i._id.toString(),
          userId: i.userId,
          name: i.name,
          mobile: i.mobile,
          cityStateZip: i.pincode,
          addressLine: i.addressLine1,
          type: i.type,
        }));
      } catch (error) {
        console.error("SAVE ADDRESS ERROR:", error);
        throw new GraphQLError("Failed to fetch addresses");
      }
    },
  },

  Mutation: {
    saveUserAddress: async (
      _: unknown,
      { data }: { data: AddressFormValues },
      { user }: any,
    ) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      try {
        await Address.create({
          userId: user._id,
          name: data.name,
          mobile: data.mobile,
          pincode: data.pincode,
          city: data.city,
          state: data.state,
          country: data.country ?? "India",
          addressLine1: data.address1,
          addressLine2: data.address2,
          type: data.type,
        });

        return {
          success: true,
          message: "Address saved successfully",
        };
      } catch (error) {
        console.error("SAVE ADDRESS ERROR:", error);
        return {
          success: false,
          message: "Failed to save address",
        };
      }
    },
  },
};
