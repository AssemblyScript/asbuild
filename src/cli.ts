import * as yargs from "yargs";
import * as path from "path";
import * as asc from "assemblyscript/cli/asc";
import * as fs from "fs";

// TODO: export from asc
type APIOptions = any;

export interface ASBuildArgs {
  [x: string]: unknown;
  baseDir: string;
  config: string;
  wat: boolean;
  outDir: string | undefined;
  target: string;
}

function hasInputArg(ascArgs: string[]): boolean {
  return ascArgs.length > 0 && !ascArgs[0].startsWith("--")
}

export function main(cli: string[], options: any = {}, callback?: (a:any) => number) {
  let args: ASBuildArgs  = yargs
    .usage(
      "Build tool for AssemblyScript projects.\n\nUsage:\n  asb [input file] [options] -- [asc options]"
    )
    .example(
      "asb",
      "Build release of 'assembly/index.ts to build/release/packageName.wasm"
    )
    .example("asb --target release", "Build a release binary")
    .example("asb -- --measure", "Pass argument to 'asc'")
    .option("baseDir", {
      alias: "d",
      type: "string",
      description: "Base directory of project.",
      default: ".",
    })
    .option("config", {
      alias: "c",
      type: "string",
      description: "Path to asconfig file",
      default: "./asconfig.json",
    })
    .option("wat", {
      description: "Output wat file to outDir",
      default: false,
      boolean: true,
    })
    .option("outDir", {
      type: "string",
      description:
        'Directory to place built binaries. Default "./build/<target>/"',
    })
    .option("target", {
      type: "string",
      description: "Target for compilation",
      default: "release",
    })
    .parse(cli);

  let baseDir = args.baseDir;
  baseDir = baseDir == "." ? process.cwd() : baseDir;
  const packageJson = require(path.join(baseDir, "package.json"));

  let configPath = path.relative(baseDir, path.join(baseDir, args.config));
  let hasConfig: boolean = false;
  let config: any = {};
  try {
    config = require(configPath);
    hasConfig = true;
  } catch (error) {}

  let entryFile = path.join("assembly", "index.ts");
  const ascArgs = args["_"] as string[];
  // Check if first positional arg is not an option
  
  entryFile = hasInputArg(ascArgs) ? ascArgs.shift()! : (config.main || entryFile)
  entryFile = path.relative(baseDir, entryFile);

  if (!fs.existsSync(entryFile)){
    throw new Error(`Entry file ${entryFile} doesn't exist`);
  }

  const name =
    entryFile.endsWith("index.ts") && packageJson.name
      ? packageJson.name
      : path.basename(entryFile).replace(".ts", "");

  ascArgs.unshift(entryFile);
  let target = args.target;
  if (hasConfig) ascArgs.push("--config", configPath);

  const targetIndex = ascArgs.findIndex((s) => s === "--target");

  if (targetIndex < 0) {
    ascArgs.push("--target", target);
  } else {
    target = ascArgs[targetIndex];
  }

  let outDir =
    args.outDir === undefined && config.outDir
      ? config.outDir
      : args.outDir || "./build";
  outDir = path.join(baseDir, outDir, target);
  const watFile = path.relative(baseDir, path.join(outDir, name + ".wat"));
  const wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));

  if (args.wat && !ascArgs.some((s) => s.endsWith(".wat"))) {
    ascArgs.push("--textFile", watFile);
  }

  if (!ascArgs.some((s) => s.endsWith(".wasm"))) {
    ascArgs.push("--binaryFile", wasmFile);
  }

  asc.main(ascArgs, options, callback) 

}
