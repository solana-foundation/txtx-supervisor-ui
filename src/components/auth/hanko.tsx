import { useEffect, useCallback, useMemo } from "react";
import { register, Hanko } from "@teamhanko/hanko-elements";
import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setMultiPartyAuth } from "../../reducers/multi-party-slice";
import { selectRunbook } from "../../reducers/runbooks-slice";

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
