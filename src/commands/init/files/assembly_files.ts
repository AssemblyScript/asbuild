import { InitFile } from "../interfaces";

const indexContent = `// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}
`;

const tsconfigContent = `{
    "extends": "assemblyscript/std/assembly.json",
    "include": [
      "./**/*.ts"
    ]
}
`;

export class AssemblyIndexFile extends InitFile {
  path = "assembly/index.ts";
  description =
    "Example entry file being compiled to WebAssembly to get you started.";
  getContent(): string {
    return indexContent;
  }
  updateOldContent = null;
}

export class TsConfigFile extends InitFile {
  path = "assembly/tsconfig.json";
  description =
    "TypeScript configuration inheriting recommended AssemblyScript settings.";
  getContent(): string {
    return tsconfigContent;
  }
  updateOldContent = null;
}
