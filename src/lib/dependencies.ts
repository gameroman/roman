import { $ } from "bun";

import type { Dependencies } from "./resolver";

async function installDependencies(dependencies: Dependencies) {
  const defaultDeps = dependencies.default ?? [];
  const devDeps = dependencies.dev ?? [];

  if (defaultDeps.length > 0) {
    await $`bun add ${defaultDeps.join(" ")}`;
  }
  if (devDeps.length > 0) {
    await $`bun add -d ${devDeps.join(" ")}`;
  }
  if (defaultDeps.length > 0 || devDeps.length > 0) {
    await $`bun install`;
  }
}

export { installDependencies };
