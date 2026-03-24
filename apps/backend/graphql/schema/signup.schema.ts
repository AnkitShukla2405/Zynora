export const UserTypeDefs = `#graphql

type User {
  _id: ID!
  identifier: String!
  isVerified: Boolean!
  createdAt: String!
}



type SendOtpResponse {
success: Boolean!
message: String!
}

type VerifyOtpResponse{
  success: Boolean!
  message: String!
  cookies: [String]
}

input SendOtpInput {
  identifier: String!
  deviceId: String!

}



input VerifyInput {
  identifier: String!
  otp: String!
}

type Query {
  _empty: String
}

type GoogleLoginResponse {
  success: Boolean!
  message: String!
  cookies: [String]
}

type Mutation {
  sendOtp(data: SendOtpInput!): SendOtpResponse!
  verifyOtp(data: VerifyInput!): VerifyOtpResponse!
  googleLogin(email: String!): GoogleLoginResponse!
}

`;
