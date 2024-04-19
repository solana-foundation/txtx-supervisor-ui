import { gql } from "@apollo/client";

export const GET_PROTOCOL = gql`
  query GetProtocol {
    protocol {
      name
      runbooks {
        uuid
        name
        description
        constructUuids
      }
    }
  }
`;

export const GET_MANUAL = gql`
  query GetRunbook($runbookName: String!) {
    runbook(runbookName: $runbookName) {
      uuid
      data
    }
  }
`;

export const GET_COMMAND_INSTANCE_STATE = gql`
  query GetCommandInstanceState(
    $runbookName: String!
    $constructUuid: String!
  ) {
    runbook(runbookName: $runbookName) {
      commandInstanceState(constructUuidString: $constructUuid)
      data
      uuid
    }
  }
`;

export const UPDATE_COMMAND_INPUT = gql`
  mutation UpdateCommandInput(
    $runbookName: String!
    $commandUuid: Uuid!
    $inputName: String!
    $value: String!
  ) {
    updateCommandInput(
      runbookName: $runbookName
      commandUuid: $commandUuid
      inputName: $inputName
      value: $value
    )
  }
`;
