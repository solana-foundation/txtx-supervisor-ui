import React, { useEffect, useState } from "react";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  selectMultiPartySharing,
  setMultiPartyEnabled,
} from "../../reducers/multi-party-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import CopyIcon from "../icons/copy";
import { TOTP } from "totp-generator";

export default function MultiPartySharing() {
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);
  const sharingData = useAppSelector(selectMultiPartySharing);

  if (!sharingData) return "";
  useEffect(() => {
    if (enabled) {
      if (authenticated) {
        if (!instantiated) {
        }
      } else {
      }
    } else {
      if (authenticated) {
      }
    }
  }, [enabled]);

  return (
    <div className="max-w-64 mr-0 ml-auto flex flex-col gap-1">
      <div className="flex justify-between items-center w-full h-6 px-1 bg-zinc-900 rounded border border-neutral-800">
        <div
          onClick={() => {
            navigator.clipboard.writeText(sharingData.httpEndpointUrl);
          }}
          className="cursor-pointer hover:opacity-90"
        >
          <CopyIcon />
        </div>
        <div className="ml-2 text-gray-400 text-xs font-medium font-inter">
          {sharingData.httpEndpointUrl}
        </div>
      </div>
      <TotpGenerator secret={sharingData.totp} />
    </div>
  );
}

interface TotpGenerator {
  secret: string;
}

const TOTP_PERIOD = 60;
const TOTP_PERIOD_MS = TOTP_PERIOD * 1000;
const getProgress = (timeLeft: number) =>
  Math.round((timeLeft / TOTP_PERIOD_MS) * 100);

const getTimeLeft = (expiresAt: number) => Math.max(expiresAt - Date.now(), 0);
const generateOTP = (base32Totp: string) =>
  TOTP.generate(base32Totp, {
    period: TOTP_PERIOD,
    algorithm: "SHA-256",
  });
function TotpGenerator({ secret }: TotpGenerator) {
  const { otp: token, expires } = generateOTP(secret);
  const [otp, setOtp] = useState(token);
  const [expiresAt, setExpiresAt] = useState(expires);
  const [progress, setProgress] = useState(getProgress(getTimeLeft(expires)));

  useEffect(() => {
    const updateOtp = () => {
      const { otp: token, expires } = generateOTP(secret);
      setExpiresAt(expires);
      setOtp(token);
    };

    const updateProgress = () => {
      const timeLeft = getTimeLeft(expiresAt);
      const newProgress = getProgress(timeLeft);
      setProgress(newProgress);

      if (timeLeft < 1000) {
        updateOtp();
      }
    };

    const intervalId = setInterval(updateProgress, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  return (
    <div className="w-[76px] mr-0 ml-auto">
      <div className="text-center text-emerald-500 text-xs font-normal font-gt">
        {`${otp.substring(0, 3)}-${otp.substring(3, 6)}`}
      </div>
      <div className="w-full h-[1px] bg-black bg-opacity-70">
        <div
          style={{
            width: `${progress}%`,
          }}
          className="h-[1px] bg-emerald-500 transition-width duration-1000 ease-linear"
        ></div>
      </div>
    </div>
  );
}
