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

  if (config.template === "default" || config.template === "executable") {
    files.push({
      path: ".gitignore",
      content: "node_modules/\n\ndist/\n",
    });

    files.push({
      path: "package.json",
      content: '{\n  "private": true,\n  "type": "module"\n}\n',
    });

    files.push({
      path: "tsconfig.json",
      content:
        '{\n  "extends": "@gameroman/config/tsconfig",\n  "compilerOptions": {\n    "types": ["bun"]\n  }\n}\n',
    });
  }

  const features = config.features ?? [];

  if (features.includes("oxfmt")) {
    files.push({
      path: "oxfmt.config.ts",
      content: 'import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n',
    });
  }

  if (features.includes("oxlint")) {
    files.push({
      path: "oxlint.config.ts",
      content: 'import { config } from "@gameroman/config/oxlint";\n\nexport default config;\n',
    });
  }

  return { files };
}

export { getScaffoldContent };
export type { ScaffoldContent };
