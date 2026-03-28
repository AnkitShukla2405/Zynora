export const paymentTypeDef = `#graphql

enum PaymentStatus {
    PENDING
    PAID
    FAILED
}

type PaymentResponse {
  success: Boolean
  message: String
  orderId: ID
  checkoutUrl: String
}

type BuyNowResponse {
    success: Boolean
    message: String
}

input BuyNowInput {
    productId: ID!
    variantId: ID!
    quantity: Int!
}


type Mutation {
    buyNow(input: BuyNowInput!): BuyNowResponse!
    proceedToPayment(selectedAddressId: ID!): PaymentResponse!
}
`