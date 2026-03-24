export const myProfileTypedef = `#graphql

type UserData {
    name: String!
    email:String!
    memberSince: String!
    totalOrders: Int!
}

type UserAddress {
    id: String!
    tag: String!
    default: Boolean!
    line1: String!
    line2: String
}

type UserResponse {
    userData: UserData!
    userAddresses: [UserAddress!]!
}

type AddressDeleteResponse {
    success: Boolean!
    message: String!
}



type Query {
    getUserInfo: UserResponse!
}

type Mutation {
    addressDelete(id: ID!): AddressDeleteResponse!
}

`