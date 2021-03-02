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
    if (args.outDir ||
        !containsOutput(config, target, ascArgv)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQix5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFZekIsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QixJQUFJLElBQUksR0FBZ0IsS0FBSztTQUMxQixLQUFLLENBQ0osa0dBQWtHLENBQ25HO1NBQ0EsT0FBTyxDQUNOLEtBQUssRUFDTCx1RUFBdUUsQ0FDeEU7U0FDQSxPQUFPLENBQUMsc0JBQXNCLEVBQUUsd0JBQXdCLENBQUM7U0FDekQsT0FBTyxDQUFDLGtCQUFrQixFQUFFLHdCQUF3QixDQUFDO1NBQ3JELE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFR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QUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxPQUFpQixFQUFFLE1BQWM7SUFDbEQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFHRCxTQUFTLGNBQWMsQ0FBQyxNQUFXLEVBQUUsTUFBYyxFQUFFLE9BQWlCOztJQUNwRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDN0MsVUFBSSxNQUFNLENBQUMsT0FBTywwQ0FBRSxVQUFVO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDNUMsSUFBSSxNQUFNLENBQUMsT0FBTyxXQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLDBDQUFFLFVBQVUsQ0FBQTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3RFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhcmdzIGZyb20gXCJ5YXJnc1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgYXNjIGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvYXNjXCI7XG5pbXBvcnQgKiBhcyBhc2NPcHRpb25zIGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvdXRpbC9vcHRpb25zXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBU0J1aWxkQXJncyB7XG4gIFt4OiBzdHJpbmddOiB1bmtub3duO1xuICBiYXNlRGlyOiBzdHJpbmc7XG4gIGNvbmZpZzogc3RyaW5nO1xuICB3YXQ6IGJvb2xlYW47XG4gIG91dERpcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICB0YXJnZXQ6IHN0cmluZztcbiAgdmVyYm9zZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oXG4gIGNsaTogc3RyaW5nW10sXG4gIG9wdGlvbnM6IGFzYy5BUElPcHRpb25zID0ge30sXG4gIGNhbGxiYWNrPzogKGE6IGFueSkgPT4gbnVtYmVyXG4pIHtcbiAgbGV0IGFyZ3M6IEFTQnVpbGRBcmdzID0geWFyZ3NcbiAgICAudXNhZ2UoXG4gICAgICBcIkJ1aWxkIHRvb2wgZm9yIEFzc2VtYmx5U2NyaXB0IHByb2plY3RzLlxcblxcblVzYWdlOlxcbiAgYXNiIFtpbnB1dCBmaWxlXSBbb3B0aW9uc10gLS0gW2FzYyBvcHRpb25zXVwiXG4gICAgKVxuICAgIC5leGFtcGxlKFxuICAgICAgXCJhc2JcIixcbiAgICAgIFwiQnVpbGQgcmVsZWFzZSBvZiAnYXNzZW1ibHkvaW5kZXgudHMgdG8gYnVpbGQvcmVsZWFzZS9wYWNrYWdlTmFtZS53YXNtXCJcbiAgICApXG4gICAgLmV4YW1wbGUoXCJhc2IgLS10YXJnZXQgcmVsZWFzZVwiLCBcIkJ1aWxkIGEgcmVsZWFzZSBiaW5hcnlcIilcbiAgICAuZXhhbXBsZShcImFzYiAtLSAtLW1lYXN1cmVcIiwgXCJQYXNzIGFyZ3VtZW50IHRvICdhc2MnXCIpXG4gICAgLm9wdGlvbihcImJhc2VEaXJcIiwge1xuICAgICAgYWxpYXM6IFwiZFwiLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkJhc2UgZGlyZWN0b3J5IG9mIHByb2plY3QuXCIsXG4gICAgICBkZWZhdWx0OiBcIi5cIixcbiAgICB9KVxuICAgIC5vcHRpb24oXCJjb25maWdcIiwge1xuICAgICAgYWxpYXM6IFwiY1wiLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYXNjb25maWcgZmlsZVwiLFxuICAgICAgZGVmYXVsdDogXCIuL2FzY29uZmlnLmpzb25cIixcbiAgICB9KVxuICAgIC5vcHRpb24oXCJ3YXRcIiwge1xuICAgICAgZGVzY3JpcHRpb246IFwiT3V0cHV0IHdhdCBmaWxlIHRvIG91dERpclwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBib29sZWFuOiB0cnVlLFxuICAgIH0pXG4gICAgLm9wdGlvbihcIm91dERpclwiLCB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdEaXJlY3RvcnkgdG8gcGxhY2UgYnVpbHQgYmluYXJpZXMuIERlZmF1bHQgXCIuL2J1aWxkLzx0YXJnZXQ+L1wiJyxcbiAgICB9KVxuICAgIC5vcHRpb24oXCJ0YXJnZXRcIiwge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlRhcmdldCBmb3IgY29tcGlsYXRpb25cIixcbiAgICAgIGRlZmF1bHQ6IFwicmVsZWFzZVwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcInZlcmJvc2VcIiwge1xuICAgICAgYm9vbGVhbjogdHJ1ZSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IFwiUHJpbnQgb3V0IGFyZ3VtZW50cyBwYXNzZWQgdG8gYXNjXCIsXG4gICAgfSlcbiAgICAucGFyc2UoY2xpKTtcblxuICBjb25zdCBhc2NBcmd2ID0gYXJnc1tcIl9cIl0gYXMgc3RyaW5nW107XG4gIGNvbnN0IFtiYXNlRGlyLCBjb25maWdQYXRoXSA9IGdldFNldHVwKGFyZ3MpO1xuICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoY29uZmlnUGF0aCk7XG4gIGNvbnN0IG91dERpciA9XG4gICAgYXJncy5vdXREaXIgfHwgY29uZmlnLm91dERpciB8fCBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCIuL2J1aWxkXCIpO1xuICBpZiAoY29uZmlnLndvcmtzcGFjZXMpIHtcbiAgICBpZiAoISg8YW55PmNvbmZpZy53b3Jrc3BhY2VzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbi4gU2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG4gICAgY29uc3Qgd29ya3NwYWNlcyA9IGNvbmZpZy53b3Jrc3BhY2VzIGFzIHN0cmluZ1tdO1xuICAgIGZvciAobGV0IHdvcmtzcGFjZSBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICBhcmdzLmJhc2VEaXIgPSBwYXRoLmpvaW4oYmFzZURpciwgd29ya3NwYWNlKTtcbiAgICAgIGFyZ3Mub3V0RGlyID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBvdXREaXIpO1xuICAgICAgY29tcGlsZVByb2plY3QoYXJncywgYXNjQXJndi5zbGljZSgwKSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb21waWxlUHJvamVjdChhcmdzLCBhc2NBcmd2LCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2V0dXAoYXJnczogQVNCdWlsZEFyZ3MpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgbGV0IGJhc2VEaXIgPSBhcmdzLmJhc2VEaXI7XG4gIGJhc2VEaXIgPSBiYXNlRGlyID09IFwiLlwiID8gcHJvY2Vzcy5jd2QoKSA6IGJhc2VEaXI7XG4gIGxldCBjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihiYXNlRGlyLCBhcmdzLmNvbmZpZykpO1xuICByZXR1cm4gW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdO1xufVxuXG5jb25zdCBERUZBVUxUX0NPTkZJRyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDb25maWcoY29uZmlnUGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShjb25maWdQYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gREVGQVVMVF9DT05GSUc7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FmZVJlcXVpcmUocGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShwYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzVGFyZ2V0KGNvbmZpZzogYW55LCB0YXJnZXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY29uZmlnLnRhcmdldHMgJiYgY29uZmlnLnRhcmdldHNbdGFyZ2V0XTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZVByb2plY3QoXG4gIGFyZ3M6IEFTQnVpbGRBcmdzLFxuICBhc2NBcmd2OiBzdHJpbmdbXSxcbiAgb3B0aW9uczogYXNjLkFQSU9wdGlvbnMsXG4gIGNiPzogKGE6IGFueSkgPT4gbnVtYmVyXG4pOiB2b2lkIHtcbiAgY29uc3QgW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdID0gZ2V0U2V0dXAoYXJncyk7XG4gIGxldCBjb25maWc6IGFueSA9IGdldENvbmZpZyhjb25maWdQYXRoKTtcblxuICBpZiAoY29uZmlnICE9PSBERUZBVUxUX0NPTkZJRykge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tY29uZmlnXCIsIGNvbmZpZ1BhdGgpO1xuICB9XG5cblxuICBjb25zdCBwYWNrYWdlSnNvbiA9IHNhZmVSZXF1aXJlKHBhdGguam9pbihiYXNlRGlyLCBcInBhY2thZ2UuanNvblwiKSk7XG4gIGNvbnN0IGFzY0FyZ3MgPSBhc2NPcHRpb25zLnBhcnNlKGFzY0FyZ3YsIGFzYy5vcHRpb25zLCBmYWxzZSk7XG4gIGxldCBlbnRyeUZpbGU6IHN0cmluZztcbiAgc3dpdGNoIChhc2NBcmdzLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHtcbiAgICAgIGVudHJ5RmlsZSA9IHBhdGguam9pbihcbiAgICAgICAgYmFzZURpcixcbiAgICAgICAgY29uZmlnLmVudHJ5IHx8IHBhdGguam9pbihcImFzc2VtYmx5XCIsIFwiaW5kZXgudHNcIilcbiAgICAgICk7XG4gICAgICBhc2NBcmd2LnVuc2hpZnQoZW50cnlGaWxlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDE6IHtcbiAgICAgIGVudHJ5RmlsZSA9IGFzY0FyZ3MuYXJndW1lbnRzWzBdO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgY29tcGlsZSB0d28gZW50cnkgZmlsZXMgYXQgb25jZS5cIik7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGVudHJ5RmlsZSkpIHtcbiAgICBjb25zb2xlLmxvZyhhcmdzKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVudHJ5IGZpbGUgJHtlbnRyeUZpbGV9IGRvZXNuJ3QgZXhpc3RgKTtcbiAgfVxuXG4gIGxldCBuYW1lOiBzdHJpbmc7XG4gIGlmIChlbnRyeUZpbGUuZW5kc1dpdGgoXCJpbmRleC50c1wiKSkge1xuICAgIGlmIChwYWNrYWdlSnNvbi5uYW1lKSB7XG4gICAgICBuYW1lID0gcGFja2FnZUpzb24ubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IHBhdGguYmFzZW5hbWUocGF0aC5iYXNlbmFtZShiYXNlRGlyKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lKGVudHJ5RmlsZSkucmVwbGFjZShcIi50c1wiLCBcIlwiKTtcbiAgfVxuXG4gIGxldCB0YXJnZXQgPSBhcmdzLnRhcmdldDtcbiAgaWYgKHRhcmdldCA9PT0gXCJkZWJ1Z1wiICYmICFoYXNUYXJnZXQoY29uZmlnLCBcImRlYnVnXCIpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1kZWJ1Z1wiKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQgPT09IFwicmVsZWFzZVwiICYmICFoYXNUYXJnZXQoY29uZmlnLCBcInJlbGVhc2VcIikpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLW9wdGltaXplTGV2ZWxcIiwgXCIzXCIpO1xuICAgIGFzY0FyZ3YucHVzaChcIi0tc2hyaW5rTGV2ZWxcIiwgXCIzXCIpO1xuICB9XG5cbiAgaWYgKCFhc2NBcmdzLm9wdGlvbnM/LnRhcmdldCkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGFyZ2V0XCIsIHRhcmdldCk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gYXNjQXJncy5vcHRpb25zLnRhcmdldCBhcyBzdHJpbmc7XG4gIH1cblxuICBsZXQgb3V0RGlyID0gYXJncy5vdXREaXIgPyBhcmdzLm91dERpciA6IGNvbmZpZy5vdXREaXIgfHwgXCIuL2J1aWxkXCI7XG4gIG91dERpciA9IHBhdGguam9pbihiYXNlRGlyLCBvdXREaXIsIHRhcmdldCk7XG4gIGNvbnN0IHdhdEZpbGUgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXRcIikpO1xuICBjb25zdCB3YXNtRmlsZSA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgcGF0aC5qb2luKG91dERpciwgbmFtZSArIFwiLndhc21cIikpO1xuXG4gIGlmIChhcmdzLndhdCAmJiAhKGhhc091dHB1dChhc2NBcmd2LCBcIi53YXRcIikgfHwgY29uZmlnLm9wdGlvbnM/LnRleHRGaWxlKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGV4dEZpbGVcIiwgd2F0RmlsZSk7XG4gIH1cbiAgaWYgKFxuICAgIGFyZ3Mub3V0RGlyIHx8XG4gICAgIWNvbnRhaW5zT3V0cHV0KGNvbmZpZywgdGFyZ2V0LCBhc2NBcmd2KVxuICApIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWJpbmFyeUZpbGVcIiwgd2FzbUZpbGUpO1xuICB9XG5cbiAgaWYgKGFyZ3MudmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKFtcImFzY1wiLCAuLi5hc2NBcmd2XS5qb2luKFwiIFwiKSk7XG4gIH1cbiAgYXNjLm1haW4oYXNjQXJndiwgb3B0aW9ucywgY2IpO1xufVxuXG5mdW5jdGlvbiBoYXNPdXRwdXQoYXNjQXJndjogc3RyaW5nW10sIHN1ZmZpeDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBhc2NBcmd2LnNvbWUoKHMpID0+IHMuZW5kc1dpdGgoc3VmZml4KSk7XG59XG5cblxuZnVuY3Rpb24gY29udGFpbnNPdXRwdXQoY29uZmlnOiBhbnksIHRhcmdldDogc3RyaW5nLCBhc2NBcmd2OiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICBpZiAoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhc21cIikpIHJldHVybiB0cnVlO1xuICBpZiAoY29uZmlnLm9wdGlvbnM/LmJpbmFyeUZpbGUpIHJldHVybiB0cnVlO1xuICBpZiAoY29uZmlnLnRhcmdldHMgJiYgY29uZmlnLnRhcmdldHNbdGFyZ2V0XT8uYmluYXJ5RmlsZSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn0iXX0=