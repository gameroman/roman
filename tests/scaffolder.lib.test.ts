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
    "format": "oxfmt"
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
  tsgolint: `import { config } from "@gameroman/config/oxlint/typeaware";

export default config;
`,
} as const;

const tsdownFiles = {
  tsdown: `import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  exports: true,
});
`,
  packagejson: `{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test",
    "lint": "oxlint",
    "format": "oxfmt",
    "build": "tsdown",
    "prepublishOnly": "bun run build"
  }
}
`,
} as const;

const astroFiles = {
  gitignore: `node_modules/

dist/

.astro/
.wrangler/
`,
  packagejson: `{
  "private": true,
  "type": "module",
  "imports": {
    "#layout": "./src/layouts/Layout.astro"
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
  packagejsontailwind: `{
  "private": true,
  "type": "module",
  "imports": {
    "#layout": "./src/layouts/Layout.astro",
    "#styles": "./src/styles/global.css"
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
  packagejsonsolidtailwind: `{
  "private": true,
  "type": "module",
  "imports": {
    "#app": "./src/components/App.tsx",
    "#layout": "./src/layouts/Layout.astro",
    "#styles": "./src/styles/global.css"
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
  tailwindstyles: `@import "tailwindcss";
`,
  tailwind: `/** @type {import('tailwindcss').Config} */
export default {
  content: { files: ["./src/**/*.{ts,tsx,astro}"] },
};
`,
  astrotailwind: `import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
});
`,
  biometailwind: `{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@gameroman/config/biome"],
  "css": { "parser": { "tailwindDirectives": true } }
}
`,
  astrosolid: `import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
});
`,
  astrosolidtailwind: `import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: { plugins: [tailwindcss()] },
});
`,
  tsconfigsolid: `{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "jsxImportSource": "solid-js",
    "jsx": "preserve",
    "types": ["bun"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
`,
  layout: `---
interface Props {
  title: string;
  description: string;
  children: unknown;
}

const canonical = Astro.site
  ? new URL(Astro.url.pathname, Astro.site)
  : undefined;

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="referrer" content="no-referrer-when-downgrade" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />

    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <link rel="canonical" href={canonical} />
  </head>

  <body>
    <slot />
  </body>
</html>
`,
  layouttailwind: `---
import "#styles";

interface Props {
  title: string;
  description: string;
  children: unknown;
}

const canonical = Astro.site
  ? new URL(Astro.url.pathname, Astro.site)
  : undefined;

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="referrer" content="no-referrer-when-downgrade" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />

    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <link rel="canonical" href={canonical} />
  </head>

  <body>
    <slot />
  </body>
</html>
`,
  pagesolidtailwind: `---
import App from "#app";
import Layout from "#layout";

const title = "title";
const description = "description";
---

<Layout {title} {description}>
  <App client:load />
</Layout>
`,
  apptsxtailwind: `import { createSignal } from "solid-js";

function App() {
  return (
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">App</h1>
    </main>
  );
}

export default App;
`,
} as const;

describe("getScaffoldContent", () => {
  describe("default template", () => {
    it("should generate basic files for default template", () => {
      const content = getScaffoldContent({
        template: "default",
        features: ["oxfmt", "oxlint", "tsgolint"],
      });
      expect(content).toEqual({
        files: [
          { path: ".gitignore", content: defaultFiles.gitignore },
          { path: "oxfmt.config.ts", content: defaultFiles.oxfmt },
          { path: "oxlint.config.ts", content: defaultFiles.tsgolint },
          { path: "package.json", content: defaultFiles.packagejson },
          { path: "tsconfig.json", content: defaultFiles.tsconfig },
        ],
        dependencies: {
          dev: [
            "@gameroman/config",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "typescript",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate normal oxlint config without tsgolint feature", () => {
      const content = getScaffoldContent({
        template: "default",
        features: ["oxfmt", "oxlint"],
      });
      expect(content).toEqual({
        files: [
          { path: ".gitignore", content: defaultFiles.gitignore },
          { path: "oxfmt.config.ts", content: defaultFiles.oxfmt },
          { path: "oxlint.config.ts", content: defaultFiles.oxlint },
          { path: "package.json", content: defaultFiles.packagejson },
          { path: "tsconfig.json", content: defaultFiles.tsconfig },
        ],
        dependencies: {
          dev: ["@gameroman/config", "oxfmt", "oxlint", "typescript"],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate tsgolint oxlint config when only tsgolint feature is specified", () => {
      const content = getScaffoldContent({
        template: "default",
        features: ["oxfmt", "tsgolint"],
      });
      expect(content).toEqual({
        files: [
          { path: ".gitignore", content: defaultFiles.gitignore },
          { path: "oxfmt.config.ts", content: defaultFiles.oxfmt },
          { path: "oxlint.config.ts", content: defaultFiles.tsgolint },
          { path: "package.json", content: defaultFiles.packagejson },
          { path: "tsconfig.json", content: defaultFiles.tsconfig },
        ],
        dependencies: {
          dev: [
            "@gameroman/config",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "typescript",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate basic files for default template with tsdown", () => {
      const content = getScaffoldContent({
        template: "default",
        features: ["oxfmt", "oxlint", "tsdown", "tsgolint"],
      });
      expect(content).toEqual({
        files: [
          { path: ".gitignore", content: defaultFiles.gitignore },
          { path: "oxfmt.config.ts", content: defaultFiles.oxfmt },
          { path: "oxlint.config.ts", content: defaultFiles.tsgolint },
          { path: "package.json", content: tsdownFiles.packagejson },
          { path: "tsconfig.json", content: defaultFiles.tsconfig },
          { path: "tsdown.config.ts", content: tsdownFiles.tsdown },
        ],
        dependencies: {
          dev: [
            "@gameroman/config",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "tsdown",
            "typescript",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });
  });

  describe("astro template", () => {
    it("should generate basic files for astro template", () => {
      const content = getScaffoldContent({
        template: "astro",
        features: ["biome", "wrangler"],
      });
      expect(content).toEqual({
        files: [
          { path: "src/layouts/Layout.astro", content: astroFiles.layout },
          { path: ".gitignore", content: astroFiles.gitignore },
          { path: "astro.config.ts", content: astroFiles.astro },
          { path: "biome.jsonc", content: astroFiles.biome },
          { path: "package.json", content: astroFiles.packagejson },
          { path: "tsconfig.json", content: astroFiles.tsconfig },
        ],
        dependencies: {
          default: ["astro"],
          dev: [
            "@biomejs/biome",
            "@gameroman/config",
            "typescript",
            "wrangler",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate astro template with tailwindcss", () => {
      const content = getScaffoldContent({
        template: "astro",
        features: ["biome", "tailwind", "wrangler"],
      });
      expect(content).toEqual({
        files: [
          {
            path: "src/layouts/Layout.astro",
            content: astroFiles.layouttailwind,
          },
          { path: "src/styles/global.css", content: astroFiles.tailwindstyles },
          { path: ".gitignore", content: astroFiles.gitignore },
          { path: "astro.config.ts", content: astroFiles.astrotailwind },
          { path: "biome.jsonc", content: astroFiles.biometailwind },
          { path: "package.json", content: astroFiles.packagejsontailwind },
          { path: "tailwind.config.ts", content: astroFiles.tailwind },
          { path: "tsconfig.json", content: astroFiles.tsconfig },
        ],
        dependencies: {
          default: ["astro", "tailwindcss"],
          dev: [
            "@biomejs/biome",
            "@gameroman/config",
            "@tailwindcss/vite",
            "typescript",
            "wrangler",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate astro template with solidjs", () => {
      const content = getScaffoldContent({
        template: "astro",
        features: ["biome", "solid", "wrangler"],
      });
      expect(content).toEqual({
        files: [
          { path: "src/layouts/Layout.astro", content: astroFiles.layout },
          { path: ".gitignore", content: astroFiles.gitignore },
          { path: "astro.config.ts", content: astroFiles.astrosolid },
          { path: "biome.jsonc", content: astroFiles.biome },
          { path: "package.json", content: astroFiles.packagejson },
          { path: "tsconfig.json", content: astroFiles.tsconfigsolid },
        ],
        dependencies: {
          default: ["astro", "solid-js"],
          dev: [
            "@astrojs/solid-js",
            "@biomejs/biome",
            "@gameroman/config",
            "typescript",
            "wrangler",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });

    it("should generate astro template with solidjs and tailwindcss", () => {
      const content = getScaffoldContent({
        template: "astro",
        features: ["biome", "solid", "tailwind", "wrangler"],
      });
      expect(content).toEqual({
        files: [
          {
            path: "src/layouts/Layout.astro",
            content: astroFiles.layouttailwind,
          },
          {
            path: "src/components/App.tsx",
            content: astroFiles.apptsxtailwind,
          },
          {
            path: "src/pages/index.astro",
            content: astroFiles.pagesolidtailwind,
          },
          { path: "src/styles/global.css", content: astroFiles.tailwindstyles },
          { path: ".gitignore", content: astroFiles.gitignore },
          { path: "astro.config.ts", content: astroFiles.astrosolidtailwind },
          { path: "biome.jsonc", content: astroFiles.biometailwind },
          {
            path: "package.json",
            content: astroFiles.packagejsonsolidtailwind,
          },
          { path: "tailwind.config.ts", content: astroFiles.tailwind },
          { path: "tsconfig.json", content: astroFiles.tsconfigsolid },
        ],
        dependencies: {
          default: ["astro", "solid-js", "tailwindcss"],
          dev: [
            "@astrojs/solid-js",
            "@biomejs/biome",
            "@gameroman/config",
            "@tailwindcss/vite",
            "typescript",
            "wrangler",
          ],
        },
      });
      expect(content).toMatchSnapshot();
    });
  });
});
