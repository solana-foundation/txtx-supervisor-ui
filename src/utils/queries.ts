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

export const GET_ACTION_BLOCKS = gql`
  query GetActionBlocks {
    actionBlocks {
      type
      uuid
      visible
      panel {
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
  }
`;
export const GET_MODAL_BLOCKS = gql`
  query GetModalBlocks {
    modalBlocks {
      type
      uuid
      visible
      panel {
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
  }
`;
export const GET_PROGRESS_BLOCKS = gql`
  query GetProgressBlocks {
    progressBlocks {
      type
      uuid
      visible
      panel {
        status
        message
        diagnostic
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

export const ACTION_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnActionBlockEvent {
    actionBlockEvent {
      type
      uuid
      visible
      panel {
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
  }
`;
export const MODAL_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnModalBlockEvent {
    modalBlockEvent {
      type
      uuid
      visible
      panel {
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
  }
`;
export const PROGRESS_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnProgressBlockEvent {
    progressBlockEvent {
      type
      uuid
      visible
      panel {
        status
        message
        diagnostic
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
      uuid
      title
      description
      actionStatus
      actionType
    }
  }
`;
