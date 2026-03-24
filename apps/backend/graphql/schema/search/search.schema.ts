export const searchTypedef = `#graphql
# ---------------- ENUMS ----------------

enum ProductSort {
  RELEVANCE
  PRICE_LOW
  PRICE_HIGH
  NEWEST
  TOP_RATED
}

enum StockStatus {
  IN_STOCK
  OUT_OF_STOCK
  ALL
}

enum SuggestionsType {
  PRODUCT
  BRAND
  CATEGORY
  RECENT
}

# ---------------- INPUT ----------------

input ProductFilterInput {
  search: String
  brands: [String!]
  category: String
  minPrice: Float
  maxPrice: Float
  sort: ProductSort
  page: Int
  limit: Int
  stockStatus: StockStatus
}

# ---------------- SEARCH RESULT PRODUCT ----------------

type SearchProduct {
  id: ID!
  title: String!
  brands: String!
  price: Float!
  originalPrice: Float!
  slug: String!
  images: [String!]!
}

# ---------------- PAGINATION ----------------

type ProductPagination {
  products: [SearchProduct!]!
  brand: [String!]!
  totalCount: Int!
  totalPages: Int!
  currentPage: Int!
}


type SearchSuggestions {
  text: String!
  type: SuggestionsType!
}

type SearchSuggestions {
  text: String!
  type: SuggestionsType!
}

# ---------------- QUERY ----------------

type Query {
  search(filter: ProductFilterInput!): ProductPagination!
  searchSuggestions(query: String!): [SearchSuggestions!]!
  recentSearches: [SearchSuggestions!]!
}

`