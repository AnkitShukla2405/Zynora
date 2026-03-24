import mongoose, { Schema } from "mongoose";

export interface OrderInfo {
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    productSnapshot: {
      name: string;
      brand: string;
      image: string;
    };
    variantSnapshot: {
      variantId: mongoose.Types.ObjectId;
      attributes: {
        key: string;
        value: string;
      }[];
    };
    quantity: number;
    price: number;
  }[];

  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };


  estimatedDelivery?: Date;
  deliveredAt?: Date;
  trackingId?: string;
  paymentMethod?: string;
  orderNumber: string;
  currency: string;
  paymentId?: string;
  paymentProvider?: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus:
    | "placed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";

  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  checkoutUrl?: string | null;
  stripeCheckoutSessionId?: string | null;
  idempotencyKey?: string;
}

const orderSchema = new Schema<OrderInfo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        sellerId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        productSnapshot: {
          name: { type: String, required: true },
          brand: { type: String, required: true },
          image: { type: String, required: true },
        },

        variantSnapshot: {
          variantId: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          attributes: [
            {
              key: { type: String },
              value: { type: String },
            },
          ],
        },

        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],

    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    estimatedDelivery: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },

    trackingId: {
      type: String,
    },

    paymentMethod: {
      type: String,
    },

    orderNumber: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentId: {
      type: String,
    },

    paymentProvider: {
      type: String,
    },

    checkoutUrl: {
      type: String,
    },

    stripeCheckoutSessionId: {
      type: String,
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.index({ "items.sellerId": 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });

orderSchema.index({ orderNumber: 1 });

export const Order =
  mongoose.models.Order || mongoose.model<OrderInfo>("Order", orderSchema);
