import * as yargs from "yargs";
import fs from "fs";

const runCmdUsage = `asb run
Run a WASI binary

USAGE:
    $0 run [options] [binary path] -- [binary options]`;

export const RunCmd: yargs.CommandModule = {
  command: "run <binary>",
  describe: "Run a WASI binary",
  builder: (y) =>
    y
      .usage(runCmdUsage)
      .positional("binary", {
        describe: "path to Wasm binary",
        type: "string",
      })
      .option("preopen", {
        alias: ["p"],
        default: process.cwd(),
        boolean: false,
        description: "comma separated list of directories to open.",
      }),
  handler: async (args) => {
    const wasiArgs = args["_"].slice(1) as string[];

    const { WASI } = await import('wasi');
    const wasi = new WASI({
      args: wasiArgs,
      env: process.env,
      preopens: {
        "/": <string>args.preopen,
      },
    });
    const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

    const wasm = await WebAssembly.compile(
      fs.readFileSync(args.binary as string)
    );
    const instance = await WebAssembly.instantiate(wasm, importObject);
    wasi.start(instance);
  },
};
