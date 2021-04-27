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
    builder: function (y) {
        return buildCmdBuilder(y)
            .usage(buildCmdUsage)
            .example("asb build", "Build release of 'assembly/index.ts to build/release/packageName.wasm")
            .example("asb build --target release", "Build a release binary")
            .example("asb build -- --measure", "Pass argument to 'asc'");
    },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYnVpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFDekIsa0NBQXFFO0FBV3JFLElBQU0sYUFBYSxHQUFHLCtIQUkrQixDQUFDO0FBRXRELFNBQWdCLGVBQWUsQ0FBQyxDQUFhO0lBQzNDLE9BQU8sQ0FBQztTQUNMLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHdCQUF3QjtRQUNyQyxPQUFPLEVBQUUsU0FBUztLQUNuQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLG1DQUFtQztLQUNqRCxDQUFDLENB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LE9BQU8sSUFBSSxDQUFDO0lBQzVDLElBQUksTUFBTSxDQUFDLE9BQU8sV0FBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQywwQ0FBRSxVQUFVLENBQUE7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN0RSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGFzYyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuaW1wb3J0ICogYXMgYXNjT3B0aW9ucyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL3V0aWwvb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBnZXRHbG9iYWxBc2NPcHRpb25zLCBnZXRHbG9iYWxDbGlDYWxsYmFjayB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbnRlcmZhY2UgQnVpbGRBcmdzIHtcbiAgYmFzZURpcjogc3RyaW5nO1xuICBjb25maWc6IHN0cmluZztcbiAgd2F0OiBib29sZWFuO1xuICBvdXREaXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdGFyZ2V0OiBzdHJpbmc7XG4gIHZlcmJvc2U6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJ1aWxkQ21kVXNhZ2UgPSBgJDAgYnVpbGRcbkNvbXBpbGUgYSBsb2NhbCBwYWNrYWdlIGFuZCBhbGwgb2YgaXRzIGRlcGVuZGVuY2llc1xuXG5VU0FHRTpcbiAgICAkMCBidWlsZCBbZW50cnlfZmlsZV0gW29wdGlvbnNdIC0tIFthc2Nfb3B0aW9uc11gO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDbWRCdWlsZGVyKHk6IHlhcmdzLkFyZ3YpIHtcbiAgcmV0dXJuIHlcbiAgICAub3B0aW9uKFwiYmFzZURpclwiLCB7XG4gICAgICBhbGlhczogXCJkXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiQmFzZSBkaXJlY3Rvcnkgb2YgcHJvamVjdC5cIixcbiAgICAgIGRlZmF1bHQ6IFwiLlwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcImNvbmZpZ1wiLCB7XG4gICAgICBhbGlhczogXCJjXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBhc2NvbmZpZyBmaWxlXCIsXG4gICAgICBkZWZhdWx0OiBcIi4vYXNjb25maWcuanNvblwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcIndhdFwiLCB7XG4gICAgICBkZXNjcmlwdGlvbjogXCJPdXRwdXQgd2F0IGZpbGUgdG8gb3V0RGlyXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgfSlcbiAgICAub3B0aW9uKFwib3V0RGlyXCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ0RpcmVjdG9yeSB0byBwbGFjZSBidWlsdCBiaW5hcmllcy4gRGVmYXVsdCBcIi4vYnVpbGQvPHRhcmdldD4vXCInLFxuICAgIH0pXG4gICAgLm9wdGlvbihcInRhcmdldFwiLCB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGFyZ2V0IGZvciBjb21waWxhdGlvblwiLFxuICAgICAgZGVmYXVsdDogXCJyZWxlYXNlXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidmVyYm9zZVwiLCB7XG4gICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmludCBvdXQgYXJndW1lbnRzIHBhc3NlZCB0byBhc2NcIixcbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IEJ1aWxkQ21kOiB5YXJncy5Db21tYW5kTW9kdWxlID0ge1xuICBjb21tYW5kOiBcImJ1aWxkXCIsXG4gIGRlc2NyaWJlOiBcIkNvbXBpbGUgYSBsb2NhbCBwYWNrYWdlIGFuZCBhbGwgb2YgaXRzIGRlcGVuZGVuY2llc1wiLFxuICBhbGlhc2VzOiBbXCJjb21waWxlXCIsIFwibWFrZVwiXSxcbiAgYnVpbGRlcjogKHkpID0+XG4gICAgYnVpbGRDbWRCdWlsZGVyKHkpXG4gICAgICAudXNhZ2UoYnVpbGRDbWRVc2FnZSlcbiAgICAgIC5leGFtcGxlKFxuICAgICAgICBcImFzYiBidWlsZFwiLFxuICAgICAgICBcIkJ1aWxkIHJlbGVhc2Ugb2YgJ2Fzc2VtYmx5L2luZGV4LnRzIHRvIGJ1aWxkL3JlbGVhc2UvcGFja2FnZU5hbWUud2FzbVwiXG4gICAgICApXG4gICAgICAuZXhhbXBsZShcImFzYiBidWlsZCAtLXRhcmdldCByZWxlYXNlXCIsIFwiQnVpbGQgYSByZWxlYXNlIGJpbmFyeVwiKVxuICAgICAgLmV4YW1wbGUoXCJhc2IgYnVpbGQgLS0gLS1tZWFzdXJlXCIsIFwiUGFzcyBhcmd1bWVudCB0byAnYXNjJ1wiKSxcbiAgaGFuZGxlcjogKGFyZ3MpID0+IHtcbiAgICBpZiAoW1wiYnVpbGRcIiwgXCJtYWtlXCIsIFwiY29tcGlsZVwiXS5pbmNsdWRlcyhhcmdzW1wiX1wiXVswXSkpIHtcbiAgICAgIGFyZ3NbXCJfXCJdID0gYXJnc1tcIl9cIl0uc2xpY2UoMSk7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSBnZXRHbG9iYWxBc2NPcHRpb25zKCk7XG4gICAgY29uc3QgY2FsbGJhY2sgPSBnZXRHbG9iYWxDbGlDYWxsYmFjaygpO1xuICAgIGNvbnN0IGJ1aWxkQXJncyA9IChhcmdzIGFzIHVua25vd24pIGFzIEJ1aWxkQXJncztcbiAgICBjb25zdCBhc2NBcmd2ID0gYXJnc1tcIl9cIl0gYXMgc3RyaW5nW107XG4gICAgY29uc3QgW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdID0gZ2V0U2V0dXAoYnVpbGRBcmdzKTtcbiAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoY29uZmlnUGF0aCk7XG4gICAgY29uc3Qgb3V0RGlyID1cbiAgICAgIGFyZ3Mub3V0RGlyIHx8IGNvbmZpZy5vdXREaXIgfHwgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwiLi9idWlsZFwiKTtcbiAgICBpZiAoY29uZmlnLndvcmtzcGFjZXMpIHtcbiAgICAgIGlmICghKDxhbnk+Y29uZmlnLndvcmtzcGFjZXMgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24uIFNob3VsZCBiZSBhbiBhcnJheS5cIik7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHdvcmtzcGFjZXMgPSBjb25maWcud29ya3NwYWNlcyBhcyBzdHJpbmdbXTtcbiAgICAgIGZvciAobGV0IHdvcmtzcGFjZSBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICAgIGFyZ3MuYmFzZURpciA9IHBhdGguam9pbihiYXNlRGlyLCB3b3Jrc3BhY2UpO1xuICAgICAgICBhcmdzLm91dERpciA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgb3V0RGlyKTtcbiAgICAgICAgY29tcGlsZVByb2plY3QoYnVpbGRBcmdzLCBhc2NBcmd2LnNsaWNlKDApLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBpbGVQcm9qZWN0KGJ1aWxkQXJncywgYXNjQXJndiwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgIH1cbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGdldFNldHVwKGFyZ3M6IEJ1aWxkQXJncyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICBsZXQgYmFzZURpciA9IGFyZ3MuYmFzZURpcjtcbiAgYmFzZURpciA9IGJhc2VEaXIgPT0gXCIuXCIgPyBwcm9jZXNzLmN3ZCgpIDogYmFzZURpcjtcbiAgbGV0IGNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKGJhc2VEaXIsIGFyZ3MuY29uZmlnKSk7XG4gIHJldHVybiBbYmFzZURpciwgY29uZmlnUGF0aF07XG59XG5cbmNvbnN0IERFRkFVTFRfQ09ORklHID0ge307XG5cbmZ1bmN0aW9uIGdldENvbmZpZyhjb25maWdQYXRoOiBzdHJpbmcpOiBhbnkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKGNvbmZpZ1BhdGgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBERUZBVUxUX0NPTkZJRztcbiAgfVxufVxuXG5mdW5jdGlvbiBzYWZlUmVxdWlyZShwYXRoOiBzdHJpbmcpOiBhbnkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKHBhdGgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNUYXJnZXQoY29uZmlnOiBhbnksIHRhcmdldDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb25maWcudGFyZ2V0cyAmJiBjb25maWcudGFyZ2V0c1t0YXJnZXRdO1xufVxuXG4vLyBAdHMtaWdub3JlXG5mdW5jdGlvbiBjb21waWxlUHJvamVjdChcbiAgYXJnczogQnVpbGRBcmdzLFxuICBhc2NBcmd2OiBzdHJpbmdbXSxcbiAgb3B0aW9uczogYXNjLkFQSU9wdGlvbnMsXG4gIGNiPzogKGE6IGFueSkgPT4gbnVtYmVyXG4pOiB2b2lkIHtcbiAgY29uc3QgW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdID0gZ2V0U2V0dXAoYXJncyk7XG4gIGxldCBjb25maWc6IGFueSA9IGdldENvbmZpZyhjb25maWdQYXRoKTtcblxuICBpZiAoY29uZmlnICE9PSBERUZBVUxUX0NPTkZJRykge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tY29uZmlnXCIsIGNvbmZpZ1BhdGgpO1xuICB9XG5cbiAgY29uc3QgcGFja2FnZUpzb24gPSBzYWZlUmVxdWlyZShwYXRoLmpvaW4oYmFzZURpciwgXCJwYWNrYWdlLmpzb25cIikpO1xuICBjb25zdCBhc2NBcmdzID0gYXNjT3B0aW9ucy5wYXJzZShhc2NBcmd2LCBhc2Mub3B0aW9ucywgZmFsc2UpO1xuICBsZXQgZW50cnlGaWxlOiBzdHJpbmc7XG4gIHN3aXRjaCAoYXNjQXJncy5hcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiB7XG4gICAgICBlbnRyeUZpbGUgPSBwYXRoLmpvaW4oXG4gICAgICAgIGJhc2VEaXIsXG4gICAgICAgIGNvbmZpZy5lbnRyeSB8fCBwYXRoLmpvaW4oXCJhc3NlbWJseVwiLCBcImluZGV4LnRzXCIpXG4gICAgICApO1xuICAgICAgYXNjQXJndi51bnNoaWZ0KGVudHJ5RmlsZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAxOiB7XG4gICAgICBlbnRyeUZpbGUgPSBhc2NBcmdzLmFyZ3VtZW50c1swXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGNvbXBpbGUgdHdvIGVudHJ5IGZpbGVzIGF0IG9uY2UuXCIpO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghZnMuZXhpc3RzU3luYyhlbnRyeUZpbGUpKSB7XG4gICAgY29uc29sZS5sb2coYXJncyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbnRyeSBmaWxlICR7ZW50cnlGaWxlfSBkb2Vzbid0IGV4aXN0YCk7XG4gIH1cblxuICBsZXQgbmFtZTogc3RyaW5nO1xuICBpZiAoZW50cnlGaWxlLmVuZHNXaXRoKFwiaW5kZXgudHNcIikpIHtcbiAgICBpZiAocGFja2FnZUpzb24ubmFtZSkge1xuICAgICAgbmFtZSA9IHBhY2thZ2VKc29uLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lKHBhdGguYmFzZW5hbWUoYmFzZURpcikpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuYW1lID0gcGF0aC5iYXNlbmFtZShlbnRyeUZpbGUpLnJlcGxhY2UoXCIudHNcIiwgXCJcIik7XG4gIH1cblxuICBsZXQgdGFyZ2V0ID0gYXJncy50YXJnZXQ7XG4gIGlmICh0YXJnZXQgPT09IFwiZGVidWdcIiAmJiAhaGFzVGFyZ2V0KGNvbmZpZywgXCJkZWJ1Z1wiKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tZGVidWdcIik7XG4gIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBcInJlbGVhc2VcIiAmJiAhaGFzVGFyZ2V0KGNvbmZpZywgXCJyZWxlYXNlXCIpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1vcHRpbWl6ZUxldmVsXCIsIFwiM1wiKTtcbiAgICBhc2NBcmd2LnB1c2goXCItLXNocmlua0xldmVsXCIsIFwiM1wiKTtcbiAgfVxuXG4gIGlmICghYXNjQXJncy5vcHRpb25zPy50YXJnZXQpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLXRhcmdldFwiLCB0YXJnZXQpO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IGFzY0FyZ3Mub3B0aW9ucy50YXJnZXQgYXMgc3RyaW5nO1xuICB9XG5cbiAgbGV0IG91dERpciA9IGFyZ3Mub3V0RGlyID8gYXJncy5vdXREaXIgOiBjb25maWcub3V0RGlyIHx8IFwiLi9idWlsZFwiO1xuICBvdXREaXIgPSBwYXRoLmpvaW4oYmFzZURpciwgb3V0RGlyLCB0YXJnZXQpO1xuICBjb25zdCB3YXRGaWxlID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBwYXRoLmpvaW4ob3V0RGlyLCBuYW1lICsgXCIud2F0XCIpKTtcbiAgY29uc3Qgd2FzbUZpbGUgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXNtXCIpKTtcblxuICBpZiAoYXJncy53YXQgJiYgIShoYXNPdXRwdXQoYXNjQXJndiwgXCIud2F0XCIpIHx8IGNvbmZpZy5vcHRpb25zPy50ZXh0RmlsZSkpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLXRleHRGaWxlXCIsIHdhdEZpbGUpO1xuICB9XG4gIGlmIChhcmdzLm91dERpciB8fCAhY29udGFpbnNPdXRwdXQoY29uZmlnLCB0YXJnZXQsIGFzY0FyZ3YpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1iaW5hcnlGaWxlXCIsIHdhc21GaWxlKTtcbiAgfVxuXG4gIGlmIChhcmdzLnZlcmJvc2UpIHtcbiAgICBjb25zb2xlLmxvZyhbXCJhc2NcIiwgLi4uYXNjQXJndl0uam9pbihcIiBcIikpO1xuICB9XG4gIGFzYy5tYWluKGFzY0FyZ3YsIG9wdGlvbnMsIGNiKTtcbn1cblxuZnVuY3Rpb24gaGFzT3V0cHV0KGFzY0FyZ3Y6IHN0cmluZ1tdLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gYXNjQXJndi5zb21lKChzKSA9PiBzLmVuZHNXaXRoKHN1ZmZpeCkpO1xufVxuXG5mdW5jdGlvbiBjb250YWluc091dHB1dChcbiAgY29uZmlnOiBhbnksXG4gIHRhcmdldDogc3RyaW5nLFxuICBhc2NBcmd2OiBzdHJpbmdbXVxuKTogYm9vbGVhbiB7XG4gIGlmIChoYXNPdXRwdXQoYXNjQXJndiwgXCIud2FzbVwiKSkgcmV0dXJuIHRydWU7XG4gIGlmIChjb25maWcub3B0aW9ucz8uYmluYXJ5RmlsZSkgcmV0dXJuIHRydWU7XG4gIGlmIChjb25maWcudGFyZ2V0cyAmJiBjb25maWcudGFyZ2V0c1t0YXJnZXRdPy5iaW5hcnlGaWxlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIl19