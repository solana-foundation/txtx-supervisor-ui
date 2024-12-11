import { BACKEND_URL, ID_SERVICE_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearMultiPartySharing,
  setMultiPartyEnabled,
  setMultiPartyAuth,
  selectAuth
} from "../reducers/multi-party-slice";
import useCookie, { AUTH_COOKIE_KEY } from "./useCookie";

let isDeleting = false;
export default function useDeleteChannel(doDelete: boolean, slug: string) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const cookie = useCookie(AUTH_COOKIE_KEY);
  if (cookie === undefined || !doDelete || isDeleting) return;

  const refreshAccessTokenIfExpired = async () => {
    if (!auth || !auth.accessTokenExp) return;
    const nowInSeconds = Math.floor(Date.now()/1000);
    const accessTokenIsExpired = nowInSeconds > auth.accessTokenExp;
    if (!accessTokenIsExpired) return;

    const response = await fetch(`${ID_SERVICE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken: auth.refreshToken})
    });

    const { accessToken, refreshToken, user, exp } = await response.json();
    const newAuth = {
      accessToken,
      refreshToken,
      user,
      accessTokenExp: exp
    };

    document.cookie=`${AUTH_COOKIE_KEY}=Bearer=${newAuth.accessToken}`;
    dispatch(setMultiPartyAuth(newAuth));
  }

  isDeleting = true;
  refreshAccessTokenIfExpired()
    .then(() => {
      return fetch(`${BACKEND_URL}/api/v1/channels`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
        credentials: "include",
      })
    })
    .then((res) => {
      if (res.status == 200) {
        isDeleting = false;
        dispatch(clearMultiPartySharing());
      } else {
        isDeleting = false; // todo display error to user
        dispatch(setMultiPartyEnabled(true));
      }
    })
    .catch((err) => {
      isDeleting = false;

      console.error("deleting channel failed", err);
    });
}
