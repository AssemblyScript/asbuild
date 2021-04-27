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
exports.BuildCmd = exports.buildCmdBuilder = void 0;
var path = __importStar(require("path"));
var asc = __importStar(require("assemblyscript/cli/asc"));
var ascOptions = __importStar(require("assemblyscript/cli/util/options"));
var fs = __importStar(require("fs"));
var utils_1 = require("../utils");
var buildCmdUsage = "$0 build\nCompile a local package and all of its dependencies\n\nUSAGE:\n    $0 build [entry_file] [options] -- [asc_options]";
function buildCmdBuilder(y) {
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
    });
}
exports.buildCmdBuilder = buildCmdBuilder;
exports.BuildCmd = {
    command: "build",
    describe: "Compile a local package and all of its dependencies",
    aliases: ["compile", "make"],
    builder: function (y) { return buildCmdBuilder(y).usage(buildCmdUsage); },
    handler: function (args) {
        if (["build", "make", "compile"].includes(args["_"][0])) {
            args["_"] = args["_"].slice(1);
        }
        var options = utils_1.getGlobalAscOptions();
        var callback = utils_1.getGlobalCliCallback();
        var buildArgs = args;
        var ascArgv = args["_"];
        var _a = getSetup(buildArgs), baseDir = _a[0], configPath = _a[1];
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
                compileProject(buildArgs, ascArgv.slice(0), options, callback);
            }
        }
        else {
            compileProject(buildArgs, ascArgv, options, callback);
        }
    },
};
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
function hasTarget(config, target) {
    return config.targets && config.targets[target];
}
// @ts-ignore
function compileProject(args, ascArgv, options, cb) {
    var _a, _b;
    var _c = getSetup(args), baseDir = _c[0], configPath = _c[1];
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
    if (target === "debug" && !hasTarget(config, "debug")) {
        ascArgv.push("--debug");
    }
    else if (target === "release" && !hasTarget(config, "release")) {
        ascArgv.push("--optimizeLevel", "3");
        ascArgv.push("--shrinkLevel", "3");
    }
    if (!((_a = ascArgs.options) === null || _a === void 0 ? void 0 : _a.target)) {
        ascArgv.push("--target", target);
    }
    else {
        target = ascArgs.options.target;
    }
    var outDir = args.outDir ? args.outDir : config.outDir || "./build";
    outDir = path.join(baseDir, outDir, target);
    var watFile = path.relative(baseDir, path.join(outDir, name + ".wat"));
    var wasmFile = path.relative(baseDir, path.join(outDir, name + ".wasm"));
    if (args.wat && !(hasOutput(ascArgv, ".wat") || ((_b = config.options) === null || _b === void 0 ? void 0 : _b.textFile))) {
        ascArgv.push("--textFile", watFile);
    }
    if (args.outDir || !containsOutput(config, target, ascArgv)) {
        ascArgv.push("--binaryFile", wasmFile);
    }
    if (args.verbose) {
        console.log(__spreadArrays(["asc"], ascArgv).join(" "));
    }
    asc.main(ascArgv, options, cb);
}
function hasOutput(ascArgv, suffix) {
    return ascArgv.some(function (s) { return s.endsWith(suffix); });
}
function containsOutput(config, target, ascArgv) {
    var _a, _b;
    if (hasOutput(ascArgv, ".wasm"))
        return true;
    if ((_a = config.options) === null || _a === void 0 ? void 0 : _a.binaryFile)
        return true;
    if (config.targets && ((_b = config.targets[target]) === null || _b === void 0 ? void 0 : _b.binaryFile))
        return true;
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYnVpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFDekIsa0NBQXFFO0FBV3JFLElBQU0sYUFBYSxHQUFHLCtIQUkrQixDQUFDO0FBRXRELFNBQWdCLGVBQWUsQ0FBQyxDQUFhO0lBQzNDLE9BQU8sQ0FBQztTQUNMLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHdCQUF3QjtRQUNyQyxPQUFPLEVBQUUsU0FBUztLQUNuQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLG1DQUFtQztLQUNqRCxDQUFDLENB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LE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhcmdzIGZyb20gXCJ5YXJnc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgYXNjIGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvYXNjXCI7XG5pbXBvcnQgKiBhcyBhc2NPcHRpb25zIGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvdXRpbC9vcHRpb25zXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGdldEdsb2JhbEFzY09wdGlvbnMsIGdldEdsb2JhbENsaUNhbGxiYWNrIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBCdWlsZEFyZ3Mge1xuICBiYXNlRGlyOiBzdHJpbmc7XG4gIGNvbmZpZzogc3RyaW5nO1xuICB3YXQ6IGJvb2xlYW47XG4gIG91dERpcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB0YXJnZXQ6IHN0cmluZztcbiAgdmVyYm9zZTogYm9vbGVhbjtcbn1cblxuY29uc3QgYnVpbGRDbWRVc2FnZSA9IGAkMCBidWlsZFxuQ29tcGlsZSBhIGxvY2FsIHBhY2thZ2UgYW5kIGFsbCBvZiBpdHMgZGVwZW5kZW5jaWVzXG5cblVTQUdFOlxuICAgICQwIGJ1aWxkIFtlbnRyeV9maWxlXSBbb3B0aW9uc10gLS0gW2FzY19vcHRpb25zXWA7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENtZEJ1aWxkZXIoeTogeWFyZ3MuQXJndikge1xuICByZXR1cm4geVxuICAgIC5vcHRpb24oXCJiYXNlRGlyXCIsIHtcbiAgICAgIGFsaWFzOiBcImRcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJCYXNlIGRpcmVjdG9yeSBvZiBwcm9qZWN0LlwiLFxuICAgICAgZGVmYXVsdDogXCIuXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwiY29uZmlnXCIsIHtcbiAgICAgIGFsaWFzOiBcImNcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGFzY29uZmlnIGZpbGVcIixcbiAgICAgIGRlZmF1bHQ6IFwiLi9hc2NvbmZpZy5qc29uXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwid2F0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk91dHB1dCB3YXQgZmlsZSB0byBvdXREaXJcIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgYm9vbGVhbjogdHJ1ZSxcbiAgICB9KVxuICAgIC5vcHRpb24oXCJvdXREaXJcIiwge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnRGlyZWN0b3J5IHRvIHBsYWNlIGJ1aWx0IGJpbmFyaWVzLiBEZWZhdWx0IFwiLi9idWlsZC88dGFyZ2V0Pi9cIicsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidGFyZ2V0XCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUYXJnZXQgZm9yIGNvbXBpbGF0aW9uXCIsXG4gICAgICBkZWZhdWx0OiBcInJlbGVhc2VcIixcbiAgICB9KVxuICAgIC5vcHRpb24oXCJ2ZXJib3NlXCIsIHtcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByaW50IG91dCBhcmd1bWVudHMgcGFzc2VkIHRvIGFzY1wiLFxuICAgIH0pO1xufVxuXG5leHBvcnQgY29uc3QgQnVpbGRDbWQ6IHlhcmdzLkNvbW1hbmRNb2R1bGUgPSB7XG4gIGNvbW1hbmQ6IFwiYnVpbGRcIixcbiAgZGVzY3JpYmU6IFwiQ29tcGlsZSBhIGxvY2FsIHBhY2thZ2UgYW5kIGFsbCBvZiBpdHMgZGVwZW5kZW5jaWVzXCIsXG4gIGFsaWFzZXM6IFtcImNvbXBpbGVcIiwgXCJtYWtlXCJdLFxuICBidWlsZGVyOiAoeSkgPT4gYnVpbGRDbWRCdWlsZGVyKHkpLnVzYWdlKGJ1aWxkQ21kVXNhZ2UpLFxuICBoYW5kbGVyOiAoYXJncykgPT4ge1xuICAgIGlmIChbXCJidWlsZFwiLCBcIm1ha2VcIiwgXCJjb21waWxlXCJdLmluY2x1ZGVzKGFyZ3NbXCJfXCJdWzBdKSkge1xuICAgICAgYXJnc1tcIl9cIl0gPSBhcmdzW1wiX1wiXS5zbGljZSgxKTtcbiAgICB9XG4gICAgY29uc3Qgb3B0aW9ucyA9IGdldEdsb2JhbEFzY09wdGlvbnMoKTtcbiAgICBjb25zdCBjYWxsYmFjayA9IGdldEdsb2JhbENsaUNhbGxiYWNrKCk7XG4gICAgY29uc3QgYnVpbGRBcmdzID0gKGFyZ3MgYXMgdW5rbm93bikgYXMgQnVpbGRBcmdzO1xuICAgIGNvbnN0IGFzY0FyZ3YgPSBhcmdzW1wiX1wiXSBhcyBzdHJpbmdbXTtcbiAgICBjb25zdCBbYmFzZURpciwgY29uZmlnUGF0aF0gPSBnZXRTZXR1cChidWlsZEFyZ3MpO1xuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyhjb25maWdQYXRoKTtcbiAgICBjb25zdCBvdXREaXIgPVxuICAgICAgYXJncy5vdXREaXIgfHwgY29uZmlnLm91dERpciB8fCBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCIuL2J1aWxkXCIpO1xuICAgIGlmIChjb25maWcud29ya3NwYWNlcykge1xuICAgICAgaWYgKCEoPGFueT5jb25maWcud29ya3NwYWNlcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbi4gU2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgfVxuICAgICAgY29uc3Qgd29ya3NwYWNlcyA9IGNvbmZpZy53b3Jrc3BhY2VzIGFzIHN0cmluZ1tdO1xuICAgICAgZm9yIChsZXQgd29ya3NwYWNlIG9mIHdvcmtzcGFjZXMpIHtcbiAgICAgICAgYXJncy5iYXNlRGlyID0gcGF0aC5qb2luKGJhc2VEaXIsIHdvcmtzcGFjZSk7XG4gICAgICAgIGFyZ3Mub3V0RGlyID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBvdXREaXIpO1xuICAgICAgICBjb21waWxlUHJvamVjdChidWlsZEFyZ3MsIGFzY0FyZ3Yuc2xpY2UoMCksIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZVByb2plY3QoYnVpbGRBcmdzLCBhc2NBcmd2LCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LFxufTtcblxuZnVuY3Rpb24gZ2V0U2V0dXAoYXJnczogQnVpbGRBcmdzKTogW3N0cmluZywgc3RyaW5nXSB7XG4gIGxldCBiYXNlRGlyID0gYXJncy5iYXNlRGlyO1xuICBiYXNlRGlyID0gYmFzZURpciA9PSBcIi5cIiA/IHByb2Nlc3MuY3dkKCkgOiBiYXNlRGlyO1xuICBsZXQgY29uZmlnUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oYmFzZURpciwgYXJncy5jb25maWcpKTtcbiAgcmV0dXJuIFtiYXNlRGlyLCBjb25maWdQYXRoXTtcbn1cblxuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlnKGNvbmZpZ1BhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoY29uZmlnUGF0aCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIERFRkFVTFRfQ09ORklHO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhZmVSZXF1aXJlKHBhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUocGF0aCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RhcmdldChjb25maWc6IGFueSwgdGFyZ2V0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvbmZpZy50YXJnZXRzICYmIGNvbmZpZy50YXJnZXRzW3RhcmdldF07XG59XG5cbi8vIEB0cy1pZ25vcmVcbmZ1bmN0aW9uIGNvbXBpbGVQcm9qZWN0KFxuICBhcmdzOiBCdWlsZEFyZ3MsXG4gIGFzY0FyZ3Y6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhc2MuQVBJT3B0aW9ucyxcbiAgY2I/OiAoYTogYW55KSA9PiBudW1iZXJcbik6IHZvaWQge1xuICBjb25zdCBbYmFzZURpciwgY29uZmlnUGF0aF0gPSBnZXRTZXR1cChhcmdzKTtcbiAgbGV0IGNvbmZpZzogYW55ID0gZ2V0Q29uZmlnKGNvbmZpZ1BhdGgpO1xuXG4gIGlmIChjb25maWcgIT09IERFRkFVTFRfQ09ORklHKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1jb25maWdcIiwgY29uZmlnUGF0aCk7XG4gIH1cblxuICBjb25zdCBwYWNrYWdlSnNvbiA9IHNhZmVSZXF1aXJlKHBhdGguam9pbihiYXNlRGlyLCBcInBhY2thZ2UuanNvblwiKSk7XG4gIGNvbnN0IGFzY0FyZ3MgPSBhc2NPcHRpb25zLnBhcnNlKGFzY0FyZ3YsIGFzYy5vcHRpb25zLCBmYWxzZSk7XG4gIGxldCBlbnRyeUZpbGU6IHN0cmluZztcbiAgc3dpdGNoIChhc2NBcmdzLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHtcbiAgICAgIGVudHJ5RmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgYmFzZURpcixcbiAgICAgICAgY29uZmlnLmVudHJ5IHx8IHBhdGguam9pbihcImFzc2VtYmx5XCIsIFwiaW5kZXgudHNcIilcbiAgICAgICk7XG4gICAgICBhc2NBcmd2LnVuc2hpZnQoZW50cnlGaWxlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDE6IHtcbiAgICAgIGVudHJ5RmlsZSA9IGFzY0FyZ3MuYXJndW1lbnRzWzBdO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgY29tcGlsZSB0d28gZW50cnkgZmlsZXMgYXQgb25jZS5cIik7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGVudHJ5RmlsZSkpIHtcbiAgICBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVudHJ5IGZpbGUgJHtlbnRyeUZpbGV9IGRvZXNuJ3QgZXhpc3RgKTtcbiAgfVxuXG4gIGxldCBuYW1lOiBzdHJpbmc7XG4gIGlmIChlbnRyeUZpbGUuZW5kc1dpdGgoXCJpbmRleC50c1wiKSkge1xuICAgIGlmIChwYWNrYWdlSnNvbi5uYW1lKSB7XG4gICAgICBuYW1lID0gcGFja2FnZUpzb24ubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IHBhdGguYmFzZW5hbWUocGF0aC5iYXNlbmFtZShiYXNlRGlyKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lKGVudHJ5RmlsZSkucmVwbGFjZShcIi50c1wiLCBcIlwiKTtcbiAgfVxuXG4gIGxldCB0YXJnZXQgPSBhcmdzLnRhcmdldDtcbiAgaWYgKHRhcmdldCA9PT0gXCJkZWJ1Z1wiICYmICFoYXNUYXJnZXQoY29uZmlnLCBcImRlYnVnXCIpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1kZWJ1Z1wiKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQgPT09IFwicmVsZWFzZVwiICYmICFoYXNUYXJnZXQoY29uZmlnLCBcInJlbGVhc2VcIikpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLW9wdGltaXplTGV2ZWxcIiwgXCIzXCIpO1xuICAgIGFzY0FyZ3YucHVzaChcIi0tc2hyaW5rTGV2ZWxcIiwgXCIzXCIpO1xuICB9XG5cbiAgaWYgKCFhc2NBcmdzLm9wdGlvbnM/LnRhcmdldCkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGFyZ2V0XCIsIHRhcmdldCk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gYXNjQXJncy5vcHRpb25zLnRhcmdldCBhcyBzdHJpbmc7XG4gIH1cblxuICBsZXQgb3V0RGlyID0gYXJncy5vdXREaXIgPyBhcmdzLm91dERpciA6IGNvbmZpZy5vdXREaXIgfHwgXCIuL2J1aWxkXCI7XG4gIG91dERpciA9IHBhdGguam9pbihiYXNlRGlyLCBvdXREaXIsIHRhcmdldCk7XG4gIGNvbnN0IHdhdEZpbGUgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXRcIikpO1xuICBjb25zdCB3YXNtRmlsZSA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgcGF0aC5qb2luKG91dERpciwgbmFtZSArIFwiLndhc21cIikpO1xuXG4gIGlmIChhcmdzLndhdCAmJiAhKGhhc091dHB1dChhc2NBcmd2LCBcIi53YXRcIikgfHwgY29uZmlnLm9wdGlvbnM/LnRleHRGaWxlKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGV4dEZpbGVcIiwgd2F0RmlsZSk7XG4gIH1cbiAgaWYgKGFyZ3Mub3V0RGlyIHx8ICFjb250YWluc091dHB1dChjb25maWcsIHRhcmdldCwgYXNjQXJndikpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWJpbmFyeUZpbGVcIiwgd2FzbUZpbGUpO1xuICB9XG5cbiAgaWYgKGFyZ3MudmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKFtcImFzY1wiLCAuLi5hc2NBcmd2XS5qb2luKFwiIFwiKSk7XG4gIH1cbiAgYXNjLm1haW4oYXNjQXJndiwgb3B0aW9ucywgY2IpO1xufVxuXG5mdW5jdGlvbiBoYXNPdXRwdXQoYXNjQXJndjogc3RyaW5nW10sIHN1ZmZpeDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBhc2NBcmd2LnNvbWUoKHMpID0+IHMuZW5kc1dpdGgoc3VmZml4KSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zT3V0cHV0KFxuICBjb25maWc6IGFueSxcbiAgdGFyZ2V0OiBzdHJpbmcsXG4gIGFzY0FyZ3Y6IHN0cmluZ1tdXG4pOiBib29sZWFuIHtcbiAgaWYgKGhhc091dHB1dChhc2NBcmd2LCBcIi53YXNtXCIpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGNvbmZpZy5vcHRpb25zPy5iaW5hcnlGaWxlKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGNvbmZpZy50YXJnZXRzICYmIGNvbmZpZy50YXJnZXRzW3RhcmdldF0/LmJpbmFyeUZpbGUpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=