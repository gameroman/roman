import type { ResolvedConfig } from "./resolver";

interface FileInfo {
  path: string;
  content: string;
}

interface ScaffoldContent {
  files: FileInfo[];
}

function getScaffoldContent(features: ResolvedConfig): ScaffoldContent {
  const files: FileInfo[] = [];

  if (features.template === "default" || features.template === "executable") {
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

  return { files };
}

export { getScaffoldContent };
export type { ScaffoldContent };
