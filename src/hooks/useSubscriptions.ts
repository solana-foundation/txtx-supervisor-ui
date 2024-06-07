import { useSubscription } from "@apollo/client";
import {
  ACTION_BLOCK_EVENT_SUBSCRIPTION,
  CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
  MODAL_BLOCK_EVENT_SUBSCRIPTION,
  PROGRESS_BLOCK_EVENT_SUBSCRIPTION,
  UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
} from "../utils/queries";
import { useEffect } from "react";
import {
  ActionBlock,
  ModalBlock,
  ProgressBlock,
  UpdateActionItemEvent,
} from "../components/main/types";
import {
  clearBlocks,
  setActionBlocks,
  setModalBlocks,
  setProgressBlocks,
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
}
