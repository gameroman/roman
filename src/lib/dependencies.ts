import { $ } from "bun";
import type { Dependencies } from "./resolver";

async function installDependencies(dependencies: Dependencies) {
  const deps = Object.keys(dependencies);
  if (deps.length === 0) return;
  await $`bun add ${deps.join(" ")}`;
  await $`bun install`;
}

export { installDependencies };
