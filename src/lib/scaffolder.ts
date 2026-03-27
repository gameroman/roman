import { generatePackageJson, serializePackageJson } from "./package-json";
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

type FileGenerator = (files: FileInfo[], config: ResolvedConfig) => void;

const FEATURES: Record<string, FileGenerator> = {
  oxfmt: (files) => {
    files.push({
      path: "oxfmt.config.ts",
      content:
        'import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n',
    });
  },
  oxlint: (files, config) => {
    const isTypeaware = config.features?.includes("tsgolint");
    files.push({
      path: "oxlint.config.ts",
      content: `import { config } from "@gameroman/config/oxlint${isTypeaware ? "/typeaware" : ""}";\n\nexport default config;\n`,
    });
  },
  tsgolint: (files) => {
    if (!files.some((f) => f.path === "oxlint.config.ts")) {
      files.push({
        path: "oxlint.config.ts",
        content:
          'import { config } from "@gameroman/config/oxlint/typeaware";\n\nexport default config;\n',
      });
    }
  },
  tsdown: (files) => {
    files.push({
      path: "tsdown.config.ts",
      content:
        'import { defineConfig } from "tsdown";\n\nexport default defineConfig({\n  dts: true,\n  exports: true,\n});\n',
    });
  },
  biome: (files, config) => {
    const hasTailwind = config.features?.includes("tailwind");
    const biomeContent = hasTailwind
      ? `{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@gameroman/config/biome"],
  "css": { "parser": { "tailwindDirectives": true } }
}
`
      : BIOME_ASTRO;
    files.push({
      path: "biome.jsonc",
      content: biomeContent,
    });
  },
  tailwind: (files) => {
    files.push({
      path: "tailwind.config.ts",
      content:
        "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: { files: [\"./src/**/*.{ts,tsx,astro}\"] },\n};\n",
    });
  },
};

type TemplateGenerator = (files: FileInfo[], config: ResolvedConfig) => void;

const TEMPLATES: Record<string, TemplateGenerator> = {
  default: (files, config) => {
    files.push({ path: ".gitignore", content: GITIGNORE_DEFAULT });
    files.push({ path: "tsconfig.json", content: TSCONFIG_DEFAULT });
    const pkg = generatePackageJson(config);
    files.push({
      path: "package.json",
      content: serializePackageJson(pkg),
    });
  },
  executable: (files, config) => {
    TEMPLATES["default"]!(files, config);
  },
  astro: (files, config) => {
    files.push({ path: ".gitignore", content: GITIGNORE_ASTRO });
    files.push({ path: "tsconfig.json", content: TSCONFIG_ASTRO });
    const pkg = generatePackageJson(config);
    files.push({
      path: "package.json",
      content: serializePackageJson(pkg),
    });
    const hasTailwind = config.features?.includes("tailwind");
    const astroContent = hasTailwind
      ? `import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
});
`
      : `import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
});
`;
    files.push({
      path: "astro.config.ts",
      content: astroContent,
    });
  },
};

function getScaffoldContent(config: ResolvedConfig): ScaffoldContent {
  const files: FileInfo[] = [];
  const features = config.features ?? [];

  const templateFn = TEMPLATES[config.template];
  if (templateFn) templateFn(files, config);

  for (const feature of features) {
    const featureFn = FEATURES[feature];
    if (featureFn) featureFn(files, config);
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  const defaultDeps = new Set<string>();
  const devDeps = new Set<string>(["@gameroman/config", "typescript"]);

  if (config.template === "astro") {
    defaultDeps.add("astro");
  }

  for (const feature of features) {
    if (feature === "tailwind") {
      defaultDeps.add("tailwindcss");
      devDeps.add("@tailwindcss/vite");
    } else if (feature === "solid") {
      defaultDeps.add("solid-js");
      devDeps.add("@astrojs/solid-js");
    } else if (feature === "tsdown") {
      devDeps.add("tsdown");
    } else if (feature === "wrangler") {
      devDeps.add("wrangler");
    } else if (feature === "biome") {
      devDeps.add("@biomejs/biome");
    } else if (feature === "oxfmt") {
      devDeps.add("oxfmt");
    } else if (feature === "oxlint") {
      devDeps.add("oxlint");
    } else if (feature === "tsgolint") {
      devDeps.add("oxlint");
      devDeps.add("oxlint-tsgolint");
    }
  }

  const dependencies: Dependencies = { dev: Array.from(devDeps).toSorted() };
  if (defaultDeps.size > 0) {
    dependencies.default = Array.from(defaultDeps).toSorted();
  }

  return { files, dependencies };
}

export { getScaffoldContent };
export type { ScaffoldContent, FileInfo };
