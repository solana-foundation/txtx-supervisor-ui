import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { BACKEND_URL, BACKEND_WS_URL, tstMode } from "../App";
import dataset1 from "../../test/dataset1.json";

export default function useApolloClient(
  tokenNeeded: boolean,
  token: string | undefined,
) {
  if (tokenNeeded && token === undefined) return;
  const authHeader = tokenNeeded && token ? `Bearer ${token}` : "";

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

  const wsClient = createClient({
    url: `${BACKEND_WS_URL}/gql/v1/subscriptions`,
    connectionParams: {
      headers: {
        authorization: authHeader,
      },
    },
    on: {
      connected: () => console.log("WebSocket connected"),
      error: (error) => console.error("WebSocket Error:", error),
      closed: () => console.log("WebSocket closed"),
      message: (data) => {
        console.log("WebSocket Received Message:", data);
      },
    },
  });
  const wsLink = new GraphQLWsLink(wsClient);

  const subscriptionLoggerLink = new ApolloLink((operation, forward) => {
    console.log('WebSocket Sent Subscription:', operation.operationName, operation.variables);
    return forward(operation);
  });

  // include interceptors and loggers if running in test mode
  let splitLink
  if (tstMode) {
    splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      subscriptionLoggerLink.concat(wsLink),
      httpInterceptorLink.concat(httpLoggerLink.concat(httpAuthLink.concat(httpLink))),
    );
  } else {
    splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpAuthLink.concat(httpLink),
    );
  }


  // Creating Apollo Client
  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  return apolloClient;
}

const httpLoggerLink = new ApolloLink((operation, forward) => {
  console.log('HTTP Request:', operation.operationName, operation.variables);
  return forward(operation).map((response) => {
    console.log('HTTP Response:', operation.operationName, response);
    return response;
  });
});

const httpInterceptorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response:any) => {
    response = modifyHttpResponseForTestMode(operation, response);
    return response;
  });
});

function modifyHttpResponseForTestMode(operation:any, originalResponse:any) {
  if (originalResponse.data?.actionBlocks) {
    console.log('httpInterceptorLink: modifying server response: ' + operation.operationName)
    originalResponse.data.actionBlocks = dataset1.actionBlocks;
  }
  return originalResponse;
}

