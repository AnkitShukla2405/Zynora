import Seller from "@/model/sellerRegistration.model";
import { Product } from "@/model/productRegistration.model";

import { GraphQLError } from "graphql/error/GraphQLError";
import mongoose from "mongoose";
import { Order } from "@/model/orders.model";
import { success } from "zod";

export enum StockStatus {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
}

export enum Status {
  DRAFT = "draft",
  ACTIVE = "active",
}

// interface ProductImageArgs {
//   url: string;
//   alt?: string;
// }

// interface ProductAttributeArgs {
//   key: string;
//   value: string;
// }

// interface ProductRegistrationArgs {
//   data: {
//     name: string;
//     shortDescription?: string;
//     fullDescription: string;
//     category: string;
//     subCategory: string;
//     mrp: number;
//     sellingPrice: number;
//     discountPercentage?: number;
//     stockQuantity: number;
//     lowStockThreshold?: number;
//     stockStatus: StockStatus;
//     sku: string;
//     mainImage?: ProductImageArgs;
//     galleryImages: ProductImageArgs[];
//     productAttributes: ProductAttributeArgs[];
//     weight?: number;
//     dimensions: string;
//     metaTitle?: string;
//     metaDescription?: string;
//     status: Status;
//     isPublished: boolean;
//   };
// }

