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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYnVpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFDekIsa0NBQXFFO0FBV3JFLElBQU0sYUFBYSxHQUFHLCtIQUkrQixDQUFDO0FBRXRELFNBQWdCLGVBQWUsQ0FBQyxDQUFhO0lBQzNDLE9BQU8sQ0FBQztTQUNMLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHdCQUF3QjtRQUNyQyxPQUFPLEVBQUUsU0FBUztLQUNuQixDQUFDO1NBQ0QsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUFFLG1DQUFtQztLQUNqRCxDQUFDLENB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LE9BQU8sSUFBSSxDQUFDO0lBQzVDLElBQUksTUFBTSxDQUFDLE9BQU8sV0FBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQywwQ0FBRSxVQUFVLENBQUE7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN0RSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGFzYyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuaW1wb3J0ICogYXMgYXNjT3B0aW9ucyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL3V0aWwvb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBnZXRHbG9iYWxBc2NPcHRpb25zLCBnZXRHbG9iYWxDbGlDYWxsYmFjayB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbnRlcmZhY2UgQnVpbGRBcmdzIHtcbiAgYmFzZURpcjogc3RyaW5nO1xuICBjb25maWc6IHN0cmluZztcbiAgd2F0OiBib29sZWFuO1xuICBvdXREaXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdGFyZ2V0OiBzdHJpbmc7XG4gIHZlcmJvc2U6IGJvb2xlYW47XG59XG5cbmNvbnN0IGJ1aWxkQ21kVXNhZ2UgPSBgJDAgYnVpbGRcbkNvbXBpbGUgYSBsb2NhbCBwYWNrYWdlIGFuZCBhbGwgb2YgaXRzIGRlcGVuZGVuY2llc1xuXG5VU0FHRTpcbiAgICAkMCBidWlsZCBbZW50cnlfZmlsZV0gW29wdGlvbnNdIC0tIFthc2Nfb3B0aW9uc11gO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDbWRCdWlsZGVyKHk6IHlhcmdzLkFyZ3YpIHtcbiAgcmV0dXJuIHlcbiAgICAub3B0aW9uKFwiYmFzZURpclwiLCB7XG4gICAgICBhbGlhczogXCJkXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiQmFzZSBkaXJlY3Rvcnkgb2YgcHJvamVjdC5cIixcbiAgICAgIGRlZmF1bHQ6IFwiLlwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcImNvbmZpZ1wiLCB7XG4gICAgICBhbGlhczogXCJjXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBhc2NvbmZpZyBmaWxlXCIsXG4gICAgICBkZWZhdWx0OiBcIi4vYXNjb25maWcuanNvblwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcIndhdFwiLCB7XG4gICAgICBkZXNjcmlwdGlvbjogXCJPdXRwdXQgd2F0IGZpbGUgdG8gb3V0RGlyXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgfSlcbiAgICAub3B0aW9uKFwib3V0RGlyXCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ0RpcmVjdG9yeSB0byBwbGFjZSBidWlsdCBiaW5hcmllcy4gRGVmYXVsdCBcIi4vYnVpbGQvPHRhcmdldD4vXCInLFxuICAgIH0pXG4gICAgLm9wdGlvbihcInRhcmdldFwiLCB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGFyZ2V0IGZvciBjb21waWxhdGlvblwiLFxuICAgICAgZGVmYXVsdDogXCJyZWxlYXNlXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidmVyYm9zZVwiLCB7XG4gICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmludCBvdXQgYXJndW1lbnRzIHBhc3NlZCB0byBhc2NcIixcbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IEJ1aWxkQ21kOiB5YXJncy5Db21tYW5kTW9kdWxlID0ge1xuICBjb21tYW5kOiBcImJ1aWxkXCIsXG4gIGRlc2NyaWJlOiBcIkNvbXBpbGUgYSBsb2NhbCBwYWNrYWdlIGFuZCBhbGwgb2YgaXRzIGRlcGVuZGVuY2llc1wiLFxuICBhbGlhc2VzOiBbXCJjb21waWxlXCIsIFwibWFrZVwiXSxcbiAgYnVpbGRlcjogKHkpID0+XG4gICAgYnVpbGRDbWRCdWlsZGVyKHkpXG4gICAgICAudXNhZ2UoYnVpbGRDbWRVc2FnZSlcbiAgICAgIC5leGFtcGxlKFxuICAgICAgICBcImFzYiBidWlsZFwiLFxuICAgICAgICBcIkJ1aWxkIHJlbGVhc2Ugb2YgJ2Fzc2VtYmx5L2luZGV4LnRzIHRvIGJ1aWxkL3JlbGVhc2UvcGFja2FnZU5hbWUud2FzbVwiXG4gICAgICApXG4gICAgICAuZXhhbXBsZShcImFzYiBidWlsZCAtLXRhcmdldCByZWxlYXNlXCIsIFwiQnVpbGQgYSByZWxlYXNlIGJpbmFyeVwiKVxuICAgICAgLmV4YW1wbGUoXCJhc2IgYnVpbGQgLS0gLS1tZWFzdXJlXCIsIFwiUGFzcyBhcmd1bWVudCB0byAnYXNjJ1wiKSxcbiAgaGFuZGxlcjogKGFyZ3MpID0+IHtcbiAgICBpZiAoW1wiYnVpbGRcIiwgXCJtYWtlXCIsIFwiY29tcGlsZVwiXS5pbmNsdWRlcyhhcmdzW1wiX1wiXVswXSBhcyBzdHJpbmcpKSB7XG4gICAgICBhcmdzW1wiX1wiXSA9IGFyZ3NbXCJfXCJdLnNsaWNlKDEpO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0gZ2V0R2xvYmFsQXNjT3B0aW9ucygpO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gZ2V0R2xvYmFsQ2xpQ2FsbGJhY2soKTtcbiAgICBjb25zdCBidWlsZEFyZ3MgPSAoYXJncyBhcyB1bmtub3duKSBhcyBCdWlsZEFyZ3M7XG4gICAgY29uc3QgYXNjQXJndiA9IGFyZ3NbXCJfXCJdIGFzIHN0cmluZ1tdO1xuICAgIGNvbnN0IFtiYXNlRGlyLCBjb25maWdQYXRoXSA9IGdldFNldHVwKGJ1aWxkQXJncyk7XG4gICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKGNvbmZpZ1BhdGgpO1xuICAgIGNvbnN0IG91dERpciA9XG4gICAgICBhcmdzLm91dERpciB8fCBjb25maWcub3V0RGlyIHx8IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcIi4vYnVpbGRcIik7XG4gICAgaWYgKGNvbmZpZy53b3Jrc3BhY2VzKSB7XG4gICAgICBpZiAoISg8YW55PmNvbmZpZy53b3Jrc3BhY2VzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uLiBTaG91bGQgYmUgYW4gYXJyYXkuXCIpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgICBjb25zdCB3b3Jrc3BhY2VzID0gY29uZmlnLndvcmtzcGFjZXMgYXMgc3RyaW5nW107XG4gICAgICBmb3IgKGxldCB3b3Jrc3BhY2Ugb2Ygd29ya3NwYWNlcykge1xuICAgICAgICBhcmdzLmJhc2VEaXIgPSBwYXRoLmpvaW4oYmFzZURpciwgd29ya3NwYWNlKTtcbiAgICAgICAgYXJncy5vdXREaXIgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIG91dERpcik7XG4gICAgICAgIGNvbXBpbGVQcm9qZWN0KGJ1aWxkQXJncywgYXNjQXJndi5zbGljZSgwKSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21waWxlUHJvamVjdChidWlsZEFyZ3MsIGFzY0FyZ3YsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBnZXRTZXR1cChhcmdzOiBCdWlsZEFyZ3MpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgbGV0IGJhc2VEaXIgPSBhcmdzLmJhc2VEaXI7XG4gIGJhc2VEaXIgPSBiYXNlRGlyID09IFwiLlwiID8gcHJvY2Vzcy5jd2QoKSA6IGJhc2VEaXI7XG4gIGxldCBjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihiYXNlRGlyLCBhcmdzLmNvbmZpZykpO1xuICByZXR1cm4gW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdO1xufVxuXG5jb25zdCBERUZBVUxUX0NPTkZJRyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDb25maWcoY29uZmlnUGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShjb25maWdQYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gREVGQVVMVF9DT05GSUc7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FmZVJlcXVpcmUocGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShwYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzVGFyZ2V0KGNvbmZpZzogYW55LCB0YXJnZXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY29uZmlnLnRhcmdldHMgJiYgY29uZmlnLnRhcmdldHNbdGFyZ2V0XTtcbn1cblxuLy8gQHRzLWlnbm9yZVxuZnVuY3Rpb24gY29tcGlsZVByb2plY3QoXG4gIGFyZ3M6IEJ1aWxkQXJncyxcbiAgYXNjQXJndjogc3RyaW5nW10sXG4gIG9wdGlvbnM6IGFzYy5BUElPcHRpb25zLFxuICBjYj86IChhOiBhbnkpID0+IG51bWJlclxuKTogdm9pZCB7XG4gIGNvbnN0IFtiYXNlRGlyLCBjb25maWdQYXRoXSA9IGdldFNldHVwKGFyZ3MpO1xuICBsZXQgY29uZmlnOiBhbnkgPSBnZXRDb25maWcoY29uZmlnUGF0aCk7XG5cbiAgaWYgKGNvbmZpZyAhPT0gREVGQVVMVF9DT05GSUcpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWNvbmZpZ1wiLCBjb25maWdQYXRoKTtcbiAgfVxuXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gc2FmZVJlcXVpcmUocGF0aC5qb2luKGJhc2VEaXIsIFwicGFja2FnZS5qc29uXCIpKTtcbiAgY29uc3QgYXNjQXJncyA9IGFzY09wdGlvbnMucGFyc2UoYXNjQXJndiwgYXNjLm9wdGlvbnMsIGZhbHNlKTtcbiAgbGV0IGVudHJ5RmlsZTogc3RyaW5nO1xuICBzd2l0Y2ggKGFzY0FyZ3MuYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDoge1xuICAgICAgZW50cnlGaWxlID0gcGF0aC5qb2luKFxuICAgICAgICBiYXNlRGlyLFxuICAgICAgICBjb25maWcuZW50cnkgfHwgcGF0aC5qb2luKFwiYXNzZW1ibHlcIiwgXCJpbmRleC50c1wiKVxuICAgICAgKTtcbiAgICAgIGFzY0FyZ3YudW5zaGlmdChlbnRyeUZpbGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMToge1xuICAgICAgZW50cnlGaWxlID0gYXNjQXJncy5hcmd1bWVudHNbMF07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBjb21waWxlIHR3byBlbnRyeSBmaWxlcyBhdCBvbmNlLlwiKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWZzLmV4aXN0c1N5bmMoZW50cnlGaWxlKSkge1xuICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xuICAgIHRocm93IG5ldyBFcnJvcihgRW50cnkgZmlsZSAke2VudHJ5RmlsZX0gZG9lc24ndCBleGlzdGApO1xuICB9XG5cbiAgbGV0IG5hbWU6IHN0cmluZztcbiAgaWYgKGVudHJ5RmlsZS5lbmRzV2l0aChcImluZGV4LnRzXCIpKSB7XG4gICAgaWYgKHBhY2thZ2VKc29uLm5hbWUpIHtcbiAgICAgIG5hbWUgPSBwYWNrYWdlSnNvbi5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gcGF0aC5iYXNlbmFtZShwYXRoLmJhc2VuYW1lKGJhc2VEaXIpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbmFtZSA9IHBhdGguYmFzZW5hbWUoZW50cnlGaWxlKS5yZXBsYWNlKFwiLnRzXCIsIFwiXCIpO1xuICB9XG5cbiAgbGV0IHRhcmdldCA9IGFyZ3MudGFyZ2V0O1xuICBpZiAodGFyZ2V0ID09PSBcImRlYnVnXCIgJiYgIWhhc1RhcmdldChjb25maWcsIFwiZGVidWdcIikpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWRlYnVnXCIpO1xuICB9IGVsc2UgaWYgKHRhcmdldCA9PT0gXCJyZWxlYXNlXCIgJiYgIWhhc1RhcmdldChjb25maWcsIFwicmVsZWFzZVwiKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tb3B0aW1pemVMZXZlbFwiLCBcIjNcIik7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1zaHJpbmtMZXZlbFwiLCBcIjNcIik7XG4gIH1cblxuICBpZiAoIWFzY0FyZ3Mub3B0aW9ucz8udGFyZ2V0KSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS10YXJnZXRcIiwgdGFyZ2V0KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSBhc2NBcmdzLm9wdGlvbnMudGFyZ2V0IGFzIHN0cmluZztcbiAgfVxuXG4gIGxldCBvdXREaXIgPSBhcmdzLm91dERpciA/IGFyZ3Mub3V0RGlyIDogY29uZmlnLm91dERpciB8fCBcIi4vYnVpbGRcIjtcbiAgb3V0RGlyID0gcGF0aC5qb2luKGJhc2VEaXIsIG91dERpciwgdGFyZ2V0KTtcbiAgY29uc3Qgd2F0RmlsZSA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgcGF0aC5qb2luKG91dERpciwgbmFtZSArIFwiLndhdFwiKSk7XG4gIGNvbnN0IHdhc21GaWxlID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBwYXRoLmpvaW4ob3V0RGlyLCBuYW1lICsgXCIud2FzbVwiKSk7XG5cbiAgaWYgKGFyZ3Mud2F0ICYmICEoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhdFwiKSB8fCBjb25maWcub3B0aW9ucz8udGV4dEZpbGUpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS10ZXh0RmlsZVwiLCB3YXRGaWxlKTtcbiAgfVxuICBpZiAoYXJncy5vdXREaXIgfHwgIWNvbnRhaW5zT3V0cHV0KGNvbmZpZywgdGFyZ2V0LCBhc2NBcmd2KSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tYmluYXJ5RmlsZVwiLCB3YXNtRmlsZSk7XG4gIH1cblxuICBpZiAoYXJncy52ZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coW1wiYXNjXCIsIC4uLmFzY0FyZ3ZdLmpvaW4oXCIgXCIpKTtcbiAgfVxuICBhc2MubWFpbihhc2NBcmd2LCBvcHRpb25zLCBjYik7XG59XG5cbmZ1bmN0aW9uIGhhc091dHB1dChhc2NBcmd2OiBzdHJpbmdbXSwgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGFzY0FyZ3Yuc29tZSgocykgPT4gcy5lbmRzV2l0aChzdWZmaXgpKTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNPdXRwdXQoXG4gIGNvbmZpZzogYW55LFxuICB0YXJnZXQ6IHN0cmluZyxcbiAgYXNjQXJndjogc3RyaW5nW11cbik6IGJvb2xlYW4ge1xuICBpZiAoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhc21cIikpIHJldHVybiB0cnVlO1xuICBpZiAoY29uZmlnLm9wdGlvbnM/LmJpbmFyeUZpbGUpIHJldHVybiB0cnVlO1xuICBpZiAoY29uZmlnLnRhcmdldHMgJiYgY29uZmlnLnRhcmdldHNbdGFyZ2V0XT8uYmluYXJ5RmlsZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==