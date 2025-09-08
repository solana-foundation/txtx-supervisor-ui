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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
              actionStatus
              actionType
            }
          }
        }
      }
    }
  }
`;
export const GET_ERROR_BLOCKS = gql`
  query GetErrorBlocks {
    errorBlocks {
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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
              actionStatus
              actionType
            }
          }
        }
      }
    }
  }
`;
export const GET_LOG_EVENTS = gql`
  query GetLogEvents {
    logs {
      type
      uuid
      summary
      message
      level
      status
    }
  }
`;

export const GET_RUNBOOK_METADATA = gql`
  query GetRunbookMetadata {
    runbook {
      name
      description
      addonData {
        addonName
        rpcApiUrl
      }
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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
              actionStatus
              actionType
            }
          }
        }
      }
    }
  }
`;
export const ERROR_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnErrorBlockEvent {
    errorBlockEvent {
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
              id
              index
              constructInstanceName
              internalKey
              description
              metaDescription
              markdown
              actionStatus
              actionType
            }
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
      id
      actionStatus
      actionType
    }
  }
`;

export const RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION = gql`
  subscription OnRunbookCompleted {
    runbookCompleteEvent {
      constructDid
      constructName
      title
      details
    }
  }
`;

export const LOG_EVENT_SUBSCRIPTION = gql`
  subscription OnLogEvent {
    logEvent {
      type
      uuid
      summary
      message
      level
      status
    }
  }
`;
