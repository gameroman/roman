import { describe, it, expect } from "bun:test";

import { generateAstroConfig, serializeAstroConfig } from "#lib/astro-config";

describe("generateAstroConfig", () => {
  it("should return static output by default", () => {
    const config = generateAstroConfig({ template: "astro" });
    expect(config.output).toBe("static");
  });

  it("should not include integrations when solid is not present", () => {
    const config = generateAstroConfig({ template: "astro" });
    expect(config.integrations).toEqual([]);
  });

  it("should include solid integration when solid feature is present", () => {
    const config = generateAstroConfig({
      template: "astro",
      features: ["solid"],
    });
    expect(config.integrations).toEqual(["solid()"]);
  });

  it("should not include vite plugins when tailwind is not present", () => {
    const config = generateAstroConfig({ template: "astro" });
    expect(config.vitePlugins).toEqual([]);
  });

  it("should include tailwind vite plugin when tailwind feature is present", () => {
    const config = generateAstroConfig({
      template: "astro",
      features: ["tailwind"],
    });
    expect(config.vitePlugins).toEqual(["tailwindcss()"]);
  });

  it("should include both solid and tailwind when both features are present", () => {
    const config = generateAstroConfig({
      template: "astro",
      features: ["solid", "tailwind"],
    });
    expect(config.integrations).toEqual(["solid()"]);
    expect(config.vitePlugins).toEqual(["tailwindcss()"]);
  });
});

describe("serializeAstroConfig", () => {
  it("should serialize basic config with static output", () => {
    const result = serializeAstroConfig(
      { output: "static", integrations: [], vitePlugins: [] },
      [],
    );
    expect(result).toBe(`import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
});
`);
  });

  it("should serialize config with solid integration", () => {
    const result = serializeAstroConfig(
      { output: "static", integrations: ["solid()"], vitePlugins: [] },
      ["solid"],
    );
    expect(result).toBe(`import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
});
`);
  });

  it("should serialize config with tailwind vite plugin", () => {
    const result = serializeAstroConfig(
      { output: "static", integrations: [], vitePlugins: ["tailwindcss()"] },
      ["tailwind"],
    );
    expect(result).toBe(`import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: { plugins: [tailwindcss()] },
});
`);
  });

  it("should serialize config with both solid and tailwind", () => {
    const result = serializeAstroConfig(
      {
        output: "static",
        integrations: ["solid()"],
        vitePlugins: ["tailwindcss()"],
      },
      ["solid", "tailwind"],
    );
    expect(result).toBe(`import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: { plugins: [tailwindcss()] },
});
`);
  });
});
