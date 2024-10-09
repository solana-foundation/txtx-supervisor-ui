import { useEffect, useState, ReactNode } from "react";
import addonManager from "../../utils/addons-initializer";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";
import React from "react";
import { Result } from "../../utils/result";
import useRunbookMetadata from "../../hooks/useRunbookMetadata";

export interface AddonsProviderProps {
  children: ReactNode;
}

const ADDONS: { [key: string]: () => Promise<any> } = {
  evm: () => import("./addons/evm"),
  stacks: () => import("./addons/stacks"),
  svm: () => import("./addons/svm"),
};

export default function AddonsProvider({ children }: AddonsProviderProps) {
  const { metadata } = useAppSelector(selectRunbook);
  const { registeredAddons } = metadata;
  const [loading, setLoading] = useState(true);
  const [WrappedApp, setWrappedApp] = useState(null as any);


  const { loading: metadataLoading } = useRunbookMetadata();

  // we had some weird behavior where the internal component was rendered before and
  // after injecting the addon providers. This was caused because of the `setWrappedApp` causing a
  // rerender. Here, we want to defer the inner components from rendering until we have all of the addons
  // and we can call `setWrappedApp` only once.

  useEffect(() => {
    const loadAddons = async (registeredAddons: string[]) => {
      const injections: InjectorCaller[] = [];
      for (const addon of registeredAddons) {
        const addonImport = ADDONS[addon];
        if (!addonImport) {
          continue;
        }
        try {
          const addonModule = await addonImport();

          if (!addonModule || !addonModule.default) {
            continue;
          }
          addonManager.registerAddon(addon, new addonModule.default());

          injections.push((input: any) => {
            return ((addon: string) =>
              addonManager.injectProvider(addon, input))(addon);
          });
        } catch (error) {
          console.error("Failed to load addon", addon, error);
        }
      }

      const composedInjections = injections.reduceRight(
        (acc, injection) => (input: any) => {
          const result = injection(input);
          if (result.is_err()) {
            return input;
          }
          return result.unwrap();
        },
        (input: any) => input,
      );
      setWrappedApp(composedInjections(children));
      setLoading(false);
    };
    setLoading(true);
    if (!metadataLoading) {
      loadAddons(registeredAddons);
    }
  }, [registeredAddons, metadataLoading]);

  if (loading || WrappedApp === null) {
    return <div>Loading...</div>;
  }
  return WrappedApp;
}

type InjectorCaller = (
  inner: any,
) => Result<React.FunctionComponentElement<any>, string>;

