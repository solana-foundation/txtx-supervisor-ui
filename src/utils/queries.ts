import { gql } from "@apollo/client";

export const GET_MANUALS = gql`
  query GetManuals {
    manuals {
      uuid
      name
      description
      constructUuids
    }
  }
`;

export const GET_MANUAL = gql`
  query GetManual($manualName: String!) {
    manual(manualName: $manualName) {
      uuid
      data
    }
  }
`;
