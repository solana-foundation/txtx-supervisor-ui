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
export const GET_PROGRESS_BLOCKS = gql`
  query GetProgressBlocks {
    progressBlocks {
      type
      uuid
      visible
      panel {
        constructDid
        statuses {
          status
          statusColor
          message
          diagnostic
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
      registeredAddons
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
export const PROGRESS_BLOCK_EVENT_SUBSCRIPTION = gql`
  subscription OnProgressBlockEvent {
    progressBlockEvent {
      type
      uuid
      visible
      panel {
        constructDid
        statuses {
          status
          statusColor
          message
          diagnostic
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

export const UPDATE_PROGRESS_BAR_STATUS_SUBSCRIPTION = gql`
  subscription OnProgressBarUpdateEvent {
    updateProgressBarStatusEvent {
      progressBarUuid
      constructDid
      newStatus {
        status
        statusColor
        message
        diagnostic
      }
    }
  }
`;

export const UPDATE_PROGRESS_BAR_VISIBILITY_SUBSCRIPTION = gql`
  subscription OnProgressBarVisibilityUpdate {
    updateProgressBarVisibilityEvent {
      progressBarUuid
      visible
    }
  }
`;

export const RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION = gql`
  subscription OnRunbookCompleted {
    runbookCompleteEvent
  }
`;
