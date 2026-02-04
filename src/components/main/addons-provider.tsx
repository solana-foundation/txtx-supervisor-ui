import { useEffect, useState, ReactNode, FunctionComponentElement } from "react";
import addonManager from "../../utils/addons-initializer";
import { selectActiveFlowData } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";
import React from "react";
import { Result } from "../../utils/result";
import useRunbookMetadata from "../../hooks/useRunbookMetadata";
import { AddonData } from "./types";
import { Addon } from "../../utils/addons";

export interface AddonsProviderProps {
  children: ReactNode;
}

interface AddonModule {
  default: new (rpcApiUrl: string | null) => Addon;
}

const ADDONS: { [key: string]: () => Promise<AddonModule> } = {
  evm: () => import("./addons/evm"),
  svm: () => import("./addons/svm"),
};

export default function AddonsProvider({ children }: AddonsProviderProps) {
  const addonData = useAppSelector(selectActiveFlowData);
  const [loading, setLoading] = useState(true);
  const [WrappedApp, setWrappedApp] = useState<React.ReactElement | null>(null);

  const { loading: metadataLoading } = useRunbookMetadata();

  // we had some weird behavior where the internal component was rendered before and
  // after injecting the addon providers. This was caused because of the `setWrappedApp` causing a
  // rerender. Here, we want to defer the inner components from rendering until we have all of the addons
  // and we can call `setWrappedApp` only once.

  useEffect(() => {
    const loadAddons = async (addonData: AddonData[]) => {
      const injections: InjectorCaller[] = [];
      for (const { addonName, rpcApiUrl } of addonData) {
        const addonImport = ADDONS[addonName];
        if (!addonImport) {
          continue;
        }
        try {
          const addonModule = await addonImport();

          if (!addonModule || !addonModule.default) {
            continue;
          }
          addonManager.registerAddon(
            addonName,
            new addonModule.default(rpcApiUrl),
          );

          injections.push((input: ReactNode) => {
            return ((addon: string) =>
              addonManager.injectProvider(addon, input))(addonName);
          });
        } catch (error) {
          console.error("Failed to load addon", addonName, error);
        }
      }

      const composedInjections = injections.reduceRight(
        (acc, injection) => (input: ReactNode) => {
          const result = injection(input);
          if (result.is_err()) {
            return input;
          }
          return result.unwrap();
        },
        (input: ReactNode) => input,
      );
      setWrappedApp(composedInjections(children));
      setLoading(false);
    };
    setLoading(true);
    if (!metadataLoading) {
      loadAddons(addonData);
    }
  }, [addonData, metadataLoading]);

  if (loading || WrappedApp === null) {
    return <div>Loading...</div>;
  }
  return WrappedApp;
}

type InjectorCaller = (
  inner: ReactNode,
) => Result<React.ReactElement, string>;
