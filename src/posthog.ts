import posthog from "posthog-js";

export default function initializePosthog() {
  posthog.init("phc_mTZO0r156hfsV6JBDN3YGg727kYHXc675NABuHGh6fg", {
    api_host: "https://us.i.posthog.com",
    loaded: function (ph) {
      if (process.env.TXTX_DEV_MODE == "true") {
        ph.opt_out_capturing();
      }
    },
  });
}

export function phLogOnChainSuccess(addonNamespace: string, action: string) {
  console.log("logging posthog success");
  posthog.capture("onchain_success", {
    addonNamespace,
    action,
  });
}

export function phLogOnChainError(
  addonNamespace: string,
  action: string,
  message: string,
) {
  console.log("logging posthog error");
  posthog.capture("onchain_error", {
    addonNamespace,
    action,
    message,
  });
}
