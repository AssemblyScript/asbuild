import * as yargs from "yargs";

export const FmtCmd: yargs.CommandModule = {
  command: "fmt",
  describe: "This utility formats all AS files of the current module using eslint.",
  aliases: ["format", "lint"],
  handler: (args) => {
    console.log(args);
  },
};
