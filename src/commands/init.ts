import * as yargs from "yargs";

export const InitCmd: yargs.CommandModule = {
  command: "init",
  describe: "Create a new AS package in an existing directory",
  handler: (args) => {
    console.log(args);
  },
};
