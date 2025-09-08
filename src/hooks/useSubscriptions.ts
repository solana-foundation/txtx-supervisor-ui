import { useSubscription } from "@apollo/client";
import {
  ACTION_BLOCK_EVENT_SUBSCRIPTION,
  CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
  ERROR_BLOCK_EVENT_SUBSCRIPTION,
  LOG_EVENT_SUBSCRIPTION,
  MODAL_BLOCK_EVENT_SUBSCRIPTION,
  RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION,
  UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
} from "../utils/queries";
import { useEffect } from "react";
import {
  ActionBlock,
  ErrorBlock,
  ModalBlock,
  UpdateActionItemEvent,
} from "../components/main/types";
import {
  clearBlocks,
  pushLogEvent,
  setActionBlocks,
  setErrorBlocks,
  setModalBlocks,
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
  const { data: updateActionItemsEvent } = useSubscription(
    UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: clearBlocksEvent } = useSubscription(
    CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
    {},
  );
  const { data: runbookCompletedEvent } = useSubscription(
    RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION,
    {},
  );

  const { data: logEvent } = useSubscription(LOG_EVENT_SUBSCRIPTION, {});

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
    if (runbookCompletedEvent !== undefined) {
      dispatch(setRunbookComplete(runbookCompletedEvent.runbookCompleteEvent));
    }
  }, [runbookCompletedEvent]);

  useEffect(() => {
    if (logEvent !== undefined) {
      dispatch(pushLogEvent(logEvent.logEvent));
    }
  }, [logEvent]);
}
