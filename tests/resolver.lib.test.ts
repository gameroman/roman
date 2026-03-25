import { describe, it, expect } from "bun:test";

import { resolveConfig } from "#lib/resolver";

describe("resolveConfig", () => {
  it("should resolve with empty array", () => {
    expect(resolveConfig([])).toEqual({
      template: "default",
      dependencies: { dev: ["@gameroman/config", "typescript"] },
    });
  });

  it("should resolve astro", () => {
    expect(resolveConfig(["astro"])).toEqual({
      template: "astro",
      features: ["wrangler"],
      dependencies: {
        default: ["astro"],
        dev: ["@gameroman/config", "typescript", "wrangler"],
      },
    });
  });

  it("should resolve astro tailwind", () => {
    expect(resolveConfig(["astro", "tailwind"])).toEqual({
      template: "astro",
      features: ["tailwind", "wrangler"],
      dependencies: {
        default: ["astro", "tailwindcss"],
        dev: [
          "@gameroman/config",
          "@tailwindcss/vite",
          "typescript",
          "wrangler",
        ],
      },
    });
  });

  it("should resolve astro biome", () => {
    expect(resolveConfig(["astro", "biome"])).toEqual({
      template: "astro",
      features: ["biome", "wrangler"],
      dependencies: {
        default: ["astro"],
        dev: ["@biomejs/biome", "@gameroman/config", "typescript", "wrangler"],
      },
    });
  });

  it("should resolve astro solid", () => {
    expect(resolveConfig(["astro", "solid"])).toEqual({
      template: "astro",
      features: ["solid", "wrangler"],
      dependencies: {
        default: ["astro", "solid-js"],
        dev: [
          "@astrojs/solid-js",
          "@gameroman/config",
          "typescript",
          "wrangler",
        ],
      },
    });
  });
});
