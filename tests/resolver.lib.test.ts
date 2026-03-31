import { describe, it, expect } from "bun:test";

import { resolveConfig } from "#lib/resolver";

describe("resolveConfig", () => {
  describe("default template", () => {
    it("should resolve with empty array", () => {
      expect(resolveConfig([])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint", "tsgolint"],
      });
    });

    it("should resolve tsgolint (already included)", () => {
      expect(resolveConfig(["tsgolint"])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint", "tsgolint"],
      });
    });

    it("should resolve tsdown", () => {
      expect(resolveConfig(["tsdown"])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint", "tsdown", "tsgolint"],
      });
    });

    it("should resolve tsdown tsgolint (tsgolint already included)", () => {
      expect(resolveConfig(["tsdown", "tsgolint"])).toEqual({
        template: "default",
        features: ["oxfmt", "oxlint", "tsdown", "tsgolint"],
      });
    });
  });

  describe("executable template", () => {
    it("should resolve exe", () => {
      expect(resolveConfig(["exe"])).toEqual({
        template: "executable",
        features: ["oxfmt", "oxlint", "tsgolint"],
      });
    });
  });

  describe("astro template", () => {
    it("should resolve astro", () => {
      expect(resolveConfig(["astro"])).toEqual({
        template: "astro",
        features: ["biome", "wrangler"],
      });
    });

    it("should resolve astro tailwind", () => {
      expect(resolveConfig(["astro", "tailwind"])).toEqual({
        template: "astro",
        features: ["biome", "tailwind", "wrangler"],
      });
    });

    it("should resolve astro solid", () => {
      expect(resolveConfig(["astro", "solid"])).toEqual({
        template: "astro",
        features: ["biome", "solid", "wrangler"],
      });
    });

    it("should resolve astro solid tailwind", () => {
      expect(resolveConfig(["astro", "solid", "tailwind"])).toEqual({
        template: "astro",
        features: ["biome", "solid", "tailwind", "wrangler"],
      });
    });

    it("should resolve astro tailwind solid", () => {
      expect(resolveConfig(["astro", "solid", "tailwind"])).toEqual({
        template: "astro",
        features: ["biome", "solid", "tailwind", "wrangler"],
      });
    });
  });
});
