import type { ResolvedConfig } from "./resolve-features";

interface FileInfo {
  path: string;
  content: string;
}

interface ScaffoldContent {
  files: FileInfo[];
}

function getScaffoldContent(features: ResolvedConfig): ScaffoldContent {
  if (features) {
  }
  return {
    files: [],
  };
}

export { getScaffoldContent };
export type { ScaffoldContent };
