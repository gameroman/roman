import { generateAstroConfig, serializeAstroConfig } from "./astro-config";
import { generatePackageJson, serializePackageJson } from "./package-json";
import type {
  ResolvedConfig,
  Dependencies,
  Feature,
  Template,
} from "./resolver";

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

const TSCONFIG_ASTRO_SOLID = `{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "jsxImportSource": "solid-js",
    "jsx": "preserve",
    "types": ["bun"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
`;

const GLOBAL_CSS_TAILWIND = `@import "tailwindcss";
`;

type FileGenerator = (files: FileInfo[], config: ResolvedConfig) => void;

const FEATURES: Partial<Record<Feature, FileGenerator>> = {
  oxfmt(files) {
    files.push({
      path: "oxfmt.config.ts",
      content:
        'import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n',
    });
  },
  oxlint(files, config) {
    const isTypeaware = config.features?.includes("tsgolint");
    files.push({
      path: "oxlint.config.ts",
      content: `import { config } from "@gameroman/config/oxlint${isTypeaware ? "/typeaware" : ""}";\n\nexport default config;\n`,
    });
  },
  tsgolint(files) {
    if (!files.some((f) => f.path === "oxlint.config.ts")) {
      files.push({
        path: "oxlint.config.ts",
        content:
          'import { config } from "@gameroman/config/oxlint/typeaware";\n\nexport default config;\n',
      });
    }
  },
  tsdown(files) {
    files.push({
      path: "tsdown.config.ts",
      content:
        'import { defineConfig } from "tsdown";\n\nexport default defineConfig({\n  dts: true,\n  exports: true,\n});\n',
    });
  },
  biome(files, config) {
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
  tailwind(files) {
    files.push({
      path: "tailwind.config.ts",
      content:
        "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: { files: [\"./src/**/*.{ts,tsx,astro}\"] },\n};\n",
    });
  },
};

type TemplateGenerator = (files: FileInfo[], config: ResolvedConfig) => void;

const TEMPLATES: Record<Template, TemplateGenerator> = {
  default(files, config) {
    files.push({ path: ".gitignore", content: GITIGNORE_DEFAULT });
    files.push({ path: "tsconfig.json", content: TSCONFIG_DEFAULT });
    const pkg = generatePackageJson(config);
    files.push({
      path: "package.json",
      content: serializePackageJson(pkg),
    });
  },
  executable(files, config) {
    TEMPLATES.default(files, config);
  },
  astro(files, config) {
    files.push({ path: ".gitignore", content: GITIGNORE_ASTRO });
    const hasSolid = config.features?.includes("solid");
    const hasTailwind = config.features?.includes("tailwind");
    files.push({
      path: "tsconfig.json",
      content: hasSolid ? TSCONFIG_ASTRO_SOLID : TSCONFIG_ASTRO,
    });
    const pkg = generatePackageJson(config);
    if (hasTailwind) {
      pkg.imports ??= {};
      pkg.imports["#styles"] = "./src/styles/global.css";
    }
    files.push({
      path: "package.json",
      content: serializePackageJson(pkg),
    });
    const astroOptions = generateAstroConfig(config);
    const astroContent = serializeAstroConfig(astroOptions);
    files.push({
      path: "astro.config.ts",
      content: astroContent,
    });
    if (hasTailwind) {
      files.push({
        path: "src/styles/global.css",
        content: GLOBAL_CSS_TAILWIND,
      });
    }
  },
};

function getScaffoldContent(config: ResolvedConfig): ScaffoldContent {
  const files: FileInfo[] = [];
  const features = config.features ?? [];

  const templateFn = TEMPLATES[config.template];
  templateFn(files, config);

  for (const feature of features) {
    const featureFn = FEATURES[feature];
    if (featureFn) featureFn(files, config);
  }

  files.sort((a, b) => {
    const aIsDir = a.path.includes("/");
    const bIsDir = b.path.includes("/");
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.path.localeCompare(b.path);
  });

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
      devDeps.add("oxlint").add("oxlint-tsgolint");
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
