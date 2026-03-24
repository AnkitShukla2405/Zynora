export const uiTypedefs = `#graphql
type SellerAuthResponse {
email: String!
}

type SellerNameUIResponse {
    name: String!
    image: String!
}

type IsUserExists {
    isUserExist: Boolean!
}

type Query {
    getSellerAuthForEmail: SellerAuthResponse!
    getSellerNameForUi: SellerNameUIResponse!
    isUserExists: IsUserExists!
}
`