import Seller from "@/model/sellerRegistration.model";
import { getClientIp } from "@/utils/clientIP";
import { GraphQLError } from "graphql/error/GraphQLError";

export type NatureOfBusiness =
  | "manufacturer"
  | "reseller"
  | "d2c"
  | "wholesaler";

interface SellerRegistrationArgs {
  data: {
    gstin: string;
    pan: string;
    businessName: string;
    natureOfBusiness: NatureOfBusiness;
    gstStatus: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    pickupContactName: string;
    pickupPhone: string;
    returnAddressSame: boolean;
    returnAddress?: string;
    returnCity?: string;
    returnState?: string;
    returnPincode?: string;
    accountNumber: string;
    ifsc: string;
    settlementCycle: string;
    bankDocument: string;
    storeLogo: string;
    storeDisplayName: string;
    supportEmail: string;
    storeDescription: string;
  };
}

interface isSellerExistsArgs {
  data: {
    gstin: string;
    pan: string;
    storeDisplayName: string;
  };
}
export const sellerRegistrationResolver = {
  Query: {
    getIp: async (_: unknown, __: unknown, {request, req}: {request: any, req: any}) => {
      const ip = getClientIp(request, req);

      return {
        success: true,
        message: "IP extracted",
        ip,
      };
    },

    isSellerExists: async (_: unknown, { data }: isSellerExistsArgs) => {
      const { gstin, pan, storeDisplayName } = data;

      const existingSeller = await Seller.findOne({
        $or: [{ gstin }, { pan }, { storeDisplayName }],
      });

      return {
        isExists: !!existingSeller,
        message: existingSeller
          ? "Seller already exists."
          : "Seller not exists you can continue",
      };
    },

    getSellerResponse: async (
      _: unknown,
      __: unknown,
      { user }: { user: any },
    ) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      try {
        if (
          !user ||
          !Array.isArray(user.roles) ||
          !user.roles.includes("SELLER")
        ) {
          throw new Error("You are unauthorized");
        }

        const seller = await Seller.findOne({ userId: user._id });

        if (!seller) {
          throw new Error("Only seller can see the dashboard");
        }

        return {
          gstin: seller.gstin,
          pan: seller.pan,
          businessName: seller.businessName,
          natureOfBusiness: seller.natureOfBusiness,
          gstStatus: seller.gstStatus,
          city: seller.city,
          state: seller.state,
          pincode: seller.pincode,
          pickupContactName: seller.pickupContactName,
          pickupPhone: seller.pickupPhone,
          returnAddressSame: seller.returnAddressSame,
          returnAddress: seller.returnAddress,
          returnCity: seller.returnCity,
          returnState: seller.returnState,
          returnPincode: seller.returnPincode,
          accountNumber: seller.accountNumber,
          ifsc: seller.ifsc,
          settlementCycle: seller.settlementCycle,
          bankDocument: seller.bankDocument,
          storeLogo: seller.storeLogo,
          storeDisplayName: seller.storeDisplayName,
          supportEmail: seller.supportEmail,
          storeDescription: seller.storeDescription,
          address: seller.address,
        };
      } catch (error) {
        console.error(error);
        throw new GraphQLError("Failed to fetch seller data");
      }
    },
  },

  Mutation: {
    registerSeller: async (
      _: unknown,
      { data }: SellerRegistrationArgs,
      { user }: { user: any },
    ) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (
        !user ||
        !Array.isArray(user.roles) ||
        !user.roles.includes("SELLER")
      ) {
        throw new Error("You are unauthorized");
      }

      const { gstin, pan, storeDisplayName } = data;

      const existingSeller = await Seller.findOne({
        $or: [{ gstin }, { pan }, { storeDisplayName }],
      });

      if (existingSeller) {
        throw new Error("Seller already exists");
      }

      await Seller.create({
        ...data,
        userId: user._id,
      });
      return {
        success: true,
        message: "Seller registered Successfully.",
      };
    },
  },
};
