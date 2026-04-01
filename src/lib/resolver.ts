type Template = "default" | "lib" | "astro" | "executable";

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
      : args.includes("lib")
        ? "lib"
        : "default";
}

function resolveConfig(args: string[]): ResolvedConfig {
  const template = getTemplate(args);

  const features = new Set<Feature>();

  for (const arg of args) {
    if (arg === "solid") {
      features.add("solid");
    }
  }

  if (template === "astro") {
    features.add("biome");
    features.add("tailwind");
    features.add("wrangler");
  } else {
    features.add("oxfmt").add("oxlint").add("tsgolint");
  }

  if (template === "lib") {
    features.add("tsdown");
  }

  const result: ResolvedConfig = { template };

  if (features.size > 0) result.features = Array.from(features).toSorted();

  return result;
}

export { resolveConfig };
export type { Dependencies, ResolvedConfig, Feature, Template };
