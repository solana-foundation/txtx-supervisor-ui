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

export const GET_BLOCKS = gql`
  query GetBlocks {
    blocks {
      uuid
      title
      description
      groups {
        title
        subGroups {
          allowBatchCompletion
          actionItems {
            uuid
            index
            title
            description
            actionStatus
            actionType
          }
        }
      }
    }
  }
`;
export const GET_RUNBOOK_METADATA = gql`
  query GetRunbookMetadata {
    runbook {
      name
      description
    }
  }
`;

export const UPDATE_ACTION_ITEM = gql`
  mutation UpdateActionItem($event: String!) {
    updateActionItem(event: $event)
  }
`;
