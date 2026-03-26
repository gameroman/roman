type Template = "default" | "astro" | "executable";

type Feature =
  | "biome"
  | "oxfmt"
  | "oxlint"
  | "tsgolint"
  | "solid"
  | "tailwind"
  | "wrangler"
  | "tsdown";

interface Dependencies {
  default?: string[];
  dev?: string[];
}

interface ResolvedConfig {
  template: Template;
  features?: Feature[];
  dependencies?: Dependencies;
}

function resolveConfig(args: string[]): ResolvedConfig {
  const template = args.includes("astro") ? "astro" : "default";
  const features: Feature[] = [];
  const defaultDeps: string[] = [];
  const devDeps: string[] = ["@gameroman/config", "typescript"];

  for (const arg of args) {
    if (arg === "astro") {
      defaultDeps.push("astro");
      features.push("biome");
      devDeps.push("@biomejs/biome");
    } else if (arg === "tailwind") {
      features.push("tailwind");
      defaultDeps.push("tailwindcss");
      devDeps.push("@tailwindcss/vite");
    } else if (arg === "solid") {
      features.push("solid");
      defaultDeps.push("solid-js");
      devDeps.push("@astrojs/solid-js");
    } else if (arg === "oxfmt") {
      features.push("oxfmt");
    } else if (arg === "oxlint") {
      features.push("oxlint");
    }
  }

  if (template === "default") {
    features.push("oxfmt", "oxlint");
    devDeps.push("oxfmt", "oxlint");
  }

  if (template === "astro") {
    features.push("wrangler");
    devDeps.push("wrangler");
  }

  const result: ResolvedConfig = { template };
  if (features.length > 0) result.features = features.toSorted();
  if (defaultDeps.length > 0)
    result.dependencies = { default: defaultDeps.toSorted() };
  if (devDeps.length > 0) {
    result.dependencies = { ...result.dependencies, dev: devDeps.toSorted() };
  }
  return result;
}

export { resolveConfig };
export type { ResolvedConfig };
