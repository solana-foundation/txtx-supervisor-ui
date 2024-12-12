import { useEffect } from "react";
import { BACKEND_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearMultiPartySharing,
  setMultiPartyEnabled,
  selectIsAccessTokenExpired,
} from "../reducers/multi-party-slice";
import useCookie, { AUTH_COOKIE_KEY } from "./useCookie";

let isDeleting = false;
export default function useDeleteChannel(doDelete: boolean, slug: string) {
  const dispatch = useAppDispatch();
  const cookie = useCookie(AUTH_COOKIE_KEY);
  const accessTokenIsExpired = useAppSelector(selectIsAccessTokenExpired);

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
    if (cookie === undefined || !doDelete || isDeleting || accessTokenIsExpired) return;
    isDeleting = true;

    try {
      if (accessTokenIsExpired) return;
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
  }, [cookie, doDelete, isDeleting, accessTokenIsExpired]);
}
