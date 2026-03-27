import { describe, it, expect } from "bun:test";

import { generatePackageJson } from "#lib/package-json";

describe("generatePackageJson", () => {
  describe("default template", () => {
    it("should generate package.json with default scripts", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: [],
      });
      expect(pkg).toEqual({
        private: true,
        type: "module",
        scripts: {
          test: "bun test",
        },
      });
    });

    it("should add oxlint script when oxlint feature is present", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: ["oxlint"],
      });
      expect(pkg.scripts["lint"]).toBe("oxlint");
    });

    it("should remove lint script when oxlint feature is absent", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: [],
      });
      expect(pkg.scripts["lint"]).toBeUndefined();
    });

    it("should add oxfmt script when oxfmt feature is present", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: ["oxfmt"],
      });
      expect(pkg.scripts["format"]).toBe("oxfmt");
    });

    it("should add build and prepublishOnly scripts when tsdown feature is present", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: ["tsdown"],
      });
      expect(pkg.scripts["build"]).toBe("tsdown");
      expect(pkg.scripts["prepublishOnly"]).toBe("bun run build");
    });

    it("should combine multiple features correctly", () => {
      const pkg = generatePackageJson({
        template: "default",
        features: ["oxlint", "oxfmt", "tsdown"],
      });
      expect(pkg.scripts).toEqual({
        test: "bun test",
        lint: "oxlint",
        format: "oxfmt",
        build: "tsdown",
        prepublishOnly: "bun run build",
      });
    });
  });

  describe("executable template", () => {
    it("should behave like default template", () => {
      const pkg = generatePackageJson({
        template: "executable",
        features: ["oxlint", "oxfmt"],
      });
      expect(pkg.scripts).toEqual({
        test: "bun test",
        lint: "oxlint",
        format: "oxfmt",
      });
    });
  });

  describe("astro template", () => {
    it("should generate astro scripts", () => {
      const pkg = generatePackageJson({
        template: "astro",
        features: [],
      });
      expect(pkg.scripts).toEqual({
        lint: "biome check",
        format: "biome check --fix",
        dev: "astro dev",
        build: "astro build",
        deploy: "wrangler deploy",
      });
    });

    it("should include imports", () => {
      const pkg = generatePackageJson({
        template: "astro",
        features: [],
      });
      expect(pkg.imports).toEqual({
        "#layout": "./src/layouts/Layout.astro",
      });
    });
  });
});
