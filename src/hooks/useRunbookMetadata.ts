import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useAppDispatch } from "../hooks";
import { GET_RUNBOOK_METADATA } from "../utils/queries";
import { setMetadata } from "../reducers/runbooks-slice";

export default function useRunbookMetadata(): { loading: boolean } {
  const dispatch = useAppDispatch();
  const { data, loading } = useQuery<any>(GET_RUNBOOK_METADATA);

  useEffect(() => {
    if (data?.runbook) {
      const { name, description, addonData } = data.runbook;
      const metadata = {
        name,
        description,
        uuid: "",
        addonData,
      };
      dispatch(setMetadata(metadata));
    }
  }, [data, dispatch]);

  return {
    loading,
  };
}
