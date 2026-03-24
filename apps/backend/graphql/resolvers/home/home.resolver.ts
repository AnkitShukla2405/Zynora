import { Product } from "@/model/productRegistration.model";

export const homeResolvers = {
  Query: {
    getHomePage: async () => {
      const [
        flashDeals,
        trendingProducts,
        electronics,
        fashion,
        home,
        beauty,
      ] = await Promise.all([
        Product.find({}).sort({ discountPercentage: -1 }).limit(6).lean(),
        Product.find({}).sort({ createdAt: -1 }).limit(8).lean(),
        Product.find({ category: "Electronics" }).limit(6).lean(),
        Product.find({ category: "Fashion" }).limit(6).lean(),
        Product.find({ category: "Home" }).limit(6).lean(),
        Product.find({ category: "Beauty" }).limit(6).lean(),
      ]);

      return {
        flashDeals,
        trendingProducts,
        electronics,
        fashion,
        home,
        beauty,
      };
    },
  },

  Product: {
    id: (parent: any) => parent._id.toString(),
  },
};