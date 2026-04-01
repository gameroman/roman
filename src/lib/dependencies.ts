import { $ } from "bun";

import type { Dependencies } from "./resolver";

async function installDependencies(dependencies: Dependencies, install = true) {
  const deps = dependencies.default;
  const devDeps = dependencies.dev;

  if (deps) {
    await $`bun add ${{ raw: deps.join(" ") }} --lockfile-only`;
  }

  if (devDeps) {
    await $`bun add -d ${{ raw: devDeps.join(" ") }} --lockfile-only`;
  }

  if (!install) return;

  if (deps || devDeps) {
    await $`bun install`;
  }
}

export { installDependencies };
