import { BACKEND_URL, ID_SERVICE_URL } from "../App";
import { AUTH_COOKIE_KEY } from "../hooks/useCookie";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartyEnabled,
  setMultiPartyAuth,
  setMultiPartySharing,
  selectAuth
} from "../reducers/multi-party-slice";
import { useEffect } from "react";

let fetching = false;
export default function useOpenChannel() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);
  const auth = useAppSelector(selectAuth);

  const refreshAccessTokenIfExpired = async () => {
    if (!auth || !auth.accessTokenExp) return;
    const nowInSeconds = Math.floor(Date.now()/1000);
    const accessTokenIsExpired = nowInSeconds > auth.accessTokenExp;
    if (!accessTokenIsExpired) return;

    const response = await fetch(`${ID_SERVICE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: auth.refreshToken})
    });
    if (response.status === 200) {
      const { accessToken, refreshToken, user, exp } = await response.json();
      const newAuth = {
        accessToken,
        refreshToken,
        user,
        accessTokenExp: exp,
      };
      document.cookie = `${AUTH_COOKIE_KEY}=Bearer=${newAuth.accessToken}`;
      dispatch(setMultiPartyAuth(newAuth));
    } else {
      console.error("failed to refresh access token", await response.text());
    }
  };

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
    if (!authenticated || instantiated || fetching) {
      return;
    }
    fetching = true;
    try {
      await refreshAccessTokenIfExpired();
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
  }, [fetching, authenticated, instantiated, enabled]);
}
