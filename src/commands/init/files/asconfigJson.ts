import { InitFile } from "../interfaces";

export class AsconfigJsonFile extends InitFile {
  path = "asconfig.json";
  description =
    "Configuration file defining both a 'debug' and a 'release' target.";
  configObj = {
    targets: {
      debug: {
        binaryFile: "build/untouched.wasm",
        textFile: "build/untouched.wat",
        sourceMap: true,
        debug: true,
      },
      release: {
        binaryFile: "build/optimized.wasm",
        textFile: "build/optimized.wat",
        sourceMap: true,
        optimizeLevel: 3,
        shrinkLevel: 1,
        converge: false,
        noAssert: false,
      },
    },
    options: {},
  };
  getContent(): string {
    return JSON.stringify(this.configObj, null, 2);
  }
  updateOldContent = null;
}