export const productRegsitrationResolver = {
  Query: {
    getProductMetrics: async (
      _: unknown,
      __: unknown,
      { user }: { user: any },
    ) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      if (
        !user ||
        !Array.isArray(user.roles) ||
        !user.roles.includes("SELLER")
      ) {
        throw new GraphQLError("Only sellers can upload products", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const seller = await Seller.findOne({
        userId: new mongoose.Types.ObjectId(user._id),
      });

      console.log("Seller found:", seller);
      if (!seller) {
        throw new Error("Seller not found");
      }

      const result = await Product.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(seller._id),
          },
        },

        {
          $facet: {
            totalProducts: [{ $count: "count" }],

            activeProducts: [
              { $match: { isPublished: true, status: { $ne: "draft" } } },
              { $count: "count" },
            ],

            outOfStock: [
              {
                $match: {
                  $or: [{ stockQuantity: 0 }, { stockStatus: "out_of_stock" }],
                },
              },
              { $count: "count" },
            ],
          },
        },

        {
          $project: {
            totalProducts: {
              $ifNull: [{ $arrayElemAt: ["$totalProducts.count", 0] }, 0],
            },
            activeProducts: {
              $ifNull: [{ $arrayElemAt: ["$activeProducts.count", 0] }, 0],
            },
            outOfStock: {
              $ifNull: [{ $arrayElemAt: ["$outOfStock.count", 0] }, 0],
            },
          },
        },
      ]);

      const metrics = result[0] || {
        totalProducts: 0,
        activeProducts: 0,
        outOfStock: 0,
      };

      return {
        success: true,
        pendingOrders: 0,
        ...metrics,
      };
    },

    getProductInfo: async (_: any, __: any, { user }: { user: any }) => {
      if (
        !user ||
        !Array.isArray(user.roles) ||
        !user.roles.includes("SELLER")
      ) {
        throw new GraphQLError("Only sellers can upload products", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const seller = await Seller.findOne({
        userId: new mongoose.Types.ObjectId(user._id),
      });

      console.log("Seller found:", seller);
      if (!seller) {
        throw new Error("Seller not found");
      }

      const page = 1;
      const limit = 10;

      const result = await Product.aggregate([
        {
          $match: { sellerId: seller._id },
        },

        {
          $facet: {
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit },

              {
                $project: {
                  _id: 1,
                  name: 1,
                  sku: 1,
                  category: 1,
                  sellingPrice: 1,
                  stockQuantity: 1,
                  lowStockThreshold: 1,
                  stockStatus: 1,
                  isPublished: 1,
                  createdAt: 1,
                  variants: 1,
                  status: 1,
                },
              },
            ],

            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const agg = result[0];

      const products = agg.data;
      const totalCount = agg.totalCount[0]?.count || 0;

      return {
        data: products.map((p: any) => ({
          id: p._id.toString(),
          image: p.variants?.find((v) => v.variantImages?.length > 0)
            ?.variantImages?.[0]?.key,
          productName: p.name,
          category: p.category,
          price: p.sellingPrice,
          stock: p.variants
            ?.reduce((acc: number, v: any) => acc + v.stock, 0)
            .toString(),
          status: p.isPublished ? "active" : "draft",
          lowStockThreshold: p.lowStockThreshold,
        })),
        totalCount,
        currentPage: page,
      };
    },

    getProductInventoryResponse: async (
      _: any,
      __: any,
      { user }: { user: any },
    ) => {
      if (!user) {
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      if (
        !user._id ||
        !Array.isArray(user.roles) ||
        !user.roles.includes("SELLER")
      ) {
        throw new GraphQLError("Only sellers can upload products", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const seller = await Seller.findOne({
        userId: new mongoose.Types.ObjectId(user._id),
      });

      console.log("Seller found:", seller);
      if (!seller) {
        throw new Error("Seller not found");
      }

      const page = 1;
      const limit = 10;

      const result = await Product.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(seller._id),
          },
        },

        // ✅ break variants into individual documents
        {
          $unwind: "$variants",
        },

        {
          $facet: {
            data: [
              { $sort: { "variants.stock": 1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit },

              {
                $project: {
                  sku: "$variants.sku",
                  name: 1,
                  category: 1,

                  stockLevel: "$variants.stock",
                  reorderLevel: "$lowStockThreshold",

                  stockStatus: {
                    $cond: [
                      { $eq: ["$variants.stock", 0] },
                      "Out of Stock",
                      {
                        $cond: [
                          { $lte: ["$variants.stock", "$lowStockThreshold"] },
                          "Low Stock",
                          "In Stock",
                        ],
                      },
                    ],
                  },

                  color: "$variants.colorName",
                  size: "$variants.size",
                },
              },
            ],

            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const agg = result[0];
      const totalCount = agg.totalCount[0]?.count;
      const product = agg.data;

      return {
        data: product.map((p: any) => ({
          sku: p.sku,
          name: p.name,
          category: p.category,
          stockLevel: p.stockQuantity,
          reorderLevel: p.lowStockThreshold,
          stockStatus: p.stockStatus,
        })),
      };
    },

    getSearchResult: async () => {
      const products = await Product.find({}).lean();

      return products.map((product) => ({
        id: product._id.toString(),
        title: product.name,
        brand: product.brand,
        price: product.sellingPrice,
        originalPrice: product.mrp,
        slug: product.slug,
        rating: null, // future ke liye
        reviewCount: null, // future ke liye
        images:
          product.variants?.[0]?.variantImages?.map((img: any) => img.key) ||
          [],
      }));
    },

    getPdp: async (_: any, { slug, id }: { slug: string; id: string }) => {
      const result = await Product.findById(id);

      if (slug !== result.slug) {
        throw new Error("Invalid slug");
      }

      return {
        _id: result._id.toString(),
        name: result.name,
        brand: result.brand,
        description: result.description,
        category: result.category,
        subCategory: result.subCategory,
        productType: result.productType,
        mrp: result.mrp,
        sellingPrice: result.sellingPrice,
        discountPercentage: result.discountPercentage,
        highlights: result.highlights,
        specifications: result.specifications,
        deliveryTime: result.deliveryTime,
        returnPolicy: result.returnPolicy,
        isReturnable: result.isReturnable,
        variants: result.variants,
        lowStockThreshold: result.lowStockThreshold,
      };
    },

    orders: async (_: any, { filter }: any, { user }: any) => {
      if (!user)
        throw new GraphQLError("User not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      if (user && !user.roles.includes("SELLER")) {
        throw new GraphQLError("Only sellers can access orders", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      try {
        const { search, status, page = 1, limit = 10 } = filter || {};

        const seller = await Seller.findOne({
          userId: new mongoose.Types.ObjectId(user._id),
        });

        if (!seller) {
          throw new GraphQLError("Only sellers can access orders", {
            extensions: { code: "FORBIDDEN" },
          });
        }

        console.log("SELLER: ", seller);

        const sellerId = new mongoose.Types.ObjectId(seller._id);

        const skip = (page - 1) * limit;

        const baseMatch: any = {
          "items.sellerId": sellerId,
        };

        if (search) {
          baseMatch.orderNumber = { $regex: search, $options: "i" };
        }

        if (status !== "ALL") {
          baseMatch.orderStatus = status.toLowerCase();
        }

        const pipeline: any[] = [
          { $match: baseMatch },

          {
            $addFields: {
              items: {
                $filter: {
                  input: "$items",
                  as: "item",
                  cond: {
                    $eq: [
                      { $toString: "$$item.sellerId" },
                      sellerId.toString(),
                    ],
                  },
                },
              },
            },
          },

          {
            $addFields: {
              totalQuantity: {
                $sum: "$items.quantity",
              },
            },
          },

          {
            $addFields: {
              productSummary: {
                $cond: [
                  { $eq: [{ $size: "$items" }, 1] },
                  { $arrayElemAt: ["$items.productSnapshot.name", 0] },
                  {
                    $concat: [
                      { $arrayElemAt: ["$items.productSnapshot.name", 0] },
                      " + ",
                      {
                        $toString: {
                          $subtract: [{ $size: "$items" }, 1],
                        },
                      },
                      " more",
                    ],
                  },
                ],
              },
            },
          },

          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },

          {
            $project: {
              id: { $toString: "$_id" },
              orderNumber: 1,
              createdAt: 1,

              customer: {
                name: "$shippingAddress.fullName",
                city: "$shippingAddress.city",
                state: "$shippingAddress.state",
              },

              productSummary: 1,
              totalQuantity: 1,

              total: "$pricing.total",
              currency: 1,
              paymentStatus: 1,
              status: { $toUpper: "$orderStatus" },
            },
          },
        ];

        const [orders, totalCount] = await Promise.all([
          Order.aggregate(pipeline),
          Order.countDocuments(baseMatch),
        ]);

        return {
          orders,
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        };
      } catch (error) {
        console.error("Order Resolver Error:", error);
        throw new Error("Failed to fetch orders");
      }
    },
  },

  Mutation: {
    registerSellersProduct: async (
      _: unknown,
      { data }: any,
      { user }: { user: any },
    ) => {
      if (
        !user ||
        !Array.isArray(user.roles) ||
        !user.roles.includes("SELLER")
      ) {
        return {
          success: false,
          message: "Only sellers can register products",
        };
      }

      const seller = await Seller.findOne({
        userId: new mongoose.Types.ObjectId(user._id),
      });

      console.log("Seller found:", seller);
      if (!seller) {
        return {
          success: false,
          message: "Seller not found",
        };
      }

      const formattedVariants = data.variants;

      try {
        await Product.create({
          ...data,
          variants: formattedVariants,
          sellerId: seller._id,
        });

        return {
          success: true,
          message: "Product registered successfully",
        };
      } catch (error) {
        console.error(error);

        return {
          success: false,
          message: error.message || "Something went wrong",
        };
      }
    },
  },
};
