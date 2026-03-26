import type { FileInfo } from "#lib/scaffolder";

function filesToMarkdown(files: FileInfo[]) {
  let markdown = "# Files\n";

  for (const file of files) {
    markdown += `\n## ${file.path}\n\n${file.content}\n`;
  }

  return markdown;
}

export { filesToMarkdown };
