import type { ResolvedConfig } from "./resolver";

interface PackageJson {
  private: boolean;
  type: string;
  imports?: Record<string, string>;
  scripts: Record<string, string>;
}

const ASTRO_SCRIPTS: Record<string, string> = {
  lint: "biome check",
  format: "biome check --fix",
  dev: "astro dev",
  build: "astro build",
  deploy: "wrangler deploy",
};

const TEMPLATE_SCRIPTS: Record<string, Record<string, string | undefined>> = {
  default: { test: "bun test" },
  executable: { test: "bun test" },
  astro: ASTRO_SCRIPTS,
};

function generatePackageJson(config: ResolvedConfig): PackageJson {
  const template = config.template;
  const features = config.features ?? [];

  const templateScripts = TEMPLATE_SCRIPTS[template] ?? {};
  const scripts: Record<string, string> = {};
  for (const [key, value] of Object.entries(templateScripts)) {
    if (value !== undefined) scripts[key] = value;
  }

  const base: PackageJson = {
    private: true,
    type: "module",
    scripts,
  };

  if (template === "astro") {
    base.imports = {
      "#layout": "./src/layouts/Layout.astro",
    };
    if (features.includes("solid") && features.includes("tailwind")) {
      base.imports["#app"] = "./src/components/App.tsx";
    }
  }

  if (template === "default" || template === "executable") {
    const hasOxlint = features.includes("oxlint");
    const hasTsgolint = features.includes("tsgolint");

    if (!hasOxlint && !hasTsgolint) {
      delete base.scripts["lint"];
    } else {
      base.scripts["lint"] = "oxlint";
    }

    if (features.includes("oxfmt")) {
      base.scripts["format"] = "oxfmt";
    }

    if (features.includes("tsdown")) {
      base.scripts["build"] = "tsdown";
      base.scripts["prepublishOnly"] = "bun run build";
    }
  }

  return base;
}

function serializePackageJson(pkg: PackageJson): string {
  const keys = ["private", "type", "imports", "scripts"] as const;
  const parts: string[] = [];

  for (const key of keys) {
    const value = pkg[key];
    if (value === undefined) continue;
    if (typeof value === "object") {
      const serialized = JSON.stringify(value, null, 2);
      const lines = serialized.split("\n");
      const body = lines.slice(1, -1).join("\n");
      const indentedBody = body
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n");
      parts.push(`  "${key}": {\n${indentedBody}\n  }`);
    } else {
      parts.push(`  "${key}": ${JSON.stringify(value)}`);
    }
  }

  return `{\n${parts.join(",\n")}\n}\n`;
}

export { generatePackageJson, serializePackageJson };
export type { PackageJson };
