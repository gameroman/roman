import type { Feature, ResolvedConfig } from "./resolver";
import { sortKeys } from "./sort-keys";

interface AstroConfigOptions {
  output: "static" | "server";
  integrations: string[];
  vitePlugins: string[];
}

function generateAstroConfig(config: ResolvedConfig): AstroConfigOptions {
  const features = config.features ?? [];
  const hasSolid = features.includes("solid");
  const hasTailwind = features.includes("tailwind");

  return {
    output: "static",
    integrations: hasSolid ? ["solid()"] : [],
    vitePlugins: hasTailwind ? ["tailwindcss()"] : [],
  };
}

function stringifyArray(arr: string[]) {
  const joined = arr.join(", ");
  return `[${joined}]`;
}

function buildConfigSection(options: AstroConfigOptions): string {
  const lines = [`  output: "${options.output}",`];

  if (options.integrations.length > 0) {
    lines.push(`  integrations: ${stringifyArray(options.integrations)},`);
  }

  if (options.vitePlugins.length > 0) {
    lines.push(`  vite: { plugins: ${stringifyArray(options.vitePlugins)} },`);
  }

  return lines.join("\n");
}

type JsImports = Record<string, string>;

function parseImports(imports: JsImports) {
  return Object.entries(sortKeys(imports))
    .map(([key, value]) => `import ${key} from "${value}";`)
    .join("\n");
}

function serializeAstroConfig(
  options: AstroConfigOptions,
  features: Feature[],
): string {
  const imports: JsImports = {
    "{ defineConfig }": "astro/config",
  };

  if (features.includes("solid")) {
    imports["solid"] = "@astrojs/solid-js";
  }
  if (features.includes("tailwind")) {
    imports["tailwindcss"] = "@tailwindcss/vite";
  }

  const configSection = buildConfigSection(options);

  return `${parseImports(imports)}

export default defineConfig({
${configSection}
});
`;
}

export { generateAstroConfig, serializeAstroConfig };
export type { AstroConfigOptions };
