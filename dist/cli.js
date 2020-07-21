"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var yargs = __importStar(require("yargs"));
var path = __importStar(require("path"));
var asc = __importStar(require("assemblyscript/cli/asc"));
function main(cli, options, callback) {
    if (options === void 0) { options = {}; }
    var args = yargs
        .usage("Build tool for AssemblyScript projects.\n\nUsage:\n  asb [input file] [options] -- [asc options]")
        .example("asb", "Build release of 'assembly/index.ts to build/release/packageName.wasm")
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
        description: 'Directory to place built binaries. Default "./build/<target>/"',
    })
        .option("target", {
        type: "string",
        description: "Target for compilation",
        default: "release",
    })
        .parse(cli);
    var baseDir = args.baseDir;
    baseDir = baseDir == "." ? process.cwd() : baseDir;
    var packageJson = require(path.join(baseDir, "package.json"));
    var configPath = path.relative(baseDir, path.join(baseDir, args.config));
    var hasConfig = false;
    var config = {};
    try {
        config = require(configPath);
        hasConfig = true;
    }
    catch (error) { }
    var entryFile = path.join("assembly", "index.ts");
    var ascArgs = args["_"];
    // Check if first positional arg is not an option
    if (ascArgs.length > 0 && !ascArgs[0].startsWith("--")) {
        entryFile = path.relative(baseDir, ascArgs.shift());
    }
    else if (config.main) {
        entryFile = path.relative(baseDir, config.main);
    }
    var name = entryFile.endsWith("index.ts") && packageJson.name
        ? packageJson.name
        : path.basename(entryFile).replace(".ts", "");
    ascArgs.unshift(entryFile);
    var target = args.target;
    if (hasConfig)
        ascArgs.push("--config", configPath);
    var targetIndex = ascArgs.findIndex(function (s) { return s === "--target"; });
    if (targetIndex < 0) {
        ascArgs.push("--target", target);
    }
    else {
        target = ascArgs[targetIndex];
    }
    var outDir = args.outDir === undefined && config.outDir
        ? config.outDir
        : args.outDir || "./build";
    outDir = path.join(baseDir, outDir, target);
    var watFile = path.relative(baseDir, path.join(outDir, name + ".wat"));
    var wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));
    if (args.wat && !ascArgs.some(function (s) { return s.endsWith(".wat"); })) {
        ascArgs.push("--textFile", watFile);
    }
    if (!ascArgs.some(function (s) { return s.endsWith(".wasm"); })) {
        ascArgs.push("--binaryFile", wasmFile);
    }
    asc.main(ascArgs, options, callback);
}
exports.main = main;
