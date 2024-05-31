import { useSubscription } from "@apollo/client";
import {
  APPEND_BLOCK_EVENT_SUBSCRIPTION,
  CLEAR_BLOCKS_EVENT_SUBSCRIPTION,
  UPDATE_ACTION_ITEMS_EVENT_SUBSCRIPTION,
} from "../utils/queries";
import { useEffect } from "react";
import {
  BlockAppendEvent,
  UpdateActionItemEvent,
} from "../components/main/types";
import {
  appendBlock,
  clearBlocks,
  updateActionItems,
} from "../reducers/runbooks-slice";
import { useAppDispatch } from "../hooks";

export default function useSubscriptions() {
  const dispatch = useAppDispatch();
  const { data: appendBlockEvent } = useSubscription(
    APPEND_BLOCK_EVENT_SUBSCRIPTION,
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
    if (appendBlockEvent !== undefined) {
      const block: BlockAppendEvent = appendBlockEvent.appendBlockEvent;
      dispatch(appendBlock(block));
    }
  }, [appendBlockEvent]);

  useEffect(() => {
    if (clearBlocksEvent !== undefined) {
      dispatch(clearBlocks(true));
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
