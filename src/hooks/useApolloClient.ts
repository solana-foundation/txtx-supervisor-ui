import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { BACKEND_URL, BACKEND_WS_URL } from '../App';


export default function useApolloClient(slug: string, tokenNeeded: string, token: string | undefined) {

  if (tokenNeeded && token === undefined) return;
  const authHeader = tokenNeeded && token ? `Bearer ${token}` : "";
  const wsAuthToken = tokenNeeded && token ? token : "";
  
  const httpLink = new HttpLink({
    uri: `${BACKEND_URL}/gql/v1/graphql`,
  });

const httpAuthLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: authHeader,
    },
  };
});


const wsLink = new GraphQLWsLink(
  createClient({
    url: `${BACKEND_WS_URL}/gql/v1/subscriptions`,
    connectionParams: {
      headers: {
        authorization: authHeader,
      },
    },
  })
);

// Splitting based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpAuthLink.concat(httpLink) // Use httpAuthLink with HTTP
);

// Creating Apollo Client
const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
return apolloClient
}