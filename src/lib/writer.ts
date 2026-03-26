import { writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import type { ScaffoldContent } from "./scaffolder";

function writeToFs(
  content: ScaffoldContent,
  targetDir: string = process.cwd(),
) {
  const files = readdirSync(targetDir);

  if (files.length > 0) {
    console.error(`Error: Target directory ${targetDir} is not empty.`);
    console.error("Please use an empty directory or specify a different path.");
    process.exit(1);
  }

  for (const file of content.files) {
    const filePath = join(targetDir, file.path);
    const dir = filePath.substring(
      0,
      filePath.lastIndexOf("/") || filePath.lastIndexOf("\\"),
    );
    if (dir) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, file.content, "utf-8");
  }
}

export { writeToFs };
