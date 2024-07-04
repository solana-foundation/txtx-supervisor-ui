import { BACKEND_URL } from "../App";
import { ChannelOpenResponse } from "../components/main/multi-player-types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartyEnabled,
  setMultiPartySharing,
} from "../reducers/multi-party-slice";

let fetching = false;
export default function useOpenChannel() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);

  if (!authenticated || instantiated || fetching) return;

  fetching = true;
  fetch(`${BACKEND_URL}/api/v1/channels`, {
    credentials: "include",
  }).then((res) => {
    if (res.status === 200) {
      res.json().then((response: ChannelOpenResponse) => {
        if(!enabled) {
            dispatch(setMultiPartyEnabled(true));
        }
        dispatch(setMultiPartySharing(response));
      });
    }
    else if(enabled) {
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
        })
        .catch((err) => {
          console.error("create channel failed", err);
        }).finally(() => {
          fetching = false;
        });
    }
  }).finally(() => {
    fetching = false;
  });
}
