import { InitFile } from "../interfaces";

export class RootGitignoreFile extends InitFile {
  path = ".gitignore";
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
  path = ".gitignore";
  updateOldContent = (old: string) => old + "\n" + this.getContent();
  getContent(): string {
    return ["*.wasm", "*.wasm.map", "*.asm.js"].join("\n");
  }
}


