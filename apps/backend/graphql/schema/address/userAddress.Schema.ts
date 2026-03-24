export const userAddressTypeDef = `#graphql
enum AddressType {
  HOME
  WORK
}

type UserAddressResponse {
    success: Boolean!
    message: String!
}

input UserAddressInput {
    name: String!
    mobile: String!
    pincode: String!
    city: String!
    address1: String!
    address2: String
    state: String!
    country: String!
    type: AddressType!
}

type AddressResponse {
    id: ID!
    userId: ID!
    name: String!
    mobile: String!
    type: AddressType!
    addressLine: String!
    cityStateZip: String!

}

type Query {
    getSavedAdresses: [AddressResponse!]!
}

type Mutation {
    saveUserAddress(data: UserAddressInput!): UserAddressResponse!
}
`