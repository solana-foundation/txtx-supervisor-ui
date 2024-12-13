import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearMultiPartyAuth, setMultiPartyAuth, selectAuth, selectIsAccessTokenExpired } from "../reducers/multi-party-slice";
import { AUTH_COOKIE_KEY } from "./useCookie";
import { ID_SERVICE_URL } from "../App";
import { storeCookie, deleteCookie } from "../utils/helpers";

let isFetching = false;
export default function useRefreshAccessToken () {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const accessTokenIsExpired = useAppSelector(selectIsAccessTokenExpired);

  const refreshToken = async function () {
    if (!auth || !accessTokenIsExpired || isFetching) return;

    isFetching = true;
    try {
      const response = await fetch(`${ID_SERVICE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken })
      });

      if (response.status === 200) {
        const { accessToken, refreshToken, user, exp } = await response.json();
        const newAuth = {
          accessToken,
          refreshToken,
          user,
          accessTokenExp: exp
        };

        storeCookie(AUTH_COOKIE_KEY, `Bearer=${newAuth.accessToken}`);
        dispatch(setMultiPartyAuth(newAuth));
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("failed to refresh access token", error);
      dispatch(clearMultiPartyAuth());
      deleteCookie(AUTH_COOKIE_KEY);
    } finally {
      isFetching = false;
    };
  }

  useEffect(() => {
    refreshToken();
  }, [auth, accessTokenIsExpired]);
}
