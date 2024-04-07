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

export const GET_COMMAND_INSTANCE_STATE = gql`
  query GetCommandInstanceState($manualName: String!, $constructUuid: String!) {
    manual(manualName: $manualName) {
      commandInstanceState(constructUuidString: $constructUuid)
      data
      uuid
    }
  }
`;

export const UPDATE_COMMAND_INPUT = gql`
  mutation UpdateCommandInput(
    $manualName: String!
    $commandUuid: Uuid!
    $inputName: String!
    $value: String!
  ) {
    updateCommandInput(
      manualName: $manualName
      commandUuid: $commandUuid
      inputName: $inputName
      value: $value
    )
  }
`;
