import * as yargs from "yargs";
import * as path from "path";
import { EslintConfigFile } from "./init/files/eslintConfig";
import { InitResult } from "./init/interfaces";
import chalk from "chalk";
import { getPmCommands } from "./init/files/packageJson";
import { ESLint } from "eslint";

// TODO:
// - Support more eslint options, like '--max-warnings`,
//   (Much of these can be ported from eslint's `cli.js`)

export const FmtCmd: yargs.CommandModule = {
  command: "fmt [paths..]",
  describe: "This utility formats current module using eslint.",
  aliases: ["format", "lint"],
  builder: (y) =>
    y
      .positional("paths", {
        description: "Paths to format",
        default: ["."],
      })
      .option("init", {
        description: "Generates recommended eslint config for AS Projects",
        boolean: true,
        group: "Initialisation:",
      })
      .option("lint", {
        alias: ["dry-run"],
        boolean: true,
        default: false,
        description:
          "Tries to fix problems without saving the changes to the file system",
        group: "Miscellaneous",
      })
      .onFinishCommand((code: number) => process.exit(code)),

  handler: async (args): Promise<number> => {
    if (args.init) {
      console.log(initConfig(process.cwd()));
      return 0;
    }

    let retCode = 0;
    const files = args.paths as string[];

    try {
      // create ESLint engine
      const engine = new ESLint({
        extensions: ["ts"],
        fix: true,
      });
      // generate lint results
      const results = await engine.lintFiles(files);
      if (!args.dryRun) {
        // fix files in place
        await ESLint.outputFixes(results);
      }
      // format the results
      const formatter = await engine.loadFormatter("stylish");
      const resultText = formatter.format(results);
      console.log(resultText);
      console.log(chalk`{bold.green Done!}`);
    } catch (error) {
      console.error(
        chalk`{bold.bgRedBright ERROR:} Unexpected Error while running ESlint on given files.`
      );
      console.error(error);
      retCode = 1;
    }
    return retCode;
  },
};

function initConfig(baseDir: string): string {
  // write the config file
  const dir = path.resolve(baseDir);
  const eslintFile = new EslintConfigFile();
  const msg = [];

  msg.push(chalk`Writing {cyan ${eslintFile.getRelativePath(dir)}} ...`);
  switch (eslintFile.write(dir)) {
    case InitResult.EXISTS:
      msg.push(
        chalk`File {bold.cyan ${eslintFile.getRelativePath(
          dir
        )}} already exists.`
      );
      break;
    case InitResult.CREATED:
      msg.push(
        ...[
          chalk`{bold.green Created:} ${eslintFile.path}`,
          ``,
          chalk`{bold.green Done!}`,
          chalk``,
          chalk`Don't forget to install 'eslint' and it's plugins before you start:`,
          ``,
          chalk`  ${getPmCommands().pkgInstall} eslint`,
          chalk`  ${getPmCommands().pkgInstall} @typescript-eslint/parser`,
          chalk`  ${
            getPmCommands().pkgInstall
          } @typescript-eslint/eslint-plugin`,
          ``,
          chalk`Have a nice day !`,
        ]
      );
      break;

    default:
      break;
  }

  return msg.join("\n");
}
