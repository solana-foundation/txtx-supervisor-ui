import React, { useEffect } from "react";
import { Switch } from "@headlessui/react";
import Incognito from "../icons/incognito";
import MultiParty from "../icons/multi-party";
import {
  isMultiPartyAuthenticated,
  isMultiPartyEnabled,
  isMultiPartyInstantiated,
  setMultiPartyEnabled,
} from "../../reducers/multi-party-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { classNames } from "../../utils/helpers";

export default function MultiPartyToggle() {
  const enabled = useAppSelector(isMultiPartyEnabled);
  const authenticated = useAppSelector(isMultiPartyAuthenticated);
  const instantiated = useAppSelector(isMultiPartyInstantiated);
  const dispatch = useAppDispatch();
  const setEnabled = (isEnabled) => {
    dispatch(setMultiPartyEnabled(isEnabled));
  };
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
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? "bg-emerald-500" : "bg-gray-950",
        "relative inline-flex mr-0 ml-auto h-7 w-[75px] flex-flex  items-center shrink-0 cursor-pointer rounded-full border border-neutral-800 transition-colors duration-200 ease-in-out",
      )}
    >
      <span className="sr-only">Share Runbook</span>
      <span
        className={classNames(
          "ml-[8px] mb-[1px]",
          enabled
            ? "opacity-100 duration-200 ease-in"
            : "opacity-0 duration-100 ease-out",
        )}
      >
        <MultiParty />
      </span>
      <span
        className={classNames(
          enabled ? "translate-x-3" : "-translate-x-[26px]",
          "min-w-8 w-8 h-[22px] bg-zinc-900 rounded-full shadow border border-neutral-800 pointer-events-none relative inline-block transform transition duration-200 ease-in-out",
        )}
      ></span>
      <span
        className={classNames(
          "mr-[2px] mt-[3px] -translate-x-4",
          enabled
            ? "opacity-0 duration-100 ease-out"
            : "opacity-100 duration-200 ease-in",
        )}
      >
        <Incognito />
      </span>
    </Switch>
  );
}
