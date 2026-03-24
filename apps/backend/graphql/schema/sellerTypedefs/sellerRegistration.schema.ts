
export const  SellerRegistrationSchemaTypeDefs = `#graphql

enum NatureOfBusiness {
  manufacturer
  reseller
  d2c
  wholesaler
}

type SellerResponse {
    _id: ID!
    gstin: String!
    pan: String!
    businessName: String!
    natureOfBusiness: NatureOfBusiness!
    gstStatus: String!
    address: String!
    city: String!
    state: String!
    pincode: String!
    pickupContactName: String!
    pickupPhone: String!
    returnAddressSame: Boolean!
    returnAddress: String
    returnCity: String
    returnState: String
    returnPincode: String
    accountNumber: String!
    ifsc: String!
    settlementCycle: String!
    bankDocument: String!
    storeLogo: String!
    storeDisplayName: String!
    supportEmail: String!
    storeDescription: String!
}

type IsSellerExistsResponse{
  isExists: Boolean!
  message: String!
}

type SellerRegistrationResponse {
  success: Boolean!
  message: String!
}

type IpResponse {
  success: Boolean!
  message: String!
  ip: String!
}


input SellerRegistrationInput {
    gstin: String!
    pan: String!
    businessName: String!
    businessType: String!
    natureOfBusiness: NatureOfBusiness!
    gstStatus: String!
    address: String!
    city: String!
    state: String!
    pincode: String!
    pickupContactName: String!
    pickupPhone: String!
    returnAddressSame: Boolean!
    returnAddress: String
    returnCity: String
    returnState: String
    returnPincode: String
    accountHolderName: String!
    accountNumber: String!
    ifsc: String!
    settlementCycle: String!
    bankDocument: String!
    storeLogo: String!
    storeDisplayName: String!
    supportEmail: String!
    storeDescription: String!
}

input IsSellerExistsInput{
  gstin: String!
  pan: String!
  storeDisplayName: String!
}


type Query {
  isSellerExists(data: IsSellerExistsInput!): IsSellerExistsResponse!
  getSellerResponse: SellerResponse!
  getIp : IpResponse!
}

type Mutation {
  registerSeller(data: SellerRegistrationInput!) : SellerRegistrationResponse!
}
`