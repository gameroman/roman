import { describe, it, expect } from "bun:test";

import { getScaffoldContent } from "#lib/scaffolder";

const defaultFiles = {
  gitignore: `node_modules/

dist/
`,
  packagejson: `{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test",
    "lint": "oxlint",
    "format": "oxfmt",
  }
}
`,
  tsconfig: `{
  "extends": "@gameroman/config/tsconfig",
  "compilerOptions": {
    "types": ["bun"]
  }
}
`,
  oxfmt: `import { config } from "@gameroman/config/oxfmt";

export default config;
`,
  oxlint: `import { config } from "@gameroman/config/oxlint";

export default config;
`,
} as const;

const astroFiles = {
  gitignore: `node_modules/

dist/

.astro/
.wrangler/
`,
  packagejson: `{
  "type": "module",
  "private": true,
  "imports": {
    "#layout": "./src/layouts/Layout.astro",
    "#styles/*": "./src/styles/*.css"
  },
  "scripts": {
    "lint": "biome check",
    "format": "biome check --fix",
    "dev": "astro dev",
    "build": "astro build",
    "deploy": "wrangler deploy"
  }
}
`,
  tsconfig: `{
  "extends": "astro/tsconfigs/strictest",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
`,
  astro: `import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
});
`,
  biome: `{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@gameroman/config/biome"]
}
`,
} as const;

describe("getScaffoldContent", () => {
  describe("default template", () => {
    it("should generate basic files for default template", () => {
      expect(
        getScaffoldContent({
          template: "default",
          features: ["oxfmt", "oxlint"],
          dependencies: {
            dev: ["@gameroman/config", "oxfmt", "oxlint", "typescript"],
          },
        }),
      ).toEqual({
        files: [
          { path: ".gitignore", content: defaultFiles.gitignore },
          { path: "package.json", content: defaultFiles.packagejson },
          { path: "tsconfig.json", content: defaultFiles.tsconfig },
          { path: "oxfmt.config.ts", content: defaultFiles.oxfmt },
          { path: "oxlint.config.ts", content: defaultFiles.oxlint },
        ],
      });
    });
  });

  describe("astro template", () => {
    it("should generate basic files for astro template", () => {
      expect(
        getScaffoldContent({
          template: "astro",
          features: ["biome", "wrangler"],
          dependencies: {
            default: ["astro"],
            dev: [
              "@biomejs/biome",
              "@gameroman/config",
              "typescript",
              "wrangler",
            ],
          },
        }),
      ).toEqual({
        files: [
          { path: ".gitignore", content: astroFiles.gitignore },
          { path: "package.json", content: astroFiles.packagejson },
          { path: "tsconfig.json", content: astroFiles.tsconfig },
          { path: "astro.config.ts", content: astroFiles.astro },
          { path: "biome.jsonc", content: astroFiles.biome },
        ],
      });
    });
  });
});
