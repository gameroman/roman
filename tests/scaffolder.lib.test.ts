import { describe, it, expect } from "bun:test";

import { getScaffoldContent } from "#lib/scaffolder";

const defaultFiles = {
  gitignore: `node_modules/\n\ndist/\n`,
  packagejson: `{\n  "private": true,\n  "type": "module"\n}\n`,
  tsconfig: `{\n  "extends": "@gameroman/config/tsconfig",\n  "compilerOptions": {\n    "types": ["bun"]\n  }\n}\n`,
  oxfmt: `import { config } from "@gameroman/config/oxfmt";\n\nexport default config;\n`,
  oxlint: `import { config } from "@gameroman/config/oxlint";\n\nexport default config;\n`,
} as const;

describe("getScaffoldContent", () => {
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
