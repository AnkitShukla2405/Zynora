import mongoose, { Schema, Document, Types } from "mongoose";

export type NatureOfBusiness =
  | "manufacturer"
  | "reseller"
  | "d2c"
  | "wholesaler";

export type SellerStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface SellerRegistrationInfo extends Document {
  userId: Types.ObjectId;
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
  sellerStatus: SellerStatus
}

const ZynoraSellerRegistrationSchema = new Schema<SellerRegistrationInfo>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gstin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    pan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    natureOfBusiness: {
      type: String,
      required: true,
      enum: ["manufacturer", "reseller", "d2c", "wholesaler"],
    },

    gstStatus: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    pickupContactName: {
      type: String,
      required: true,
      trim: true,
    },

    pickupPhone: {
      type: String,
      required: true,
      trim: true,
    },

    returnAddressSame: {
      type: Boolean,
      default: true,
    },

    returnAddress: {
      type: String,
      trim: true,
      required: function () {
        return !this.returnAddressSame;
      },
    },

    returnCity: {
      type: String,
      required: function () {
        return !this.returnAddressSame;
      },
      trim: true,
    },

    returnState: {
      type: String,
      required: function () {
        return !this.returnAddressSame;
      },
      trim: true,
    },

    returnPincode: {
      type: String,
      required: function () {
        return !this.returnAddressSame;
      },
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ifsc: {
      type: String,
      required: true,
      trim: true,
    },

    settlementCycle: {
      type: String,
      required: true,
      default: "T+2",
      trim: true,
    },

    bankDocument: {
      type: String,
      required: true,
      trim: true,
    },

    storeLogo: {
      type: String,
      required: true,
      trim: true,
    },

    storeDisplayName: {
      type: String,
      required: true,
      trim: true,
    },

    supportEmail: {
      type: String,
      required: true,
      trim: true,
    },

    storeDescription: {
      type: String,
      required: true,
      trim: true,
    },

    sellerStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "APPROVED",
    },
  },
  { timestamps: true },
);

ZynoraSellerRegistrationSchema.index({ storeDisplayName: 1 });

export default mongoose.models.Seller ||
  mongoose.model<SellerRegistrationInfo>(
    "Seller",
    ZynoraSellerRegistrationSchema,
  );
