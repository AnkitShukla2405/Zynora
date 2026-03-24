export const cartTypedefs = `#graphql 
type CreateCartResponse {
    success: Boolean!
}

type VariantResponse {
    name: String!
    value: String
}

type CartResult {
    productId: ID!
        variantId: ID!
        title: String!
        brand: String!
        image: String!
        price: Int!
        originalPrice: Int!
        discount: Int!
        quantity: Int!
        maxStock: Int!
        sellerName: String!
        variants: [VariantResponse!]!
}

type CartDataResponse {
        result: [CartResult!]!
        cartLength: Int!
}

type ChangeCartQuantityResponse {
    success: Boolean!
    message: String!
}

type CheckoutReesponse {
    success: Boolean!
    code: String
    message: String!
    redirectTo: String
}

type Query {
  getCartData: CartDataResponse!
  getCheckoutCartData: [CartResult!]!
}

type Mutation {
    createCart(productId: ID!, variantId: ID!, qty: Int!): CreateCartResponse!
    changeCartQuantity(productId: ID!, variantId: ID!, qty: Int!): ChangeCartQuantityResponse!
    proceedToCheckout: CheckoutReesponse!
}
`