import { InitFile } from "../interfaces";

export class IndexJsFile extends InitFile {
  path = "index.js";
  description = "Example test to check that your module is indeed working.";
  getContent(): string {
    return [
      `const fs = require("fs");`,
      `const loader = require("@assemblyscript/loader");`,
      `const imports = { /* imports go here */ };`,
      `const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);`,
      `module.exports = wasmModule.exports;`,
    ].join("\n");
  }

  updateOldContent = (old: string): string => {
    var commentOut = old
      .split("\n")
      .map((v) => "// " + v)
      .join("\n");
    return commentOut + "\n\n" + this.getContent();
  };
}
