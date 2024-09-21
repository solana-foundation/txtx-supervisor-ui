import { useQuery } from "@apollo/client";
import { useAppDispatch } from "../hooks";
import { GET_RUNBOOK_METADATA } from "../utils/queries";
import { setMetadata } from "../reducers/runbooks-slice";

export default function useRunbookMetadata(): {
  loading: boolean;
} {
  const dispatch = useAppDispatch();
  const { loading } = useQuery(GET_RUNBOOK_METADATA, {
    onCompleted: (result) => {
      const { name, description, registeredAddons } = result.runbook;
      const metadata = {
        name,
        description,
        uuid: "",
        registeredAddons,
      };
      dispatch(setMetadata(metadata));
      return metadata;
    },
  });

  return {
    loading,
  };
}
