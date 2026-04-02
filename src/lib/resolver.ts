type Template = "default" | "lib" | "astro" | "executable";

type Feature =
  | "biome"
  | "oxfmt"
  | "oxlint"
  | "tsgolint"
  | "solid"
  | "tailwind"
  | "wrangler"
  | "tsdown"
  | "telegram";

interface ResolvedConfig {
  template: Template;
  features?: Feature[];
}

function getTemplate(args: string[]) {
  return args.includes("astro") || args.includes("solid")
    ? "astro"
    : args.includes("exe") || args.includes("tg")
      ? "executable"
      : args.includes("lib") || args.includes("tsdown")
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
    if (arg === "tg") {
      features.add("telegram");
    }
  }

  if (template === "astro") {
    features.add("biome").add("tailwind").add("wrangler");
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
export type { ResolvedConfig, Feature, Template };
