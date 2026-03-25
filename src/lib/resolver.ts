type Template = "default" | "astro";

type Feature = "biome" | "ci";

interface Dependencies {
  default: string[];
  dev: string[];
}

interface Options {
  monorepo?: false;
}

interface ResolvedConfig {
  template: Template;
  features?: Feature[];
  dependencies?: Dependencies;
  options?: Options;
}

function resolveConfig(args: string[]): ResolvedConfig {
  if (args) {
  }
  return {
    template: "default",
  };
}

export { resolveConfig };
export type { ResolvedConfig };
