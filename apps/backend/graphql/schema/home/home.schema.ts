export const homeTypedefs = `#graphql
type VariantImage {
  key: String!
  order: Int!
}

  type ProductVariant {
    colorName: String
    colorCode: String
    size: String
    sku: String!
    stock: Int!
    variantImages: [VariantImage!]!
  }


  type ProductSpecification {
    key: String!
    value: String!
  }

  type ProductHighlight {
    text: String!
  }

  type Product {
    id: ID!
    name: String!
    brand: String!
    slug: String!

    category: String!
    subCategory: String!
    productType: String!

    highlights: [ProductHighlight!]!
    specifications: [ProductSpecification!]!

    mrp: Float!
    sellingPrice: Float!
    discountPercentage: Float!

    variants: [ProductVariant!]!

    deliveryTime: String!
    returnPolicy: String
    isReturnable: Boolean!
  }

    type HomePage {
    flashDeals: [Product!]!
    trendingProducts: [Product!]!
    electronics: [Product!]!
    fashion: [Product!]!
    home: [Product!]!
    beauty: [Product!]!
  }

  type Query {

    getHomePage: HomePage!
  }


`