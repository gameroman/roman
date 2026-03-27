import { defineConfig } from "tsdown";

export default defineConfig({
  exports: {
    enabled: true,
    bin: { roman: "./src/index.ts" },
  },
  deps: {
    neverBundle: ["bun"],
  },
});
