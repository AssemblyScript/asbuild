import * as yargs from "yargs";
import * as path from "path";
import * as asc from "assemblyscript/cli/asc";
import * as ascOptions from "assemblyscript/cli/util/options";
import * as fs from "fs";

export interface ASBuildArgs {
  [x: string]: unknown;
  baseDir: string;
  config: string;
  wat: boolean;
  outDir: string | undefined;
  target: string;
  verbose: boolean;
}

export function main(
  cli: string[],
  options: asc.APIOptions = {},
  callback?: (a: any) => number
) {
  let args: ASBuildArgs = yargs
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
    .option("verbose", {
      boolean: true,
      default: false,
      description: "Print out arguments passed to asc",
    })
    .parse(cli);

  const ascArgv = args["_"] as string[];
  const [baseDir, configPath] = getSetup(args);
  const config = getConfig(configPath);
  const outDir = args.outDir || config.outDir || path.join(process.cwd(), "./build");
  if (config.workspaces) {
    if ( !(<any>config.workspaces instanceof Array)) {
      console.error("Invalid workspace configuration. Should be an array.");
      process.exit(1);
    }
    const workspaces = config.workspaces as string[];
    for (let workspace of workspaces) {
      args.baseDir = path.join(baseDir, workspace);
      args.outDir = path.relative(baseDir, outDir);
      compileProject(args, ascArgv.slice(0), options, callback);
    }
  } else {
    compileProject(args, ascArgv, options, callback);
  }
}

function getSetup(args: ASBuildArgs): [string, string] {
  let baseDir = args.baseDir;
  baseDir = baseDir == "." ? process.cwd() : baseDir;
  let configPath = path.resolve(path.join(baseDir, args.config));
  return [baseDir, configPath];
}

const DEFAULT_CONFIG = {};

function getConfig(configPath: string): any {
  try {
    return require(configPath);
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

function safeRequire(path: string): any {
  try {
    return require(path);
  } catch (error) {
    return {};
  }
}

function compileProject(
  args: ASBuildArgs,
  ascArgv: string[],
  options: asc.APIOptions,
  cb?: (a: any) => number
): void {
  const [baseDir, configPath] = getSetup(args);
  let config: any = getConfig(configPath);

  if (config !== DEFAULT_CONFIG) {
    ascArgv.push("--config", configPath);
  }
  
  const packageJson = safeRequire(path.join(baseDir, "package.json"));
  const ascArgs = ascOptions.parse(ascArgv, asc.options, false);
  let entryFile: string;
  switch (ascArgs.arguments.length) {
    case 0: {
      entryFile = path.join(baseDir, config.entry || path.join("assembly", "index.ts"));
      ascArgv.unshift(entryFile);
      break;
    }
    case 1: {
      entryFile = ascArgs.arguments[0];
      break;
    }
    default: {
      console.error("Cannot compile two entry files at once.");
      process.exit(1);
    }
  }

  if (!fs.existsSync(entryFile)) {
    console.log(args)
    throw new Error(`Entry file ${entryFile} doesn't exist`);
  }

  let name: string;
  if (entryFile.endsWith("index.ts")) {
    if (packageJson.name) {
      name = packageJson.name;
    } else {
      name = path.basename(path.basename(baseDir));
    }
  } else {
    name = path.basename(entryFile).replace(".ts", "");
  }

  let target = args.target;
  if (target === "debug" && !(config.target && config.target[target].debug)) {
    ascArgv.push("--debug");
  } else if (target === "release" && !(config.target && config.target[target].release)) {
    ascArgv.push("--optimizeLevel", "3");
    ascArgv.push("--shrinkLevel", "3");
  }

  if (!ascArgs.options?.target) {
    ascArgv.push("--target", target);
  } else {
    target = ascArgs.options.target as string;
  }

  let outDir = args.outDir ? args.outDir : config.outDir || "./build";
  outDir = path.join(baseDir, outDir, target);
  const watFile  = path.relative(baseDir, path.join(outDir, name + ".wat"));
  const wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));

  if (args.wat && (!(hasOutput(ascArgv, ".wat") || config.options?.textFile))) {
    ascArgv.push("--textFile", watFile);
  }
  if (args.outDir || !(hasOutput(ascArgv, ".wasm") || (config.options?.binaryFile))) {
    ascArgv.push("--binaryFile", wasmFile);
  }

  if (args.verbose) {
    console.log(["asc", ...ascArgv].join(" "));
  }
  asc.main(ascArgv, options, cb);
}


function hasOutput(ascArgv: string[], suffix: string): boolean {
  return ascArgv.some((s) => s.endsWith(suffix));
}