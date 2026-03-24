import mongoose, { Schema } from "mongoose";

const ProductVariantImageSchema = new Schema({
  key: {
    type: String,
    required: true,
  },

  order: {
    type: Number,
    required: true,
  },
});

const ProductVariantSchema = new Schema({

  sku: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },
  
  
  attributes: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    }
  ],

  variantImages: {
    type: [ProductVariantImageSchema],
    default: [],
  },
});

const ProductSpecificationSchema = new Schema({
  key: {
    type: String,
    required: true,
  },

  value: {
    type: String,
    required: true,
  },
});

const ProductHighLights = new Schema({
  text: {
    type: String,
    required: true,
  },
});

const ProductSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true,
    },
    /* ---------------- BASIC INFO ---------------- */
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },

    description: {
      type: String,
      required: true,
      minLength: 20,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /* ---------------- CATEGORY ---------------- */
    category: {
      type: String,
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      index: true,
    },

    productType: {
      type: String,
      required: true,
      index: true,
    },

    highlights: {
      type: [ProductHighLights],
      default: [],
      required: true,
    },

    /* ---------------- PRICING ---------------- */
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    /* ---------------- INVENTORY ---------------- */
    variants: {
      type: [ProductVariantSchema],
      default: [],
      required: true,
    },

    lowStockThreshold: {
      type: Number,
      required: true,
    },

    specifications: {
      type: [ProductSpecificationSchema],
      default: [],
    },
    /* ---------------- MEDIA ---------------- */
    deliveryTime: {
      type: String,
      default: "3-5 business days",
      required: true,
    },

    returnPolicy: {
      type: String,
    },

    isReturnable: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  },
);

ProductSchema.pre("save", function () {
  if (this.mrp && this.sellingPrice) {
    if (this.sellingPrice > this.mrp) {
      throw new Error("Selling price cannot exceed MRP");
    }

    this.discountPercentage = Math.round(
      ((this.mrp - this.sellingPrice) / this.mrp) * 100,
    );
  }
})
  
ProductSchema.index(
  { "variants.sku": 1, sellerId: 1 },
  { unique: true }
);

ProductSchema.pre("validate", function () {
  const variants = this.variants || [];

  const set = new Set(variants.map((v) => v.sku));

  if (set.size !== variants.length) {
    throw new Error("Duplicate color-size variants are not allowed");
  }
});

ProductSchema.index(
  {
    name: "text",
    description: "text",
    brand: "text",
    category: "text",
    subCategory: "text",
    productType: "text",
    "highlights.text": "text",
    "specifications.value": "text",
    "specifications.key": "text",
  },

  {
    weights: {
      name: 10,
      brand: 9,
      category: 7,
      subCategory: 6,
      productType: 5,
      "highlights.text": 4,
      description: 3,
      "specifications.value": 2,
    },
  },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
