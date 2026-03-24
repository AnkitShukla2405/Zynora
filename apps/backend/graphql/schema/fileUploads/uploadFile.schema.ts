export const uploadFileTypeDef = `#graphql

enum UploadType {
  CANCELLED_CHEQUE
  LOGO
}

type AwsFileUploadResponse {
  success: Boolean!
  url: String!
  key: String!
}

type ProductImageUpload {
  url: String!
  key: String!
  order: Int!
  sku: String!
  clientId: String!
}

input ProductVariantImageUploadInput {
  productId: String!
  clientId: String!
  sku: String!
  contentType: String!
  order: Int!
}

type Mutation {
  getUploadUrl(
    type: UploadType!
    contentType: String!
    sellerId: String!
  ): AwsFileUploadResponse!

  productUpload(
    productImages: [ProductVariantImageUploadInput!]!
  ): [ProductImageUpload!]!
}
`;