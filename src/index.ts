import { resolveFeatures } from "./lib/resolve-features";

function main() {
  console.log(resolveFeatures(process.argv.slice(2)));
}

main();
