import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useAppDispatch } from "../hooks";
import {
  GET_ACTION_BLOCKS,
  GET_ERROR_BLOCKS,
  GET_MODAL_BLOCKS,
  GET_LOG_EVENTS,
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
  setModalBlocks,
  setLogEvents,
} from "../reducers/runbooks-slice";

interface ActionBlocksQueryData {
  actionBlocks: ActionBlock<false>[];
}

interface ModalBlocksQueryData {
  modalBlocks: ModalBlock<false>[];
}

interface ErrorBlocksQueryData {
  errorBlocks: ErrorBlock<false>[];
}

interface LogEventsQueryData {
  logs: LogEvent[];
}

export default function useQueries(): { loading: boolean } {
  const dispatch = useAppDispatch();

  const { data: actionBlocksData, loading: actionBlocksLoading } =
    useQuery<ActionBlocksQueryData>(GET_ACTION_BLOCKS);
  const { data: modalBlocksData, loading: modalBlocksLoading } =
    useQuery<ModalBlocksQueryData>(GET_MODAL_BLOCKS);
  const { data: errorBlocksData, loading: errorBlocksLoading } =
    useQuery<ErrorBlocksQueryData>(GET_ERROR_BLOCKS);
  const { data: logEventsData, loading: logEventsLoading } =
    useQuery<LogEventsQueryData>(GET_LOG_EVENTS);

  useEffect(() => {
    if (actionBlocksData?.actionBlocks) {
      const blocks: ActionBlock<false>[] = actionBlocksData.actionBlocks;
      dispatch(setActionBlocks(blocks));
    }
  }, [actionBlocksData, dispatch]);

  useEffect(() => {
    if (modalBlocksData?.modalBlocks) {
      const blocks: ModalBlock<false>[] = modalBlocksData.modalBlocks;
      dispatch(setModalBlocks(blocks));
    }
  }, [modalBlocksData, dispatch]);

  useEffect(() => {
    if (errorBlocksData?.errorBlocks) {
      const blocks: ErrorBlock<false>[] = errorBlocksData.errorBlocks;
      dispatch(setErrorBlocks(blocks));
    }
  }, [errorBlocksData, dispatch]);

  useEffect(() => {
    if (logEventsData?.logs) {
      const blocks: LogEvent[] = logEventsData.logs;
      dispatch(setLogEvents(blocks));
    }
  }, [logEventsData, dispatch]);

  return {
    loading:
      actionBlocksLoading ||
      modalBlocksLoading ||
      logEventsLoading ||
      errorBlocksLoading,
  };
}
