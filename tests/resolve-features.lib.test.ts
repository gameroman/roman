import { describe, it, expect } from "bun:test";

import { resolveFeatures } from "../src/lib/resolve-features";

describe("resolveFeatures", () => {
  it("should resolve features with empty array", () => {
    expect(resolveFeatures([])).toEqual([]);
  });
});
