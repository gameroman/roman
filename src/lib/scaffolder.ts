import type { ResolvedConfig } from "./resolver";

interface FileInfo {
  path: string;
  content: string;
}

interface ScaffoldContent {
  files: FileInfo[];
}

function getScaffoldContent(config: ResolvedConfig): ScaffoldContent {
  const files: FileInfo[] = [];
  const features = config.features ?? [];

  if (config.template === "default" || config.template === "executable") {
    files.push({
      path: ".gitignore",
      content: "node_modules/\n\ndist/\n",
    });

    const scripts: string[] = [];
    scripts.push('    "test": "bun test"');
    if (features.includes("oxlint")) {
      scripts.push('    "lint": "oxlint"');
    }
    if (features.includes("oxfmt")) {
      scripts.push('    "format": "oxfmt"');
    }

    const scriptEntries = scripts.join(",\n");

    files.push({
      path: "package.json",
      content: `{\n  "private": true,\n  "type": "module",\n  "scripts": {\n${scriptEntries}\n  }\n}\n`,
    });

    files.push({
      path: "tsconfig.json",
      content:
        '{\n  "extends": "@gameroman/config/tsconfig",\n  "compilerOptions": {\n    "types": ["bun"]\n  }\n}\n',
    });
  }

  if (config.template === "astro") {
    files.push({
      path: ".gitignore",
      content: "node_modules/\n\ndist/\n\n.astro/\n.wrangler/\n",
    });

    const imports: Record<string, string> = {
      "#layout": "./src/layouts/Layout.astro",
      "#styles/*": "./src/styles/*.css",
    };

    const scripts: string[] = [];
    if (features.includes("biome")) {
      scripts.push('    "lint": "biome check"');
      scripts.push('    "format": "biome check --fix"');
    }
    scripts.push('    "dev": "astro dev"');
    scripts.push('    "build": "astro build"');
    if (features.includes("wrangler")) {
      scripts.push('    "deploy": "wrangler deploy"');
    }

    const importsLines = Object.entries(imports)
      .map(([key, value]) => `    "${key}": "${value}"`)
      .join(",\n");
    const importsStr = `  "imports": {\n${importsLines}\n  },\n`;
    const scriptEntries = scripts.join(",\n");

    files.push({
      path: "package.json",
      content: `{\n  "type": "module",\n  "private": true,\n${importsStr}  "scripts": {\n${scriptEntries}\n  }\n}\n`,
    });

    files.push({
      path: "tsconfig.json",
      content:
        '{\n  "extends": "astro/tsconfigs/strictest",\n  "include": [".astro/types.d.ts", "**/*"],\n  "exclude": ["dist"]\n}\n',
    });

    files.push({
      path: "astro.config.ts",
      content:
        'import { defineConfig } from "astro/config";\n\nexport default defineConfig({\n  output: "static",\n});\n',
    });

    if (features.includes("biome")) {
      files.push({
        path: "biome.jsonc",
        content:
          '{\n  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",\n  "extends": ["@gameroman/config/biome"]\n}\n',
      });
    }
  }

  if (features.includes("oxfmt")) {
    files.push({
      path: "oxfmt.config.ts",
      content:
        'import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n',
    });
  }

  if (features.includes("oxlint")) {
    files.push({
      path: "oxlint.config.ts",
      content:
        'import { config } from "@gameroman/config/oxlint";\n\nexport default config;\n',
    });
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  return { files };
}

export { getScaffoldContent };
export type { ScaffoldContent, FileInfo };
