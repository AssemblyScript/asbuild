import * as yargs from "yargs";
import * as path from "path";
import * as asc from "../../asc";
import * as ascOptions from "assemblyscript/cli/util/options";
import * as fs from "fs";
import { getGlobalAscOptions, getGlobalCliCallback, log } from "../utils";

interface BuildArgs {
  baseDir: string;
  config: string;
  wat: boolean;
  outDir: string | undefined;
  target: string;
  verbose: boolean;
}

const buildCmdUsage = `$0 build
Compile a local package and all of its dependencies

USAGE:
    $0 build [entry_file] [options] -- [asc_options]`;

export function buildCmdBuilder(y: yargs.Argv) {
  return y
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
    });
}

export const BuildCmd: yargs.CommandModule = {
  command: "build",
  describe: "Compile a local package and all of its dependencies",
  aliases: ["compile", "make"],
  builder: (y) =>
    buildCmdBuilder(y)
      .usage(buildCmdUsage)
      .example(
        "asb build",
        "Build release of 'assembly/index.ts to build/release/packageName.wasm"
      )
      .example("asb build --target release", "Build a release binary")
      .example("asb build -- --measure", "Pass argument to 'asc'"),
  handler: (args) => {
    if (["build", "make", "compile"].includes(args["_"][0] as string)) {
      args["_"] = args["_"].slice(1);
    }
    const options = getGlobalAscOptions();
    const callback = getGlobalCliCallback();
    const buildArgs = (args as unknown) as BuildArgs;
    const ascArgv = args["_"] as string[];
    const [baseDir, configPath] = getSetup(buildArgs);
    const config = getConfig(configPath);
    const outDir =
      args.outDir || config.outDir || path.join(process.cwd(), "./build");
    if (config.workspaces) {
      if (!(<any>config.workspaces instanceof Array)) {
        log("Invalid workspace configuration. Should be an array.", true);
        process.exit(1);
      }
      const workspaces = config.workspaces as string[];
      for (let workspace of workspaces) {
        args.baseDir = path.join(baseDir, workspace);
        args.outDir = path.relative(baseDir, outDir);
        compileProject(buildArgs, ascArgv.slice(0), options, callback);
      }
    } else {
      compileProject(buildArgs, ascArgv, options, callback);
    }
  },
};

function getSetup(args: BuildArgs): [string, string] {
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

function hasTarget(config: any, target: string): boolean {
  return config.targets && config.targets[target];
}

// @ts-ignore
function compileProject(
  args: BuildArgs,
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
      entryFile = path.join(
        baseDir,
        config.entry || path.join("assembly", "index.ts")
      );
      ascArgv.unshift(entryFile);
      break;
    }
    case 1: {
      entryFile = ascArgs.arguments[0];
      break;
    }
    default: {
      log("Cannot compile two entry files at once.", true);
      process.exit(1);
    }
  }

  if (!fs.existsSync(entryFile)) {
    log(args);
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
  if (target === "debug" && !hasTarget(config, "debug")) {
    ascArgv.push("--debug");
  } else if (target === "release" && !hasTarget(config, "release")) {
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
  const watFile = path.relative(baseDir, path.join(outDir, name + ".wat"));
  const wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));

  if (args.wat && !(hasOutput(ascArgv, ".wat") || config.options?.textFile)) {
    ascArgv.push("--textFile", watFile);
  }
  if (args.outDir || !containsOutput(config, target, ascArgv)) {
    ascArgv.push("--binaryFile", wasmFile);
  }

  if (args.verbose) {
    log(["asc", ...ascArgv].join(" "));
  }
  asc.main(ascArgv, options, cb);
}

function hasOutput(ascArgv: string[], suffix: string): boolean {
  return ascArgv.some((s) => s.endsWith(suffix));
}

function containsOutput(
  config: any,
  target: string,
  ascArgv: string[]
): boolean {
  if (hasOutput(ascArgv, ".wasm")) return true;
  if (config.options?.binaryFile) return true;
  if (config.targets && config.targets[target]?.binaryFile) return true;
  return false;
}
