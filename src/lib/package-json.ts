import type { ResolvedConfig, Template } from "./resolver";
import { sortKeys, sortKeysSpecificOrder } from "./sort-keys";

interface PackageJsonImports {
  [key: string]: string;
}

interface PackageJsonScripts {
  [key: string]: string;
}

interface PackageJson {
  name?: string;
  private?: boolean;
  version?: string;
  license?: "MIT";
  files?: string[];
  type: "module";
  imports?: PackageJsonImports;
  scripts: PackageJsonScripts;
}

const ASTRO_SCRIPTS: PackageJsonScripts = {
  lint: "biome check",
  format: "biome check --fix",
  dev: "astro dev",
  build: "astro build",
  deploy: "wrangler deploy",
};

const EXECUTABLE_SCRIPTS: PackageJsonScripts = {
  test: "bun test",
  lint: "oxlint",
  format: "oxfmt",
  dev: "NODE_ENV=development bun run ./src/index.ts",
  build:
    "NODE_ENV=production bun build --minify --compile ./src/index.ts --outfile=dist/bot --target=bun-linux-arm64",
};

const TEMPLATE_SCRIPTS: Partial<Record<Template, PackageJsonScripts>> = {
  astro: ASTRO_SCRIPTS,
  executable: EXECUTABLE_SCRIPTS,
};

function generatePackageJson(config: ResolvedConfig): PackageJson {
  const template = config.template;
  const features = config.features ?? [];

  const templateScripts = TEMPLATE_SCRIPTS[template] ?? { test: "bun test" };
  const scripts: PackageJsonScripts = {};
  for (const [key, value] of Object.entries(templateScripts)) {
    scripts[key] = value;
  }

  const packageJson: PackageJson = { type: "module", scripts };

  switch (template) {
    case "astro": {
      packageJson.private = true;
      packageJson.imports = {
        "#layout": "./src/layouts/Layout.astro",
      };
      if (features.includes("solid") && features.includes("tailwind")) {
        packageJson.imports["#app"] = "./src/components/App.tsx";
      }
      break;
    }
    default: {
      const hasOxlint = features.includes("oxlint");
      const hasTsgolint = features.includes("tsgolint");

      if (!hasOxlint && !hasTsgolint) {
        delete packageJson.scripts["lint"];
      } else {
        packageJson.scripts["lint"] = "oxlint";
      }

      if (features.includes("oxfmt")) {
        packageJson.scripts["format"] = "oxfmt";
      }

      if (features.includes("tsdown")) {
        packageJson.name = "";
        packageJson.version = "0.0.0";
        packageJson.license = "MIT";
        packageJson.files = ["dist"];
        packageJson.scripts["build"] = "tsdown";
        packageJson.scripts["prepublishOnly"] = "bun run build";
      } else {
        packageJson.private = true;
      }
    }
  }

  packageJson.scripts = sortKeysSpecificOrder(packageJson.scripts, [
    "test",
    "lint",
    "format",
    "dev",
    "build",
    "deploy",
    "prepublishOnly",
  ]);

  return packageJson;
}

function serializePackageJson(pkg: PackageJson): string {
  const keys = [
    "name",
    "private",
    "version",
    "license",
    "files",
    "type",
    "imports",
    "scripts",
  ] as const satisfies (keyof PackageJson)[];
  const parts: string[] = [];

  for (const key of keys) {
    const value = pkg[key];
    if (value === undefined) continue;
    if (typeof value !== "object") {
      parts.push(`  "${key}": ${JSON.stringify(value)}`);
      continue;
    }
    let obj = value;
    if (key === "imports") {
      obj = sortKeys(obj);
    }
    const serialized = JSON.stringify(obj, null, 2);
    const lines = serialized.split("\n");
    const body = lines.slice(1, -1).join("\n");
    const indentedBody = body
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");
    parts.push(`  "${key}": {\n${indentedBody}\n  }`);
  }

  return `{\n${parts.join(",\n")}\n}\n`;
}

export { generatePackageJson, serializePackageJson };
export type { PackageJson };
