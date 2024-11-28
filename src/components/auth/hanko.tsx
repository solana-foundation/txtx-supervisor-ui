import { useEffect, useCallback, useMemo, useState } from "react";
import { register, Hanko } from "@teamhanko/hanko-elements";
import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import { useAppDispatch } from "../../hooks";
import {
  setMultiPartyAuth,
  setMultiPartyEnabled,
} from "../../reducers/multi-party-slice";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import { Authentication, AuthResult } from "@txtxrun/txtx-ui-kit";
import { NhostClient, NhostProvider } from "@nhost/react";

const nhost = new NhostClient({
  subdomain: process.env.NHOST_SUBDOMAIN,
  region: process.env.NHOST_REGION
});

const ID_SERVICE_URL = process.env.ID_SERVICE_URL || "http://localhost:8000";

export default function HankoAuth() {
  const [authResult, setAuthResult] = useState<AuthResult | undefined>();
  const dispatch = useAppDispatch();
  const hanko = useMemo(
    () => new Hanko(ID_SERVICE_URL, { cookieSameSite: "none" }),
    [],
  );

  const redirectAfterLogin = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (authResult?.user) {
      const auth = {
        userId: authResult!.user.id,
      };
      document.cookie=`Bearer=${authResult.accessToken}`;
      dispatch(setMultiPartyAuth(auth));
      redirectAfterLogin();
    }
  }, [authResult]);

  useEffect(() => {
    register(ID_SERVICE_URL).catch((error) => {
      console.error("hanko error", error);
    });
  }, []);

  useHandleEscapeKey(() => {
    dispatch(setMultiPartyEnabled(false));
  }, [dispatch]);

  const onModalClick = () => {
    dispatch(setMultiPartyEnabled(false));
  };
  return (
    <ModalWrapper visible={true} onClick={onModalClick}>
      <div className="w-content mx-auto">
        <NhostProvider nhost={nhost}>
          <Authentication nhost={nhost} setAuthResult={setAuthResult} />
        </NhostProvider>
      </div>
    </ModalWrapper>
  );
}
