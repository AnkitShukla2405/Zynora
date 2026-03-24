import mongoose, {Schema, Document} from "mongoose";

export interface UserInfo extends Document {
    email?: string;
    phone?: string;
    passwordHash?: string;
    googleId?: string;
    roles: ("USER" | "SELLER" | "ADMIN")[];
    status: "ACTIVE" | "PENDING" | "SUSPENDED";
    tokenVersion: number;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}

const userSchema = new Schema<UserInfo>(
  {
    // Login identity
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, 
    },

    passwordHash: {
      type: String, 
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    // Role system
    roles: {
      type: [String],
      enum: ["USER", "SELLER", "ADMIN"],
      default: ["USER"],
      required: true,
    },

    // Account state
status: {
  type: String,
  enum: ["ACTIVE", "SUSPENDED"],
  default: "ACTIVE",
},

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // Security
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);



export const User =
  mongoose.models.User || mongoose.model("User", userSchema);