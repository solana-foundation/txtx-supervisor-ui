import { useSubscription } from "@apollo/client/react";
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
  LogEvent,
  ModalBlock,
  RunbookCompletedEvent,
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

interface ActionBlockEventData {
  actionBlockEvent: ActionBlock<false>;
}

interface ModalBlockEventData {
  modalBlockEvent: ModalBlock<false>;
}

interface ErrorBlockEventData {
  errorBlockEvent: ErrorBlock<false>;
}

interface UpdateActionItemsEventData {
  updateActionItemsEvent: UpdateActionItemEvent<false>[];
}

interface ClearBlocksEventData {
  clearBlocksEvent: boolean;
}

interface RunbookCompletedEventData {
  runbookCompleteEvent: RunbookCompletedEvent[];
}

interface LogEventData {
  logEvent: LogEvent;
}

export default function useSubscriptions() {
  const dispatch = useAppDispatch();

  const { data: actionBlockEvent } = useSubscription<ActionBlockEventData>(
    ACTION_BLOCK_EVENT_SUBSCRIPTION,
  );
  const { data: modalBlockEvent } = useSubscription<ModalBlockEventData>(
    MODAL_BLOCK_EVENT_SUBSCRIPTION,
  );
  const { data: errorBlockEvent } = useSubscription<ErrorBlockEventData>(
    ERROR_BLOCK_EVENT_SUBSCRIPTION,
  );
  const { data: updateActionItemsEvent } =
    useSubscription<UpdateActionItemsEventData>(
      UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
    );
  const { data: clearBlocksEvent } = useSubscription<ClearBlocksEventData>(
    CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
  );
  const { data: runbookCompletedEvent } =
    useSubscription<RunbookCompletedEventData>(
      RUNBOOK_COMPLETED_EVENT_SUBSCRIPTION,
    );
  const { data: logEvent } = useSubscription<LogEventData>(
    LOG_EVENT_SUBSCRIPTION,
  );

  useEffect(() => {
    if (actionBlockEvent) {
      const block: ActionBlock<false> = actionBlockEvent.actionBlockEvent;
      dispatch(setActionBlocks([block]));
    }
  }, [actionBlockEvent, dispatch]);

  useEffect(() => {
    if (modalBlockEvent) {
      const block: ModalBlock<false> = modalBlockEvent.modalBlockEvent;
      dispatch(setModalBlocks([block]));
    }
  }, [modalBlockEvent, dispatch]);

  useEffect(() => {
    if (errorBlockEvent) {
      const block: ErrorBlock<false> = errorBlockEvent.errorBlockEvent;
      dispatch(setErrorBlocks([block]));
    }
  }, [errorBlockEvent, dispatch]);

  useEffect(() => {
    if (clearBlocksEvent) {
      dispatch(clearBlocks("ActionPanel"));
    }
  }, [clearBlocksEvent, dispatch]);

  useEffect(() => {
    if (updateActionItemsEvent) {
      const updates: UpdateActionItemEvent<false>[] =
        updateActionItemsEvent.updateActionItemsEvent;
      dispatch(updateActionItems(updates));
    }
  }, [updateActionItemsEvent, dispatch]);

  useEffect(() => {
    if (runbookCompletedEvent) {
      dispatch(setRunbookComplete(runbookCompletedEvent.runbookCompleteEvent));
    }
  }, [runbookCompletedEvent, dispatch]);

  useEffect(() => {
    if (logEvent) {
      dispatch(pushLogEvent(logEvent.logEvent));
    }
  }, [logEvent, dispatch]);
}
