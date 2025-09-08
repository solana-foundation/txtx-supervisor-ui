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

export default function useQueries(): { loading: boolean } {
  const dispatch = useAppDispatch();

  const { data: actionBlocksData, loading: actionBlocksLoading } =
    useQuery<any>(GET_ACTION_BLOCKS);
  const { data: modalBlocksData, loading: modalBlocksLoading } =
    useQuery<any>(GET_MODAL_BLOCKS);
  const { data: errorBlocksData, loading: errorBlocksLoading } =
    useQuery<any>(GET_ERROR_BLOCKS);
  const { data: logEventsData, loading: logEventsLoading } =
    useQuery<any>(GET_LOG_EVENTS);

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
