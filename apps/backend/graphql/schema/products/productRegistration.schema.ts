export const productRegistrationTypedefs = `#graphql

enum StockStatus {
    in_stock
    out_of_stock
}

enum Status {
    draft
    active
}

enum OrderStatus {
  ALL
  PLACED
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

type ProductRegistrationResponse {
    success: Boolean!
    message: String!
}

type ProductMetrics {
    id: String!
    success: Boolean!
    totalProducts: Int!
    activeProducts: Int!
    outOfStock: Int!
    pendingOrders: Int!
}

type ProductData {
    id: String!
    success: Boolean!
    image: String!
    productName: String!
    category: String!
    price: Float!
    stock: String!
    status: Status!
    lowStockThreshold: Int!
}

type PaginatedProductResponse {
    success: Boolean!
    data: [ProductData!]!
    totalCount: Int!
    currentPage: Int!
}

type ProductInventoryResponse {
    sku: String
    name: String!
    category: String!
    stockLevel: Int
    reorderLevel: Int
    stockStatus: String!
}

type  PaginatedInventoryResponse{
    success: Boolean!
    data: [ProductInventoryResponse!]!
    totalCount: Int!
    currentPage: Int!
}


type ProductHighLightResponse {
    text: String!
}

type ProductVariantImagesResponse {
    key: String!
    order: Int!
}

type ProductAttribute {
  key: String!
  value: String!
}

type ProductVariantResponse {
    _id: ID!
    sku: String!
    attributes: [ProductAttribute!]!
    stock: Int!
    variantImages: [ProductVariantImagesResponse!]!
}

type ProductSpecificationResponse {
    key: String!
    value: String!
}



type SearchResponse {
  id: String!
  title: String!
  brand: String!
  price: Float!
  originalPrice: Float!
  rating: Float
  reviewCount:  Int
  slug: String!
  images: [String!]!
}

type ProductSpecificationResponse {
    key: String!
    value: String!
}


type PDPResponse {
 _id: String!
  name: String!
  brand: String!
  description: String!
  category: String!
  subCategory: String!
  productType: String!
  mrp: Float!
  sellingPrice: Float!
  discountPercentage: Float!
  highlights: [ProductHighLightResponse!]!
  specifications: [ProductSpecificationResponse!]!
  deliveryTime: String!
  returnPolicy: String!
  isReturnable: Boolean!
  variants: [ProductVariantResponse!]!
  lowStockThreshold: Int!
}

type Customer {
  name: String!
  city: String!
  state: String!
}

type OrderItem {
  name: String!
  quantity: Int!
}



input OrderFilterInput {
  search: String
  status: OrderStatus
  page: Int = 1
  limit: Int = 10
}

type Order {
  id: ID!
  orderNumber: String!
  createdAt: String!

  customer: Customer!

  productSummary: String!
  totalQuantity: Int!

  total: Float!
  currency: String!

  paymentStatus: String!
  status: OrderStatus!
}

type OrderConnection {
  orders: [Order!]!
  totalCount: Int!
  currentPage: Int!
  totalPages: Int!
}

extend type Query {
    getProductMetrics: ProductMetrics!
    getProductInfo(page: Int!, limit: Int!): PaginatedProductResponse!
    getProductInventoryResponse(page: Int!, limit: Int!): PaginatedInventoryResponse!
    getPdp(slug: String!, id: String!): PDPResponse!
    getSearchResult: [SearchResponse!]!
    orders(filter: OrderFilterInput): OrderConnection!
}



input ProductImageInput {
    key: String!
    order: Int!
}

input ProductHighLightInput {
    text: String!
}

input ProductVariantImagesInput {
    key: String!
    order: Int!
}

input ProductAttributeInput {
  key: String!
  value: String!
}

input ProductVariantInput {
    sku: String!
    stock: Int!
    attributes: [ProductAttributeInput!]
    variantImages: [ProductVariantImagesInput!]!
}

input ProductSpecificationInput {
    key: String!
    value: String!
}

input ProductRegistrationInput {
    name: String!
    brand: String!
    description: String
    slug: String!
    category: String!
    subCategory: String!
    productType: String!
    highlights: [ProductHighLightInput!]!
    mrp: Float!
    sellingPrice: Float!
    discountPercentage: Float
    variants: [ProductVariantInput!]!
    lowStockThreshold: Int
    specifications: [ProductSpecificationInput!]!
    deliveryTime: String!
    returnPolicy: String!
    isReturnable: Boolean!
}

type Mutation {
    registerSellersProduct(data: ProductRegistrationInput!) : ProductRegistrationResponse!
}
`;
