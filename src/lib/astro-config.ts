import type { ResolvedConfig } from "./resolver";

interface AstroConfigOptions {
  output: "static" | "server" | "hybrid";
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

function serializeAstroConfig(options: AstroConfigOptions): string {
  const imports: string[] = [];
  const lines: string[] = [];

  if (options.integrations.some((i) => i.includes("solid"))) {
    imports.push('import solid from "@astrojs/solid-js";');
  }
  if (options.vitePlugins.some((p) => p.includes("tailwind"))) {
    imports.push('import tailwindcss from "@tailwindcss/vite";');
  }

  imports.push('import { defineConfig } from "astro/config";');

  lines.push("");
  lines.push("export default defineConfig({");

  const configLines: string[] = [];
  configLines.push(`  output: "${options.output}",`);

  if (options.integrations.length > 0) {
    configLines.push(`  integrations: [${options.integrations.join(", ")}],`);
  }

  if (options.vitePlugins.length > 0) {
    configLines.push(
      `  vite: { plugins: [${options.vitePlugins.join(", ")}] },`
    );
  }

  lines.push(configLines.join("\n"));
  lines.push("});");
  lines.push("");

  const importSection = imports.join("\n");
  const configSection = lines.join("\n");

  if (imports.length > 1) {
    return `${importSection}
${configSection}`;
  }
  return `${importSection}
${configSection}`;
}

export { generateAstroConfig, serializeAstroConfig };
export type { AstroConfigOptions };
