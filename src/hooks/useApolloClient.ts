import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { Defer20220824Handler } from "@apollo/client/incremental";
import { LocalState } from "@apollo/client/local-state";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { BACKEND_URL, BACKEND_WS_URL } from "../App";
import { useMemo } from "react";

export default function useApolloClient() {
  return useMemo(() => {
  const httpLink = new HttpLink({
    uri: `${BACKEND_URL}/gql/v1/graphql`,
  });

  const httpAuthLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${BACKEND_WS_URL}/gql/v1/subscriptions`,
    }),
  );

  // Splitting based on operation type
  const splitLink = ApolloLink.split(
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

  // Creating Apollo Client
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),

    /*
    Inserted by Apollo Client 3->4 migration codemod.
    If you are not using the `@client` directive in your application,
    you can safely remove this option.
    */
    localState: new LocalState({}),

    /*
    Inserted by Apollo Client 3->4 migration codemod.
    If you are not using the `@defer` directive in your application,
    you can safely remove this option.
    */
    incrementalHandler: new Defer20220824Handler(),
  });
  }, []);
}

/*
Start: Inserted by Apollo Client 3->4 migration codemod.
Copy the contents of this block into a `.d.ts` file in your project to enable correct response types in your custom links.
If you do not use the `@defer` directive in your application, you can safely remove this block.
*/

import "@apollo/client";
import { Defer20220824Handler } from "@apollo/client/incremental";

declare module "@apollo/client" {
  export interface TypeOverrides extends Defer20220824Handler.TypeOverrides {}
}

/*
End: Inserted by Apollo Client 3->4 migration codemod.
*/
