interface ResolvedConfig {
  template: "default";
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
