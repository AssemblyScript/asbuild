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
    return config.target && config.target[target][target];
}
function compileProject(args, ascArgv, options, cb) {
    var _a, _b, _c;
    var _d = getSetup(args), baseDir = _d[0], configPath = _d[1];
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
        !(hasOutput(ascArgv, ".wasm") || ((_c = config.options) === null || _c === void 0 ? void 0 : _c.binaryFile))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQix5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFZekIsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QixJQUFJLElBQUksR0FBZ0IsS0FBSztTQUMxQixLQUFLLENBQ0osa0dBQWtHLENBQ25HO1NBQ0EsT0FBTyxDQUNOLEtBQUssRUFDTCx1RUFBdUUsQ0FDeEU7U0FDQSxPQUFPLENBQUMsc0JBQXNCLEVBQUUsd0JBQXdCLENBQUM7U0FDekQsT0FBTyxDQUFDLGtCQUFrQixFQUFFLHdCQUF3QixDQUFDO1NBQ3JELE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFR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aEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBQyxLQUFLLEdBQUssT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxPQUFpQixFQUFFLE1BQWM7SUFDbEQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGFzYyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuaW1wb3J0ICogYXMgYXNjT3B0aW9ucyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL3V0aWwvb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQVNCdWlsZEFyZ3Mge1xuICBbeDogc3RyaW5nXTogdW5rbm93bjtcbiAgYmFzZURpcjogc3RyaW5nO1xuICBjb25maWc6IHN0cmluZztcbiAgd2F0OiBib29sZWFuO1xuICBvdXREaXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdGFyZ2V0OiBzdHJpbmc7XG4gIHZlcmJvc2U6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICBjbGk6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhc2MuQVBJT3B0aW9ucyA9IHt9LFxuICBjYWxsYmFjaz86IChhOiBhbnkpID0+IG51bWJlclxuKSB7XG4gIGxldCBhcmdzOiBBU0J1aWxkQXJncyA9IHlhcmdzXG4gICAgLnVzYWdlKFxuICAgICAgXCJCdWlsZCB0b29sIGZvciBBc3NlbWJseVNjcmlwdCBwcm9qZWN0cy5cXG5cXG5Vc2FnZTpcXG4gIGFzYiBbaW5wdXQgZmlsZV0gW29wdGlvbnNdIC0tIFthc2Mgb3B0aW9uc11cIlxuICAgIClcbiAgICAuZXhhbXBsZShcbiAgICAgIFwiYXNiXCIsXG4gICAgICBcIkJ1aWxkIHJlbGVhc2Ugb2YgJ2Fzc2VtYmx5L2luZGV4LnRzIHRvIGJ1aWxkL3JlbGVhc2UvcGFja2FnZU5hbWUud2FzbVwiXG4gICAgKVxuICAgIC5leGFtcGxlKFwiYXNiIC0tdGFyZ2V0IHJlbGVhc2VcIiwgXCJCdWlsZCBhIHJlbGVhc2UgYmluYXJ5XCIpXG4gICAgLmV4YW1wbGUoXCJhc2IgLS0gLS1tZWFzdXJlXCIsIFwiUGFzcyBhcmd1bWVudCB0byAnYXNjJ1wiKVxuICAgIC5vcHRpb24oXCJiYXNlRGlyXCIsIHtcbiAgICAgIGFsaWFzOiBcImRcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJCYXNlIGRpcmVjdG9yeSBvZiBwcm9qZWN0LlwiLFxuICAgICAgZGVmYXVsdDogXCIuXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwiY29uZmlnXCIsIHtcbiAgICAgIGFsaWFzOiBcImNcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGFzY29uZmlnIGZpbGVcIixcbiAgICAgIGRlZmF1bHQ6IFwiLi9hc2NvbmZpZy5qc29uXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwid2F0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk91dHB1dCB3YXQgZmlsZSB0byBvdXREaXJcIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgYm9vbGVhbjogdHJ1ZSxcbiAgICB9KVxuICAgIC5vcHRpb24oXCJvdXREaXJcIiwge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnRGlyZWN0b3J5IHRvIHBsYWNlIGJ1aWx0IGJpbmFyaWVzLiBEZWZhdWx0IFwiLi9idWlsZC88dGFyZ2V0Pi9cIicsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidGFyZ2V0XCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUYXJnZXQgZm9yIGNvbXBpbGF0aW9uXCIsXG4gICAgICBkZWZhdWx0OiBcInJlbGVhc2VcIixcbiAgICB9KVxuICAgIC5vcHRpb24oXCJ2ZXJib3NlXCIsIHtcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByaW50IG91dCBhcmd1bWVudHMgcGFzc2VkIHRvIGFzY1wiLFxuICAgIH0pXG4gICAgLnBhcnNlKGNsaSk7XG5cbiAgY29uc3QgYXNjQXJndiA9IGFyZ3NbXCJfXCJdIGFzIHN0cmluZ1tdO1xuICBjb25zdCBbYmFzZURpciwgY29uZmlnUGF0aF0gPSBnZXRTZXR1cChhcmdzKTtcbiAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKGNvbmZpZ1BhdGgpO1xuICBjb25zdCBvdXREaXIgPVxuICAgIGFyZ3Mub3V0RGlyIHx8IGNvbmZpZy5vdXREaXIgfHwgcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwiLi9idWlsZFwiKTtcbiAgaWYgKGNvbmZpZy53b3Jrc3BhY2VzKSB7XG4gICAgaWYgKCEoPGFueT5jb25maWcud29ya3NwYWNlcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24uIFNob3VsZCBiZSBhbiBhcnJheS5cIik7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICAgIGNvbnN0IHdvcmtzcGFjZXMgPSBjb25maWcud29ya3NwYWNlcyBhcyBzdHJpbmdbXTtcbiAgICBmb3IgKGxldCB3b3Jrc3BhY2Ugb2Ygd29ya3NwYWNlcykge1xuICAgICAgYXJncy5iYXNlRGlyID0gcGF0aC5qb2luKGJhc2VEaXIsIHdvcmtzcGFjZSk7XG4gICAgICBhcmdzLm91dERpciA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgb3V0RGlyKTtcbiAgICAgIGNvbXBpbGVQcm9qZWN0KGFyZ3MsIGFzY0FyZ3Yuc2xpY2UoMCksIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29tcGlsZVByb2plY3QoYXJncywgYXNjQXJndiwgb3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNldHVwKGFyZ3M6IEFTQnVpbGRBcmdzKTogW3N0cmluZywgc3RyaW5nXSB7XG4gIGxldCBiYXNlRGlyID0gYXJncy5iYXNlRGlyO1xuICBiYXNlRGlyID0gYmFzZURpciA9PSBcIi5cIiA/IHByb2Nlc3MuY3dkKCkgOiBiYXNlRGlyO1xuICBsZXQgY29uZmlnUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oYmFzZURpciwgYXJncy5jb25maWcpKTtcbiAgcmV0dXJuIFtiYXNlRGlyLCBjb25maWdQYXRoXTtcbn1cblxuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlnKGNvbmZpZ1BhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoY29uZmlnUGF0aCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIERFRkFVTFRfQ09ORklHO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNhZmVSZXF1aXJlKHBhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUocGF0aCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhc1RhcmdldChjb25maWc6IGFueSwgdGFyZ2V0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvbmZpZy50YXJnZXQgJiYgY29uZmlnLnRhcmdldFt0YXJnZXRdW3RhcmdldF07XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVQcm9qZWN0KFxuICBhcmdzOiBBU0J1aWxkQXJncyxcbiAgYXNjQXJndjogc3RyaW5nW10sXG4gIG9wdGlvbnM6IGFzYy5BUElPcHRpb25zLFxuICBjYj86IChhOiBhbnkpID0+IG51bWJlclxuKTogdm9pZCB7XG4gIGNvbnN0IFtiYXNlRGlyLCBjb25maWdQYXRoXSA9IGdldFNldHVwKGFyZ3MpO1xuICBsZXQgY29uZmlnOiBhbnkgPSBnZXRDb25maWcoY29uZmlnUGF0aCk7XG5cbiAgaWYgKGNvbmZpZyAhPT0gREVGQVVMVF9DT05GSUcpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWNvbmZpZ1wiLCBjb25maWdQYXRoKTtcbiAgfVxuXG5cbiAgY29uc3QgcGFja2FnZUpzb24gPSBzYWZlUmVxdWlyZShwYXRoLmpvaW4oYmFzZURpciwgXCJwYWNrYWdlLmpzb25cIikpO1xuICBjb25zdCBhc2NBcmdzID0gYXNjT3B0aW9ucy5wYXJzZShhc2NBcmd2LCBhc2Mub3B0aW9ucywgZmFsc2UpO1xuICBsZXQgZW50cnlGaWxlOiBzdHJpbmc7XG4gIHN3aXRjaCAoYXNjQXJncy5hcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiB7XG4gICAgICBlbnRyeUZpbGUgPSBwYXRoLmpvaW4oXG4gICAgICAgIGJhc2VEaXIsXG4gICAgICAgIGNvbmZpZy5lbnRyeSB8fCBwYXRoLmpvaW4oXCJhc3NlbWJseVwiLCBcImluZGV4LnRzXCIpXG4gICAgICApO1xuICAgICAgYXNjQXJndi51bnNoaWZ0KGVudHJ5RmlsZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSAxOiB7XG4gICAgICBlbnRyeUZpbGUgPSBhc2NBcmdzLmFyZ3VtZW50c1swXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IGNvbXBpbGUgdHdvIGVudHJ5IGZpbGVzIGF0IG9uY2UuXCIpO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghZnMuZXhpc3RzU3luYyhlbnRyeUZpbGUpKSB7XG4gICAgY29uc29sZS5sb2coYXJncyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbnRyeSBmaWxlICR7ZW50cnlGaWxlfSBkb2Vzbid0IGV4aXN0YCk7XG4gIH1cblxuICBsZXQgbmFtZTogc3RyaW5nO1xuICBpZiAoZW50cnlGaWxlLmVuZHNXaXRoKFwiaW5kZXgudHNcIikpIHtcbiAgICBpZiAocGFja2FnZUpzb24ubmFtZSkge1xuICAgICAgbmFtZSA9IHBhY2thZ2VKc29uLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lKHBhdGguYmFzZW5hbWUoYmFzZURpcikpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuYW1lID0gcGF0aC5iYXNlbmFtZShlbnRyeUZpbGUpLnJlcGxhY2UoXCIudHNcIiwgXCJcIik7XG4gIH1cblxuICBsZXQgdGFyZ2V0ID0gYXJncy50YXJnZXQ7XG4gIGlmICh0YXJnZXQgPT09IFwiZGVidWdcIiAmJiAhaGFzVGFyZ2V0KGNvbmZpZywgXCJkZWJ1Z1wiKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tZGVidWdcIik7XG4gIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBcInJlbGVhc2VcIiAmJiAhaGFzVGFyZ2V0KGNvbmZpZywgXCJyZWxlYXNlXCIpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1vcHRpbWl6ZUxldmVsXCIsIFwiM1wiKTtcbiAgICBhc2NBcmd2LnB1c2goXCItLXNocmlua0xldmVsXCIsIFwiM1wiKTtcbiAgfVxuXG4gIGlmICghYXNjQXJncy5vcHRpb25zPy50YXJnZXQpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLXRhcmdldFwiLCB0YXJnZXQpO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IGFzY0FyZ3Mub3B0aW9ucy50YXJnZXQgYXMgc3RyaW5nO1xuICB9XG5cbiAgbGV0IG91dERpciA9IGFyZ3Mub3V0RGlyID8gYXJncy5vdXREaXIgOiBjb25maWcub3V0RGlyIHx8IFwiLi9idWlsZFwiO1xuICBvdXREaXIgPSBwYXRoLmpvaW4oYmFzZURpciwgb3V0RGlyLCB0YXJnZXQpO1xuICBjb25zdCB3YXRGaWxlID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBwYXRoLmpvaW4ob3V0RGlyLCBuYW1lICsgXCIud2F0XCIpKTtcbiAgY29uc3Qgd2FzbUZpbGUgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXNtXCIpKTtcblxuICBpZiAoYXJncy53YXQgJiYgIShoYXNPdXRwdXQoYXNjQXJndiwgXCIud2F0XCIpIHx8IGNvbmZpZy5vcHRpb25zPy50ZXh0RmlsZSkpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLXRleHRGaWxlXCIsIHdhdEZpbGUpO1xuICB9XG4gIGlmIChcbiAgICBhcmdzLm91dERpciB8fFxuICAgICEoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhc21cIikgfHwgY29uZmlnLm9wdGlvbnM/LmJpbmFyeUZpbGUpXG4gICkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tYmluYXJ5RmlsZVwiLCB3YXNtRmlsZSk7XG4gIH1cblxuICBpZiAoYXJncy52ZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coW1wiYXNjXCIsIC4uLmFzY0FyZ3ZdLmpvaW4oXCIgXCIpKTtcbiAgfVxuICBhc2MubWFpbihhc2NBcmd2LCBvcHRpb25zLCBjYik7XG59XG5cbmZ1bmN0aW9uIGhhc091dHB1dChhc2NBcmd2OiBzdHJpbmdbXSwgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGFzY0FyZ3Yuc29tZSgocykgPT4gcy5lbmRzV2l0aChzdWZmaXgpKTtcbn1cbiJdfQ==