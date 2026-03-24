import { Product } from "@/model/productRegistration.model";
import { v4 as uuid } from "uuid";
import { serialize } from "cookie";
import client from "@/lib/redis";

enum ProductSort {
  RELEVANCE,
  PRICE_LOW,
  PRICE_HIGH,
  NEWEST,
  TOP_RATED,
}

type ProductArgs = {
  sort?: ProductSort;
};

export const searchResolver = {
  Query: {
    search: async (_: any, { filter }: any, {ctx}: {ctx: any}) => {
      const {
        search,
        brands,
        category,
        maxPrice,
        minPrice,
        sort,
        stockStatus,
        page = 1,
        limit = 10,
      } = filter || {};

      let match: any = {};

      if (search) {
        match.$text = { $search: search };
      }

      if (brands && brands.length > 0) {
        match.brand = { $in: brands };
      }

      if (category) {
        match.category = category;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        match.sellingPrice = {};

        if (minPrice !== undefined) {
          match.sellingPrice.$gte = minPrice;
        }

        if (maxPrice !== undefined) {
          match.sellingPrice.$lte = maxPrice;
        }
      }

      let sortOptions: any = {};

      switch (sort) {
        case "PRICE_LOW":
          sortOptions = { sellingPrice: 1 };
          break;

        case "PRICE_HIGH":
          sortOptions = { sellingPrice: -1 };
          break;

        case "NEWEST":
          sortOptions = { createdAt: -1 };
          break;

        case "TOP_RATED":
          sortOptions = { rating: -1 };
          break;

        case "RELEVANCE":
        default:
          sortOptions = search
            ? { score: { $meta: "textScore" }, createdAt: -1 }
            : { createdAt: -1 };
      }

      if (stockStatus === "IN_STOCK") {
        match.variants = { $elemMatch: { stock: { $gt: 0 } } };
      } else if (stockStatus === "OUT_OF_STOCK") {
        match.variants = { $not: { $elemMatch: { stock: { $gt: 0 } } } };
      }

      const pipeLine: any[] = [];

      pipeLine.push({ $match: match });

      if (search) {
        pipeLine.push({
          $addFields: {
            score: { $meta: "textScore" },
          },
        });
      }

      pipeLine.push({
        $facet: {
          products: [
            { $sort: sortOptions },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                id: { $toString: "$_id" },
                title: "$name",
                brands: "$brand",
                price: "$sellingPrice",
                originalPrice: "$mrp",
                slug: 1,
                images: {
                  $map: {
                    input: {
                      $ifNull: [
                        { $arrayElemAt: ["$variants.variantImages", 0] },
                        [],
                      ],
                    },
                    as: "img",
                    in: "$$img.key",
                  },
                },
              },
            },
          ],
          totalCount: [{ $count: "total" }],

          brands: [
            {
              $group: {
                _id: "$brand",
              },
            },

            {
              $project: {
                _id: 0,
                brand: "$_id",
              },
            },

            { $sort: { brand: 1 } },
          ],
        },
      });

      const result = await Product.aggregate(pipeLine);

      const products = result[0]?.products || [];
      const totalCount = result[0]?.totalCount[0]?.total || 0;
      const brand = result[0]?.brands?.map((i: any) => i.brand) || [];

      return {
        products,
        brand,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    },

    searchSuggestions: async (
      _: unknown,
      { query }: { query: string },
      { user, guestId, ctx }: { user: any; guestId: string, ctx: any },
    ) => {
      const q = query.trim();
      if (!q) return [];

      let searchCachingId: string;
      let isGuest = false;

      if (user) {
        searchCachingId = `user:${user._id}:recentSearch`;
      } else {

        let id = guestId;

        if (!id) {
          id = uuid();

        await ctx.request.cookieStore.set("guestId", id, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
        }

        searchCachingId = `guest:${id}:recentSearch`;
        isGuest = true;
      }

      const pipeline = client
        .multi()
        .lRem(searchCachingId, 0, q)
        .lPush(searchCachingId, q)
        .lTrim(searchCachingId, 0, 4);

      if (isGuest) {
        pipeline.expire(searchCachingId, 60 * 60 * 24 * 30);
      }

      await pipeline.exec();

      const result = await Product.find({
        name: { $regex: "^" + q, $options: "i" },
      })
        .limit(5)
        .select("name");

      return result.map((p) => ({
        text: p.name,
        type: "PRODUCT",
      }));
    },

    recentSearches: async (
      _: unknown,
      __: unknown,
      { user, guestId }: { user: any; guestId?: string },
    ) => {
      let key: string;

      if (user) {
        key = `user:${user._id}:recentSearch`;
      } else {
        key = `guest:${guestId}:recentSearch`;
      }

      const searches = await client.lRange(key, 0, 4);

      console.log(searches);

      return searches.map((s: string) => ({
        text: s,
        type: "RECENT",
      }));
    },
  },
};
