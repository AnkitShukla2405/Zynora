export const orderTypedefs = `#graphql

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

type OrderItem {
  name: String!
  brand: String!
  image: String!
  qty: Int!
  size: String
  color: String
  price: Int!
}

type Order {
  id: ID!
  status: OrderStatus!
  date: String!
  estimatedDelivery: String
  deliveredOn: String
  address: String!
  items: [OrderItem!]!
  total: Float!
  paymentMethod: String
  trackingId: String
}

type Query {
  getUserOrders: [Order!]!
}

`;