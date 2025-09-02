import { useQuery } from "@apollo/client";
import { useAppDispatch } from "../hooks";
import {
  GET_ACTION_BLOCKS,
  GET_ERROR_BLOCKS,
  GET_MODAL_BLOCKS,
  GET_LOG_EVENTS,
  GET_RUNBOOK_METADATA,
} from "../utils/queries";
import {
  ActionBlock,
  ErrorBlock,
  ModalBlock,
  LogEvent,
} from "../components/main/types";
import {
  setActionBlocks,
  setErrorBlocks,
  setMetadata,
  setModalBlocks,
  setLogEvents,
} from "../reducers/runbooks-slice";

export default function useQueries(): { loading: boolean } {
  const dispatch = useAppDispatch();
  const { loading: actionBlocksLoading } = useQuery(GET_ACTION_BLOCKS, {
    onCompleted: (data) => {
      const blocks: ActionBlock<false>[] = data.actionBlocks;
      dispatch(setActionBlocks(blocks));
    },
  });
  const { loading: modalBlocksLoading } = useQuery(GET_MODAL_BLOCKS, {
    onCompleted: (data) => {
      const blocks: ModalBlock<false>[] = data.modalBlocks;
      dispatch(setModalBlocks(blocks));
    },
  });
  const { loading: errorBlocksLoading } = useQuery(GET_ERROR_BLOCKS, {
    onCompleted: (data) => {
      const blocks: ErrorBlock<false>[] = data.errorBlocks;
      dispatch(setErrorBlocks(blocks));
    },
  });
  const { loading: logEventsLoading } = useQuery(GET_LOG_EVENTS, {
    onCompleted: (data) => {
      const blocks: LogEvent[] = data.logs;
      dispatch(setLogEvents(blocks));
    },
  });

  return {
    loading:
      actionBlocksLoading ||
      modalBlocksLoading ||
      logEventsLoading ||
      errorBlocksLoading,
  };
}
