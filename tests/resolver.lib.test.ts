import { describe, it, expect } from "bun:test";

import { resolveConfig } from "#lib/resolver";

describe("resolveConfig", () => {
  describe("default template", () => {
    it("should resolve with empty array", () => {
      expect(resolveConfig([])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint"],
        dependencies: {
          dev: ["@gameroman/config", "oxfmt", "oxlint", "typescript"],
        },
      });
    });

    it("should resolve tsgolint", () => {
      expect(resolveConfig(["tsgolint"])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint", "tsgolint"],
        dependencies: {
          dev: [
            "@gameroman/config",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "typescript",
          ],
        },
      });
    });
  });

  describe("executable template", () => {
    it("should resolve exe", () => {
      expect(resolveConfig(["exe"])).toEqual({
        template: "executable",
        features: ["oxfmt", "oxlint"],
        dependencies: {
          dev: ["@gameroman/config", "oxfmt", "oxlint", "typescript"],
        },
      });
    });

    it("should resolve exe tsgolint", () => {
      expect(resolveConfig(["exe", "tsgolint"])).toEqual({
        template: "executable",
        features: ["oxfmt", "oxlint", "tsgolint"],
        dependencies: {
          dev: [
            "@gameroman/config",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "typescript",
          ],
        },
      });
    });
  });

  describe("astro template", () => {
    it("should resolve astro", () => {
      expect(resolveConfig(["astro"])).toEqual({
        template: "astro",
        features: ["biome", "wrangler"],
        dependencies: {
          default: ["astro"],
          dev: [
            "@biomejs/biome",
            "@gameroman/config",
            "typescript",
            "wrangler",
          ],
        },
      });
    });

    it("should resolve astro tailwind", () => {
      expect(resolveConfig(["astro", "tailwind"])).toEqual({
        template: "astro",
        features: ["biome", "tailwind", "wrangler"],
        dependencies: {
          default: ["astro", "tailwindcss"],
          dev: [
            "@biomejs/biome",
            "@gameroman/config",
            "@tailwindcss/vite",
            "typescript",
            "wrangler",
          ],
        },
      });
    });

    it("should resolve astro solid", () => {
      expect(resolveConfig(["astro", "solid"])).toEqual({
        template: "astro",
        features: ["biome", "solid", "wrangler"],
        dependencies: {
          default: ["astro", "solid-js"],
          dev: [
            "@astrojs/solid-js",
            "@biomejs/biome",
            "@gameroman/config",
            "typescript",
            "wrangler",
          ],
        },
      });
    });

    it("should resolve astro solid tailwind", () => {
      expect(resolveConfig(["astro", "solid", "tailwind"])).toEqual({
        template: "astro",
        features: ["biome", "solid", "tailwind", "wrangler"],
        dependencies: {
          default: ["astro", "solid-js", "tailwindcss"],
          dev: [
            "@astrojs/solid-js",
            "@biomejs/biome",
            "@gameroman/config",
            "@tailwindcss/vite",
            "typescript",
            "wrangler",
          ],
        },
      });
    });
  });
});
