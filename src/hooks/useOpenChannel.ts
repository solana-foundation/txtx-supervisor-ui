import { BACKEND_URL } from "../App";
import { AUTH_COOKIE_KEY } from "../hooks/useCookie";
import { ChannelOpenResponse } from "../components/main/multi-player-types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartyEnabled,
  setMultiPartyAuth,
  setMultiPartySharing,
  auth
} from "../reducers/multi-party-slice";

let fetching = false;
export default function useOpenChannel() {
  const dispatch = useAppDispatch();
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);
  const authInfo = useAppSelector(auth);

  if (!authenticated || instantiated || fetching) return;

  const refreshAccessTokenIfExpired = async () => {
    if (!authInfo || !authInfo.accessTokenExp) return;
    const nowInSeconds = Math.floor(Date.now()/1000);
    const accessTokenIsExpired = nowInSeconds > authInfo.accessTokenExp;
    if (!accessTokenIsExpired) return;

    const response = await fetch(`${process.env.ID_SERVICE_URL}/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken: authInfo.refreshToken})
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

  fetching = true;
  refreshAccessTokenIfExpired()
    .then(() => {
      return fetch(`${BACKEND_URL}/api/v1/channels`, {
        credentials: "include",
      });
    }).then(res => {
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
          .then(res => {
            res.json().then((response: ChannelOpenResponse) => {
              dispatch(setMultiPartySharing(response));
            });
          })
          .catch(err => {
            console.error("create channel failed", err);
          }).finally(() => {
            fetching = false;
          });
      }
    }).finally(() => {
      fetching = false;
    });
}
