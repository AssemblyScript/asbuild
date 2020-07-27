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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var yargs = __importStar(require("yargs"));
var path = __importStar(require("path"));
var asc = __importStar(require("assemblyscript/cli/asc"));
var ascOptions = __importStar(require("assemblyscript/cli/util/options"));
var fs = __importStar(require("fs"));
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
        .option("verbose", {
        boolean: true,
        default: false,
        description: "Print out arguments passed to asc",
    })
        .parse(cli);
    var ascArgv = args["_"];
    var _a = getSetup(args), baseDir = _a[0], configPath = _a[1];
    var config = getConfig(configPath);
    var outDir = args.outDir || config.outDir || path.join(process.cwd(), "./build");
    if (config.workspaces) {
        if (!(config.workspaces instanceof Array)) {
            console.error("Invalid workspace configuration. Should be an array.");
            process.exit(1);
        }
        var workspaces = config.workspaces;
        for (var _i = 0, workspaces_1 = workspaces; _i < workspaces_1.length; _i++) {
            var workspace = workspaces_1[_i];
            args.baseDir = path.join(baseDir, workspace);
            args.outDir = path.relative(baseDir, outDir);
            compileProject(args, ascArgv.slice(0), options, callback);
        }
    }
    else {
        compileProject(args, ascArgv, options, callback);
    }
}
exports.main = main;
function getSetup(args) {
    var baseDir = args.baseDir;
    baseDir = baseDir == "." ? process.cwd() : baseDir;
    var configPath = path.resolve(path.join(baseDir, args.config));
    return [baseDir, configPath];
}
var DEFAULT_CONFIG = {};
function getConfig(configPath) {
    try {
        return require(configPath);
    }
    catch (error) {
        console.error(error);
        return DEFAULT_CONFIG;
    }
}
function safeRequire(path) {
    try {
        return require(path);
    }
    catch (error) {
        return {};
    }
}
function compileProject(args, ascArgv, options, cb) {
    var _a = getSetup(args), baseDir = _a[0], configPath = _a[1];
    var config = getConfig(configPath);
    if (config !== DEFAULT_CONFIG) {
        ascArgv.push("--config", configPath);
    }
    var packageJson = safeRequire(path.join(baseDir, "package.json"));
    var ascArgs = ascOptions.parse(ascArgv, asc.options, false);
    var entryFile;
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
        console.log(args);
        throw new Error("Entry file " + entryFile + " doesn't exist");
    }
    var name;
    if (entryFile.endsWith("index.ts")) {
        if (packageJson.name) {
            name = packageJson.name;
        }
        else {
            name = path.basename(path.basename(baseDir));
        }
    }
    else {
        name = path.basename(entryFile).replace(".ts", "");
    }
    var target = args.target;
    if (target === "debug" && !(config.target && config.target[target].debug)) {
        ascArgv.push("--debug");
    }
    if (!ascArgs.options.target) {
        ascArgv.push("--target", target);
    }
    else {
        target = ascArgs.options.target;
    }
    var outDir = args.outDir ? args.outDir : config.outDir || "./build";
    outDir = path.join(baseDir, outDir, target);
    var watFile = path.relative(baseDir, path.join(outDir, name + ".wat"));
    var wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));
    if (ascArgv.some(function (s) { return s.endsWith(".wat") || s.endsWith(".wasm"); })) {
        throw new Error("Don't use out files directly.");
    }
    if (args.wat) {
        ascArgv.push("--textFile", watFile);
    }
    ascArgv.push("--binaryFile", wasmFile);
    if (args.verbose) {
        console.log(__spreadArrays(["asc"], ascArgv).join(" "));
    }
    asc.main(ascArgv, options, cb);
}
