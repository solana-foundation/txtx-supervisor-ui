import { useEffect, useCallback, useMemo } from "react";
import { register, Hanko } from "@teamhanko/hanko-elements";
import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import { useAppDispatch } from "../../hooks";
import {
  setMultiPartyAuth,
  setMultiPartyEnabled,
} from "../../reducers/multi-party-slice";

const HANKO_API_URL =
  process.env.HANKO_API_URL ||
  "https://592c32e8-1943-4030-972d-b3bc5f9d3089.hanko.io";

export default function HankoAuth() {
  const dispatch = useAppDispatch();
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
    });
  }, [hanko, redirectAfterLogin]);

  useEffect(() => {
    register(HANKO_API_URL).catch((error) => {
      console.error("hanko error", error);
    });
  }, []);

  const onModalClick = () => {
    dispatch(setMultiPartyEnabled(false));
  };
  return (
    <ModalWrapper visible={true} onClick={onModalClick}>
      <div className="w-content mx-auto">
        <hanko-auth class="hankoComponent" />
      </div>
    </ModalWrapper>
  );
}
