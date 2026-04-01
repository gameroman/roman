import type { ResolvedConfig } from "./resolver";

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

function serializeAstroConfig(options: AstroConfigOptions): string {
  const imports: string[] = [];

  if (options.integrations.some((i) => i.includes("solid"))) {
    imports.push('import solid from "@astrojs/solid-js";');
  }
  if (options.vitePlugins.some((p) => p.includes("tailwind"))) {
    imports.push('import tailwindcss from "@tailwindcss/vite";');
  }

  imports.push('import { defineConfig } from "astro/config";');

  const configSection = buildConfigSection(options);

  return `${imports.join("\n")}

export default defineConfig({
${configSection}
});
`;
}

export { generateAstroConfig, serializeAstroConfig };
export type { AstroConfigOptions };
