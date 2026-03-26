import { describe, it, expect } from "bun:test";

import { getScaffoldContent } from "#lib/scaffolder";

const defaultFiles = {
  gitignore: `node_modules/\n\ndist/\n`,
  packagejson: `{\n  "private": true,\n  "type": "module"\n}\n`,
  tsconfig: `{\n  "extends": "@gameroman/config/tsconfig",\n  "compilerOptions": {\n    "types": ["bun"]\n  }\n}\n`,
} as const;

describe("getScaffoldContent", () => {
  it("should generate basic files for default template", () => {
    expect(
      getScaffoldContent({
        template: "default",
        dependencies: { dev: ["typescript"] },
      }),
    ).toEqual({
      files: [
        { path: ".gitignore", content: defaultFiles.gitignore },
        { path: "package.json", content: defaultFiles.packagejson },
        { path: "tsconfig.json", content: defaultFiles.tsconfig },
      ],
    });
  });
});
