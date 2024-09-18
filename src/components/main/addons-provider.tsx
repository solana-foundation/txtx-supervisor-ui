import { useEffect, useState, ReactNode } from "react";
import addonManager from "../../utils/addons-initializer";
import { selectRunbook } from "../../reducers/runbooks-slice";
import { useAppSelector } from "../../hooks";

export interface AddonsProviderProps {
  children: ReactNode;
}

const ADDONS: { [key: string]: () => Promise<any> } = {
  evm: () => import("./addons/evm"),
  stacks: () => import("./addons/stacks"),
};

export default function AddonsProvider({ children }: AddonsProviderProps) {
  const { metadata } = useAppSelector(selectRunbook);
  const { registeredAddons } = metadata;
  const [loading, setLoading] = useState(true);
  const [WrappedApp, setWrappedApp] = useState(null as any);

  // we had some weird behavior where the internal component was rendered before and
  // after injecting the addon providers. This was caused because of the `setWrappedApp` causing a
  // rerender. Here, we want to defer the inner components from rendering until we have all of the addons
  // and we can call `setWrappedApp` only once.
  let deferredWrap = (callback: any) => callback(children);
  useEffect(() => {
    const loadAddons = async (registeredAddons: string[]) => {
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

          deferredWrap((last: any) => {
            let wrapped = addonManager.injectProvider(addon, last);
            if (wrapped.is_err()) {
              throw new Error(wrapped.unwrap_err());
            }
            return wrapped.unwrap();
          });
        } catch (error) {
          console.error("Failed to load addon", addon, error);
        }
      }
      deferredWrap(setWrappedApp);
    };
    loadAddons(registeredAddons);
  }, [registeredAddons]);

  return WrappedApp;
}
