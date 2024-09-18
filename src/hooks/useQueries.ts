import { useQuery } from "@apollo/client";
import { useAppDispatch } from "../hooks";
import {
  GET_ACTION_BLOCKS,
  GET_ERROR_BLOCKS,
  GET_MODAL_BLOCKS,
  GET_PROGRESS_BLOCKS,
  GET_RUNBOOK_METADATA,
} from "../utils/queries";
import {
  ActionBlock,
  ErrorBlock,
  ModalBlock,
  ProgressBlock,
} from "../components/main/types";
import {
  setActionBlocks,
  setErrorBlocks,
  setMetadata,
  setModalBlocks,
  setProgressBlocks,
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
  const { loading: progressBlocksLoading } = useQuery(GET_PROGRESS_BLOCKS, {
    onCompleted: (data) => {
      const blocks: ProgressBlock[] = data.progressBlocks;
      dispatch(setProgressBlocks(blocks));
    },
  });
  const { loading: runbookMetadataLoading } = useQuery(GET_RUNBOOK_METADATA, {
    onCompleted: (result) => {
      const { name, description, registeredAddons } = result.runbook;
      const metadata = {
        name,
        description,
        uuid: "",
        registeredAddons,
      };
      dispatch(setMetadata(metadata));
    },
  });

  return {
    loading:
      actionBlocksLoading ||
      modalBlocksLoading ||
      progressBlocksLoading ||
      errorBlocksLoading ||
      runbookMetadataLoading,
  };
}
