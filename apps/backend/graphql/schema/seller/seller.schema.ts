export const SellerTypedef = `#graphql

type SellerSignUpResponse  {
    success: Boolean!
    message: String!
}

type SellerLoignResponse  {
    success: Boolean!
    message: String!
}

input SellerSignUpInput {
    email: String!
    password: String!
    terms: Boolean!
}

input SellerLoginInput {
    email: String!
    password: String!
    isRemember: Boolean
}

type Mutation {
    sellerSignup(data: SellerSignUpInput!): SellerSignUpResponse!
    sellerLogin(data: SellerLoginInput!): SellerLoignResponse!
}
`