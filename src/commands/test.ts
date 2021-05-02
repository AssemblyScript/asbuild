import * as yargs from "yargs";
import { asp } from "@as-pect/cli";
import { log } from "../utils";

const testCmdUsage = `$0 test
Run as-pect tests

USAGE:
    $0 test [options] -- [aspect_options]`;

export const TestCmd: yargs.CommandModule = {
  command: "test",
  describe: "Run as-pect tests",
  builder: (y) =>
    y.usage(testCmdUsage).option("verbose", {
      alias: ["vv"],
      default: false,
      boolean: true,
      description: "Print out arguments passed to as-pect",
    }),
  handler: (args) => {
    const aspectArgs = args["_"].slice(1);
    aspectArgs.push("--nologo");
    if (args.verbose) {
      log(aspectArgs);
    }
    asp(aspectArgs as string[]);
  },
};
