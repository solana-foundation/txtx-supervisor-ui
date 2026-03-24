import { useEffect, useState, ReactNode } from "react";
import addonManager from "../../utils/addons-initializer";
import { selectActiveFlowData } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";
import React from "react";
import { Result } from "../../utils/result";
import useRunbookMetadata from "../../hooks/useRunbookMetadata";
import { AddonData } from "../../types/runbook";
import { Addon } from "../../utils/addons";

export interface AddonsProviderProps {
  children: ReactNode;
}

interface AddonModule {
  default: new (rpcApiUrl: string | null) => Addon;
}

interface AddonRegistration {
  load: () => Promise<AddonModule>;
  requiredEnv?: string[];
}

const ADDONS: Record<string, AddonRegistration> = {
  evm: {
    load: () => import("./addons/evm/index"),
    requiredEnv: ["WALLETCONNECT_PROJECT_ID"],
  },
  svm: {
    load: () => import("./addons/svm/index"),
  },
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
        const addonRegistration = ADDONS[addonName];
        if (!addonRegistration) {
          continue;
        }

        const missingEnv = (addonRegistration.requiredEnv ?? []).filter(
          (envName) => !process.env[envName],
        );
        if (missingEnv.length > 0) {
          console.warn(
            `Skipping addon "${addonName}" because required environment variables are missing: ${missingEnv.join(", ")}`,
          );
          continue;
        }

        try {
          const addonModule = await addonRegistration.load();

          if (!addonModule || !addonModule.default) {
            console.error(
              `Addon module for "${addonName}" has no default export`,
            );
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
          console.error(`Failed to load addon "${addonName}"`, error);
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

type InjectorCaller = (inner: ReactNode) => Result<React.ReactElement, string>;
