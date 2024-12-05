import { useEffect, useState } from "react";
import React from "react";
import { ModalWrapper } from "../main/modal-wrapper";
import { useAppDispatch } from "../../hooks";
import {
  setMultiPartyAuth,
  setMultiPartyEnabled,
} from "../../reducers/multi-party-slice";
import useHandleEscapeKey from "../../hooks/useHandleEscapeKey";
import { Authentication, AuthResult } from "@txtxrun/txtx-ui-kit";
import { NhostClient } from "@nhost/react";
import { AUTH_COOKIE_KEY } from "../../hooks/useCookie";

const nhost = new NhostClient({
  subdomain: process.env.NHOST_SUBDOMAIN,
  region: process.env.NHOST_REGION
});

export default function NhostAuth() {
  const [authResult, setAuthResult] = useState<AuthResult | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authResult?.user) {
      const auth = {
        userId: authResult!.user.id,
      };
      document.cookie=`${AUTH_COOKIE_KEY}=Bearer=${authResult.accessToken}`;
      dispatch(setMultiPartyAuth(auth));
    }
  }, [authResult]);

  useHandleEscapeKey(() => {
    dispatch(setMultiPartyEnabled(false));
  }, [dispatch]);

  const onModalClick = () => {
    dispatch(setMultiPartyEnabled(false));
  };
  return (
    <ModalWrapper visible={true} onClick={onModalClick}>
      <div className="w-content mx-auto">
        <Authentication nhost={nhost} setAuthResult={setAuthResult} />
      </div>
    </ModalWrapper>
  );
}
