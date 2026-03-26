import { $ } from "bun";

import type { Dependencies } from "./resolver";

async function installDependencies(dependencies: Dependencies) {
  const defaultDeps = dependencies.default ?? [];
  const devDeps = dependencies.dev ?? [];

  if (defaultDeps.length > 0) {
    const defaulteDepsArg = defaultDeps.join(" ");
    await $`bun add ${{ raw: defaulteDepsArg }}`;
  }
  if (devDeps.length > 0) {
    const devDepsArg = devDeps.join(" ");
    await $`bun add -d ${{ raw: devDepsArg }}`;
  }
  if (defaultDeps.length > 0 || devDeps.length > 0) {
    await $`bun install`;
  }
}

export { installDependencies };
