import * as yargs from "yargs";

export const TestCmd: yargs.CommandModule = {
  command: "test",
  describe: "Execute as-pect tests of a local package",
  handler: (args) => {
    console.log(args);
  },
};
