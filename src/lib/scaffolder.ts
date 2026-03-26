import type { ResolvedConfig, Dependencies } from "./resolver";

interface FileInfo {
  path: string;
  content: string;
}

interface ScaffoldContent {
  files: FileInfo[];
  dependencies: Dependencies;
}

const GITIGNORE_DEFAULT = "node_modules/\n\ndist/\n";
const GITIGNORE_ASTRO = "node_modules/\n\ndist/\n\n.astro/\n.wrangler/\n";

const BIOME_ASTRO = `{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@gameroman/config/biome"]
}
`;

const TSCONFIG_DEFAULT = `{
  "extends": "@gameroman/config/tsconfig",
  "compilerOptions": {
    "types": ["bun"]
  }
}
`;

const TSCONFIG_ASTRO = `{
  "extends": "astro/tsconfigs/strictest",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
`;

const PACKAGEJSON_ASTRO = `{
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
`;

type FileGenerator = (files: FileInfo[]) => void;

const FEATURES: Record<string, FileGenerator> = {
  oxfmt: (files) => {
    files.push({
      path: "oxfmt.config.ts",
      content:
        'import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n',
    });
  },
  oxlint: (files) => {
    files.push({
      path: "oxlint.config.ts",
      content:
        'import { config } from "@gameroman/config/oxlint/typeaware";\n\nexport default config;\n',
    });
  },
  tsdown: (files) => {
    files.push({
      path: "tsdown.config.ts",
      content:
        'import { defineConfig } from "tsdown";\n\nexport default defineConfig({\n  dts: true,\n  exports: true,\n});\n',
    });
  },
  biome: (files) => {
    files.push({
      path: "biome.jsonc",
      content: BIOME_ASTRO,
    });
  },
};

type TemplateGenerator = (files: FileInfo[], features: string[]) => void;

const TEMPLATES: Record<string, TemplateGenerator> = {
  default: (files, features) => {
    files.push({ path: ".gitignore", content: GITIGNORE_DEFAULT });
    files.push({ path: "tsconfig.json", content: TSCONFIG_DEFAULT });
    const scripts: string[] = ['    "test": "bun test"'];
    if (features.includes("oxlint")) scripts.push('    "lint": "oxlint"');
    if (features.includes("oxfmt")) scripts.push('    "format": "oxfmt"');
    files.push({
      path: "package.json",
      content: `{\n  "private": true,\n  "type": "module",\n  "scripts": {\n${scripts.join(",\n")}\n  }\n}\n`,
    });
  },
  executable: (files, features) => {
    const defaultFn = TEMPLATES["default"];
    if (defaultFn) defaultFn(files, features);
  },
  astro: (files, _features) => {
    files.push({ path: ".gitignore", content: GITIGNORE_ASTRO });
    files.push({ path: "tsconfig.json", content: TSCONFIG_ASTRO });
    files.push({
      path: "package.json",
      content: PACKAGEJSON_ASTRO,
    });
    files.push({
      path: "astro.config.ts",
      content:
        'import { defineConfig } from "astro/config";\n\nexport default defineConfig({\n  output: "static",\n});\n',
    });
  },
};

function getScaffoldContent(config: ResolvedConfig): ScaffoldContent {
  const files: FileInfo[] = [];
  const features = config.features ?? [];

  const templateFn = TEMPLATES[config.template];
  if (templateFn) templateFn(files, features);

  for (const feature of features) {
    const featureFn = FEATURES[feature];
    if (featureFn) featureFn(files);
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  const defaultDeps: string[] = [];
  const devDeps: string[] = ["@gameroman/config", "typescript"];

  if (config.template === "astro") {
    defaultDeps.push("astro");
    devDeps.push("@biomejs/biome", "wrangler");
  } else {
    devDeps.push("oxfmt", "oxlint", "oxlint-tsgolint");
  }

  for (const feature of features) {
    if (feature === "tailwind") {
      defaultDeps.push("tailwindcss");
      devDeps.push("@tailwindcss/vite");
    } else if (feature === "solid") {
      defaultDeps.push("solid-js");
      devDeps.push("@astrojs/solid-js");
    } else if (feature === "tsdown") {
      devDeps.push("tsdown");
    }
  }

  const dependencies: Dependencies = { dev: devDeps.toSorted() };
  if (defaultDeps.length > 0) {
    dependencies.default = defaultDeps.toSorted();
  }

  return { files, dependencies };
}

export { getScaffoldContent };
export type { ScaffoldContent, FileInfo };
