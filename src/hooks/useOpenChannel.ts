import { BACKEND_URL } from "../App";
import { ChannelOpenResponse } from "../components/main/multi-player-types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartySharing,
} from "../reducers/multi-party-slice";

export default function useOpenChannel() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);

  console.log(
    `use open channel. enabled: ${enabled}. authenticated: ${authenticated}. instantiated: ${instantiated}`,
  );
  if (!enabled || !authenticated || instantiated) return;

  fetch(`${BACKEND_URL}/api/v1/channels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => {
      res.json().then((response: ChannelOpenResponse) => {
        dispatch(setMultiPartySharing(response));
      });
      console.log("create channel res", res);
    })
    .catch((err) => {
      console.log("create channel failed", err);
    });
}
