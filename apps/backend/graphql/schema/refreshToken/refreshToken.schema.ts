export const refreshTokenTypedefs = `#graphql
type RefreshTokenResponse {
  success: Boolean!
  message: String
}

type LogoutResponse {
  success: Boolean!
  message: String!
}

type Mutation {
    refreshAccessToken: RefreshTokenResponse!
    logout: LogoutResponse!
}
`