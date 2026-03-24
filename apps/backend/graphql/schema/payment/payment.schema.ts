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

type Mutation {
    proceedToPayment(selectedAddressId: ID!): PaymentResponse!
}
`