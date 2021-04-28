import * as yargs from "yargs";
import { initFiles } from "./files";
import { InitResult } from "./interfaces";
// import { InitResult } from "./interfaces";

export const InitCmd: yargs.CommandModule = {
  command: "init [baseDir]",
  describe: "Create a new AS package in an given directory",
  builder: (y) =>
    y.positional("baseDir", {
      type: "string",
      default: ".",
      description: "Create a sample AS project in this directory",
    }),
  handler: (args) => {
    const baseDir: string = args.baseDir as string;
    for (let file of initFiles) {
      const relativePath = file.getRelativePath(baseDir);
      switch (file.write(baseDir)) {
        case InitResult.CREATED:
          console.log(`CREATED - ${relativePath}`);
          break;
        case InitResult.EXISTS:
          console.log(`EXISTS - ${relativePath}`);
          break;
        case InitResult.UPDATED:
          console.log(`UPDATED - ${relativePath}`);
          break;
        default:
          break;
      }
    }
  },
};
