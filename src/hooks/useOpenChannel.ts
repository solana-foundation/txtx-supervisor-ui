import { BACKEND_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartyEnabled,
  setMultiPartySharing,
  selectIsAccessTokenExpired
} from "../reducers/multi-party-slice";
import { useEffect } from "react";

let fetching = false;
export default function useOpenChannel() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);
  const accessTokenIsExpired = useAppSelector(selectIsAccessTokenExpired);

  const getOpenChannel = async () => {
    return await fetch(`${BACKEND_URL}/api/v1/channels`, {
      credentials: "include",
    });
  };

  const postOpenChannel = async () => {
    return await fetch(`${BACKEND_URL}/api/v1/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  };

  const openChannel = async () => {
    if (!authenticated || instantiated || fetching || accessTokenIsExpired) {
      return;
    }
    fetching = true;
    try {
      const getOpenChannelResponse = await getOpenChannel();

      if (getOpenChannelResponse.status === 200) {
        const channelData = await getOpenChannelResponse.json();

        if (!enabled) {
          dispatch(setMultiPartyEnabled(true));
        }
        dispatch(setMultiPartySharing(channelData));
      } else if (enabled) {
        const openChannelResponse = await postOpenChannel();

        if (openChannelResponse.status === 200) {
          const channelData = await openChannelResponse.json();

          dispatch(setMultiPartySharing(channelData));
        } else {
          dispatch(setMultiPartyEnabled(false));
          const err = await openChannelResponse.text();
          console.error("create channel failed", err);
        }
      }
    } catch (err) {
      console.error("failed to open channel", err);
      dispatch(setMultiPartyEnabled(false));
    } finally {
      fetching = false;
    }
  };

  useEffect(() => {
    openChannel();
  }, [fetching, authenticated, instantiated, enabled, accessTokenIsExpired]);
}
