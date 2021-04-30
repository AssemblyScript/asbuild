import { InitFile } from "../interfaces";

export class RootGitignoreFile extends InitFile {
  path = ".gitignore";
  description =
    "Git configuration that excludes tests residue and node_modules.";
  updateOldContent = (old: string) => old + "\n" + this.getContent();
  getContent(): string {
    return [
      "node_modules/",
      "assembly/**/__tests__/*.map",
      "assembly/**/__tests__/*.wat",
    ].join("\n");
  }
}

export class BuildGitignoreFile extends InitFile {
  path = "build/.gitignore";
  description =
    "Git configuration that excludes compiled binaries from source control.";
  updateOldContent = (old: string) => old + "\n" + this.getContent();
  getContent(): string {
    return ["*.wasm", "*.wasm.map", "*.asm.js", "*wat"].join("\n");
  }
}
