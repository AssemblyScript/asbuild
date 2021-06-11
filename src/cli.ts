import * as yargs from "yargs";
import {
  BuildCmd,
  buildCmdBuilder,
  InitCmd,
  TestCmd,
  FmtCmd,
  RunCmd,
} from "./commands";
import * as asc from "../asc";
import { setGlobalAscOptions, setGlobalCliCallback } from "./utils";

export function main(
  cli: string[],
  options: asc.APIOptions = {},
  callback?: (a: any) => number
) {
  setGlobalAscOptions(options);
  setGlobalCliCallback(callback);

  yargs
    .usage(
      "Build tool for AssemblyScript projects.\n\nUsage:\n  asb [command] [options]"
    )
    // To ensure backward compatibility, a default command delegating to BuildCmd.handler
    .command(
      "$0",
      "Alias of build command, to maintain back-ward compatibility",
      (y) =>
        buildCmdBuilder(y)
          // explicitly hide options help to encourage users to use build cmd
          .hide("config")
          .hide("baseDir")
          .hide("wat")
          .hide("target")
          .hide("outDir")
          .hide("verbose"),
      BuildCmd.handler
    )
    .command(BuildCmd)
    .command(InitCmd)
    .command(TestCmd)
    .command(FmtCmd)
    .command(RunCmd)
    .help()
    .scriptName("asb")
    .parse(cli);
}
