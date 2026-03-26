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
}

function getTemplate(args: string[]) {
  return args.includes("astro")
    ? "astro"
    : args.includes("exe")
      ? "executable"
      : "default";
}

function resolveConfig(args: string[]): ResolvedConfig {
  const template = getTemplate(args);

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
    } else if (arg === "tsdown") {
      features.push("tsdown");
      devDeps.push("tsdown");
    }
  }

  if (template === "default" || template === "executable") {
    features.push("oxfmt", "oxlint", "tsgolint");
    devDeps.push("oxfmt", "oxlint", "oxlint-tsgolint");
  }

  if (template === "astro") {
    features.push("wrangler");
    devDeps.push("wrangler");
  }

  const result: ResolvedConfig = { template };

  if (features.length > 0) result.features = features.toSorted();

  return result;
}

export { resolveConfig };
export type { Dependencies, ResolvedConfig, Feature };
