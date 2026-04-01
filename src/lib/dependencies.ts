import { $ } from "bun";

import type { Dependencies } from "./scaffolder";

async function installDependencies(dependencies: Dependencies, install = true) {
  const deps = dependencies.default;

  if (deps) {
    await $`bun add ${{ raw: deps.join(" ") }} --lockfile-only`;
  }

  const devDeps = { raw: dependencies.dev.join(" ") };
  await $`bun add -d ${devDeps} --lockfile-only`;

  if (install) {
    await $`bun install`;
  }
}

export { installDependencies };
