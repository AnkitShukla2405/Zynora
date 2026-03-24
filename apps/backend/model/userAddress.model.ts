import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";

export interface AddressDocument extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    mobile: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    addressLine1: string;
    addressLine2?: string;
    type: "HOME" | "WORK"
    isDefault: boolean;
}

const AddressSchema = new Schema<AddressDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    mobile: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/,
    },

    pincode: {
        type: String,
        required: true,
        length: 6,
    },

    city: {
        type: String,
        required: true,
        trim: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "India",
    },

    addressLine1: {
      type: String,
      required: true,
    },

    addressLine2: {
      type: String,
    },

    type: {
        type: String,
        enum: ["HOME", "WORK"],
        default: "HOME"
    },

    isDefault: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

export const Address =
  mongoose.models.Address ||
  mongoose.model<AddressDocument>("Address", AddressSchema);