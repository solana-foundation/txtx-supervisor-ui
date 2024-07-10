import { useSubscription } from "@apollo/client";
import {
  ACTION_BLOCK_EVENT_SUBSCRIPTION,
  CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
  ERROR_BLOCK_EVENT_SUBSCRIPTION,
  MODAL_BLOCK_EVENT_SUBSCRIPTION,
  PROGRESS_BLOCK_EVENT_SUBSCRIPTION,
  RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION,
  UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
  UPDATE_PROGRESS_BAR_STATUS_SUBSCRIPTION,
  UPDATE_PROGRESS_BAR_VISIBILITY_SUBSCRIPTION,
} from "../utils/queries";
import { useEffect } from "react";
import {
  ActionBlock,
  ErrorBlock,
  ModalBlock,
  ProgressBarStatusUpdate,
  ProgressBarVisibilityUpdate,
  ProgressBlock,
  UpdateActionItemEvent,
} from "../components/main/types";
import {
  clearBlocks,
  pushProgressBlockStatus,
  setActionBlocks,
  setErrorBlocks,
  setModalBlocks,
  setProgressBlockVisibility,
  setProgressBlocks,
  setRunbookComplete,
  updateActionItems,
} from "../reducers/runbooks-slice";
import { useAppDispatch } from "../hooks";

export default function useSubscriptions() {
  const dispatch = useAppDispatch();
  const { data: actionBlockEvent } = useSubscription(
    ACTION_BLOCK_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: modalBlockEvent } = useSubscription(
    MODAL_BLOCK_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: errorBlockEvent } = useSubscription(
    ERROR_BLOCK_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: progressBlockEvent } = useSubscription(
    PROGRESS_BLOCK_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: updateActionItemsEvent } = useSubscription(
    UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: clearBlocksEvent } = useSubscription(
    CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: updateProgressBarStatusEvent } = useSubscription(
    UPDATE_PROGRESS_BAR_STATUS_SUBSCRIPTION,
    {},
  );
  const { data: updateProgressBarVisibilityEvent } = useSubscription(
    UPDATE_PROGRESS_BAR_VISIBILITY_SUBSCRIPTION,
    {},
  );
  const { data: runbookCompletedEvent } = useSubscription(
    RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION,
    {},
  );

  useEffect(() => {
    if (actionBlockEvent !== undefined) {
      const block: ActionBlock<false> = actionBlockEvent.actionBlockEvent;
      dispatch(setActionBlocks([block]));
    }
  }, [actionBlockEvent]);

  useEffect(() => {
    if (modalBlockEvent !== undefined) {
      const block: ModalBlock<false> = modalBlockEvent.modalBlockEvent;
      dispatch(setModalBlocks([block]));
    }
  }, [modalBlockEvent]);

  useEffect(() => {
    if (errorBlockEvent !== undefined) {
      const block: ErrorBlock<false> = errorBlockEvent.errorBlockEvent;
      dispatch(setErrorBlocks([block]));
    }
  }, [errorBlockEvent]);

  useEffect(() => {
    if (progressBlockEvent !== undefined) {
      const block: ProgressBlock = progressBlockEvent.progressBlockEvent;
      dispatch(setProgressBlocks([block]));
    }
  }, [progressBlockEvent]);

  useEffect(() => {
    if (clearBlocksEvent !== undefined) {
      dispatch(clearBlocks("ActionPanel"));
    }
  }, [clearBlocksEvent]);

  useEffect(() => {
    if (updateActionItemsEvent !== undefined) {
      const updates: UpdateActionItemEvent<false>[] =
        updateActionItemsEvent.updateActionItemsEvent;
      dispatch(updateActionItems(updates));
    }
  }, [updateActionItemsEvent]);

  useEffect(() => {
    if (updateProgressBarStatusEvent !== undefined) {
      const update: ProgressBarStatusUpdate =
        updateProgressBarStatusEvent.updateProgressBarStatusEvent;
      dispatch(pushProgressBlockStatus(update));
    }
  }, [updateProgressBarStatusEvent]);

  useEffect(() => {
    if (updateProgressBarVisibilityEvent !== undefined) {
      const update: ProgressBarVisibilityUpdate =
        updateProgressBarVisibilityEvent.updateProgressBarVisibilityEvent;
      dispatch(setProgressBlockVisibility(update));
    }
  }, [updateProgressBarVisibilityEvent]);

  useEffect(() => {
    if (runbookCompletedEvent !== undefined) {
      dispatch(setRunbookComplete(runbookCompletedEvent));
    }
  }, [runbookCompletedEvent]);
}
