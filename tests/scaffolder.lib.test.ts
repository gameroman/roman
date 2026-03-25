import { describe, it, expect } from "bun:test";

import { getScaffoldContent } from "#lib/scaffolder";

describe("resolveFeatures", () => {
  it("should resolve features with empty array", () => {
    expect(getScaffoldContent({ template: "default" })).toEqual({ files: [] });
  });
});
