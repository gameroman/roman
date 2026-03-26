#!/usr/bin/env bun

import { installDependencies } from "#lib/dependencies";

import { resolveConfig } from "./lib/resolver";
import { getScaffoldContent } from "./lib/scaffolder";
import { writeToFs } from "./lib/writer";

async function main() {
  const features = resolveConfig(process.argv.slice(2));
  const content = getScaffoldContent(features);
  writeToFs(content);
  await installDependencies(features.dependencies);
}

await main();
