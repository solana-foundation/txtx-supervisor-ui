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
      type
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

export const APPEND_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnAppendBlockEvent {
    appendBlockEvent {
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

export const CLEAR_BLOCKS_EVENT_SUBSCRIPTION = gql`
  subscription OnClearBlockEvent {
    clearBlocksEvent
  }
`;

export const UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION = gql`
  subscription OnUpdateActionItems {
    updateActionItemsEvent {
      actionItemUuid
      newStatus
    }
  }
`;
