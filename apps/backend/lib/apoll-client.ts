import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // सर्वर का Endpoint
  uri: '/api/graphql', 
  cache: new InMemoryCache(),
});

export default client;