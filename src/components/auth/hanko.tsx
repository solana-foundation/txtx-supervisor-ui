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
  process.env.HANKO_API_URL || "http://localhost:8000";

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
  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setMultiPartyEnabled(false));
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [dispatch]);

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
