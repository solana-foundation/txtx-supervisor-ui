import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/index.js",
        "src/**/*.d.ts",
        "src/components/runbook/addons/**",
        "src/hooks/useApolloClient.ts",
      ],
    },
  },
});
