import { useEffect, useCallback, useMemo } from "react";
import { register, Hanko } from "@teamhanko/hanko-elements";
import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setMultiPartyAuth,
  setMultiPartySharing,
} from "../../reducers/multi-party-slice";
import { BACKEND_URL } from "../..";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { ChannelOpenResponse } from "../main/multi-player-types";

const HANKO_API_URL = process.env.HANKO_API_URL || "localhost:8000";

export default function HankoAuth() {
  const dispatch = useAppDispatch();
  const { metadata: runbookMetadata } = useAppSelector(selectRunbook);
  const hanko = useMemo(
    () => new Hanko(HANKO_API_URL, { cookieSameSite: "none" }),
    [],
  );

  const redirectAfterLogin = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    hanko.onAuthFlowCompleted((response) => {
      const auth = {
        userId: response.userID,
      };

      dispatch(setMultiPartyAuth(auth));

      fetch(`${BACKEND_URL}/relayer/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: runbookMetadata.name,
          description: runbookMetadata.description,
        }),
        credentials: "include",
      })
        .then((res) => {
          res.json().then((response: ChannelOpenResponse) => {
            dispatch(setMultiPartySharing(response));
          });
          console.log("authenticated backend res", res);
        })
        .catch((err) => {
          console.log("backend auth failed", err);
        });
    });
  }, [hanko, redirectAfterLogin]);

  useEffect(() => {
    register(HANKO_API_URL).catch((error) => {
      console.error("hanko error", error);
    });
  }, []);

  return (
    <ModalWrapper visible={true}>
      <div className="w-content mx-auto">
        <hanko-auth class="hankoComponent" />
      </div>
    </ModalWrapper>
  );
}
