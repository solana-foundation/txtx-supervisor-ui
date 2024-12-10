import { useEffect } from "react";
import { BACKEND_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearMultiPartySharing,
  setMultiPartyEnabled,
  setMultiPartyAuth,
  auth,
} from "../reducers/multi-party-slice";
import useCookie, { AUTH_COOKIE_KEY } from "./useCookie";

let isDeleting = false;
export default function useDeleteChannel(doDelete: boolean, slug: string) {
  const authInfo = useAppSelector(auth);
  const dispatch = useAppDispatch();
  const cookie = useCookie(AUTH_COOKIE_KEY);

  const refreshAccessTokenIfExpired = async () => {
    if (!authInfo || !authInfo.accessTokenExp) return;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const accessTokenIsExpired = nowInSeconds > authInfo.accessTokenExp;
    if (!accessTokenIsExpired) return;

    const response = await fetch(`${process.env.ID_SERVICE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: authInfo.refreshToken }),
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

  const sendDeleteChannel = async () => {
    return fetch(`${BACKEND_URL}/api/v1/channels`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
      credentials: "include",
    });
  };

  const deleteChannel = async () => {
    if (cookie === undefined || !doDelete || isDeleting) return;
    isDeleting = true;

    try {
      await refreshAccessTokenIfExpired();
      const deleteChannelResponse = await sendDeleteChannel();
      if (!deleteChannelResponse) {
        isDeleting = false;
        return;
      }
      if (deleteChannelResponse.status == 200) {
        dispatch(clearMultiPartySharing());
      } else {
        dispatch(setMultiPartyEnabled(true));
      }
    } catch (err) {
      console.error("failed to delete channel", err);
      dispatch(setMultiPartyEnabled(true));
    } finally {
      isDeleting = false;
    }
  };

  useEffect(() => {
    deleteChannel();
  }, [cookie, doDelete, isDeleting]);
}
