import { describe, it, expect } from "bun:test";

import { resolveConfig } from "#lib/resolver";

describe("resolveFeatures", () => {
  it("should resolve features with empty array", () => {
    expect(resolveConfig([])).toEqual({ template: "default" });
  });
});
