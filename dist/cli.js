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
    if (target === "debug" && !(config.target && config.target[target].debug)) {
        ascArgv.push("--debug");
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
    if (args.wat && (args.outDir && !(hasOutput(ascArgv, ".wat") || ((_b = config.options) === null || _b === void 0 ? void 0 : _b.textFile)))) {
        ascArgv.push("--textFile", watFile);
    }
    if (args.outDir || !(hasOutput(ascArgv, ".wasm") || ((_c = config.options) === null || _c === void 0 ? void 0 : _c.binaryFile))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQix5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFZekIsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QixJQUFJLElBQUksR0FBZ0IsS0FBSztTQUMxQixLQUFLLENBQ0osa0dBQWtHLENBQ25HO1NBQ0EsT0FBTyxDQUNOLEtBQUssRUFDTCx1RUFBdUUsQ0FDeEU7U0FDQSxPQUFPLENBQUMsc0JBQXNCLEVBQUUsd0JBQXdCLENBQUM7U0FDekQsT0FBTyxDQUFDLGtCQUFrQixFQUFFLHdCQUF3QixDQUFDO1NBQ3JELE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFR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SUFDbEQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO0FBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGFzYyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuaW1wb3J0ICogYXMgYXNjT3B0aW9ucyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL3V0aWwvb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQVNCdWlsZEFyZ3Mge1xuICBbeDogc3RyaW5nXTogdW5rbm93bjtcbiAgYmFzZURpcjogc3RyaW5nO1xuICBjb25maWc6IHN0cmluZztcbiAgd2F0OiBib29sZWFuO1xuICBvdXREaXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgdGFyZ2V0OiBzdHJpbmc7XG4gIHZlcmJvc2U6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICBjbGk6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhc2MuQVBJT3B0aW9ucyA9IHt9LFxuICBjYWxsYmFjaz86IChhOiBhbnkpID0+IG51bWJlclxuKSB7XG4gIGxldCBhcmdzOiBBU0J1aWxkQXJncyA9IHlhcmdzXG4gICAgLnVzYWdlKFxuICAgICAgXCJCdWlsZCB0b29sIGZvciBBc3NlbWJseVNjcmlwdCBwcm9qZWN0cy5cXG5cXG5Vc2FnZTpcXG4gIGFzYiBbaW5wdXQgZmlsZV0gW29wdGlvbnNdIC0tIFthc2Mgb3B0aW9uc11cIlxuICAgIClcbiAgICAuZXhhbXBsZShcbiAgICAgIFwiYXNiXCIsXG4gICAgICBcIkJ1aWxkIHJlbGVhc2Ugb2YgJ2Fzc2VtYmx5L2luZGV4LnRzIHRvIGJ1aWxkL3JlbGVhc2UvcGFja2FnZU5hbWUud2FzbVwiXG4gICAgKVxuICAgIC5leGFtcGxlKFwiYXNiIC0tdGFyZ2V0IHJlbGVhc2VcIiwgXCJCdWlsZCBhIHJlbGVhc2UgYmluYXJ5XCIpXG4gICAgLmV4YW1wbGUoXCJhc2IgLS0gLS1tZWFzdXJlXCIsIFwiUGFzcyBhcmd1bWVudCB0byAnYXNjJ1wiKVxuICAgIC5vcHRpb24oXCJiYXNlRGlyXCIsIHtcbiAgICAgIGFsaWFzOiBcImRcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJCYXNlIGRpcmVjdG9yeSBvZiBwcm9qZWN0LlwiLFxuICAgICAgZGVmYXVsdDogXCIuXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwiY29uZmlnXCIsIHtcbiAgICAgIGFsaWFzOiBcImNcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQYXRoIHRvIGFzY29uZmlnIGZpbGVcIixcbiAgICAgIGRlZmF1bHQ6IFwiLi9hc2NvbmZpZy5qc29uXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwid2F0XCIsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk91dHB1dCB3YXQgZmlsZSB0byBvdXREaXJcIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgYm9vbGVhbjogdHJ1ZSxcbiAgICB9KVxuICAgIC5vcHRpb24oXCJvdXREaXJcIiwge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnRGlyZWN0b3J5IHRvIHBsYWNlIGJ1aWx0IGJpbmFyaWVzLiBEZWZhdWx0IFwiLi9idWlsZC88dGFyZ2V0Pi9cIicsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidGFyZ2V0XCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUYXJnZXQgZm9yIGNvbXBpbGF0aW9uXCIsXG4gICAgICBkZWZhdWx0OiBcInJlbGVhc2VcIixcbiAgICB9KVxuICAgIC5vcHRpb24oXCJ2ZXJib3NlXCIsIHtcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByaW50IG91dCBhcmd1bWVudHMgcGFzc2VkIHRvIGFzY1wiLFxuICAgIH0pXG4gICAgLnBhcnNlKGNsaSk7XG5cbiAgY29uc3QgYXNjQXJndiA9IGFyZ3NbXCJfXCJdIGFzIHN0cmluZ1tdO1xuICBjb25zdCBbYmFzZURpciwgY29uZmlnUGF0aF0gPSBnZXRTZXR1cChhcmdzKTtcbiAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKGNvbmZpZ1BhdGgpO1xuICBjb25zdCBvdXREaXIgPSBhcmdzLm91dERpciB8fCBjb25maWcub3V0RGlyIHx8IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcIi4vYnVpbGRcIik7XG4gIGlmIChjb25maWcud29ya3NwYWNlcykge1xuICAgIGlmICggISg8YW55PmNvbmZpZy53b3Jrc3BhY2VzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbi4gU2hvdWxkIGJlIGFuIGFycmF5LlwiKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG4gICAgY29uc3Qgd29ya3NwYWNlcyA9IGNvbmZpZy53b3Jrc3BhY2VzIGFzIHN0cmluZ1tdO1xuICAgIGZvciAobGV0IHdvcmtzcGFjZSBvZiB3b3Jrc3BhY2VzKSB7XG4gICAgICBhcmdzLmJhc2VEaXIgPSBwYXRoLmpvaW4oYmFzZURpciwgd29ya3NwYWNlKTtcbiAgICAgIGFyZ3Mub3V0RGlyID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBvdXREaXIpO1xuICAgICAgY29tcGlsZVByb2plY3QoYXJncywgYXNjQXJndi5zbGljZSgwKSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb21waWxlUHJvamVjdChhcmdzLCBhc2NBcmd2LCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2V0dXAoYXJnczogQVNCdWlsZEFyZ3MpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgbGV0IGJhc2VEaXIgPSBhcmdzLmJhc2VEaXI7XG4gIGJhc2VEaXIgPSBiYXNlRGlyID09IFwiLlwiID8gcHJvY2Vzcy5jd2QoKSA6IGJhc2VEaXI7XG4gIGxldCBjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihiYXNlRGlyLCBhcmdzLmNvbmZpZykpO1xuICByZXR1cm4gW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdO1xufVxuXG5jb25zdCBERUZBVUxUX0NPTkZJRyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRDb25maWcoY29uZmlnUGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShjb25maWdQYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHJldHVybiBERUZBVUxUX0NPTkZJRztcbiAgfVxufVxuXG5mdW5jdGlvbiBzYWZlUmVxdWlyZShwYXRoOiBzdHJpbmcpOiBhbnkge1xuICB0cnkge1xuICAgIHJldHVybiByZXF1aXJlKHBhdGgpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlUHJvamVjdChcbiAgYXJnczogQVNCdWlsZEFyZ3MsXG4gIGFzY0FyZ3Y6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhc2MuQVBJT3B0aW9ucyxcbiAgY2I/OiAoYTogYW55KSA9PiBudW1iZXJcbik6IHZvaWQge1xuICBjb25zdCBbYmFzZURpciwgY29uZmlnUGF0aF0gPSBnZXRTZXR1cChhcmdzKTtcbiAgbGV0IGNvbmZpZzogYW55ID0gZ2V0Q29uZmlnKGNvbmZpZ1BhdGgpO1xuXG4gIGlmIChjb25maWcgIT09IERFRkFVTFRfQ09ORklHKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS1jb25maWdcIiwgY29uZmlnUGF0aCk7XG4gIH1cbiAgXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gc2FmZVJlcXVpcmUocGF0aC5qb2luKGJhc2VEaXIsIFwicGFja2FnZS5qc29uXCIpKTtcbiAgY29uc3QgYXNjQXJncyA9IGFzY09wdGlvbnMucGFyc2UoYXNjQXJndiwgYXNjLm9wdGlvbnMsIGZhbHNlKTtcbiAgbGV0IGVudHJ5RmlsZTogc3RyaW5nO1xuICBzd2l0Y2ggKGFzY0FyZ3MuYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDoge1xuICAgICAgZW50cnlGaWxlID0gcGF0aC5qb2luKGJhc2VEaXIsIGNvbmZpZy5lbnRyeSB8fCBwYXRoLmpvaW4oXCJhc3NlbWJseVwiLCBcImluZGV4LnRzXCIpKTtcbiAgICAgIGFzY0FyZ3YudW5zaGlmdChlbnRyeUZpbGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgMToge1xuICAgICAgZW50cnlGaWxlID0gYXNjQXJncy5hcmd1bWVudHNbMF07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBjb21waWxlIHR3byBlbnRyeSBmaWxlcyBhdCBvbmNlLlwiKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWZzLmV4aXN0c1N5bmMoZW50cnlGaWxlKSkge1xuICAgIGNvbnNvbGUubG9nKGFyZ3MpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbnRyeSBmaWxlICR7ZW50cnlGaWxlfSBkb2Vzbid0IGV4aXN0YCk7XG4gIH1cblxuICBsZXQgbmFtZTogc3RyaW5nO1xuICBpZiAoZW50cnlGaWxlLmVuZHNXaXRoKFwiaW5kZXgudHNcIikpIHtcbiAgICBpZiAocGFja2FnZUpzb24ubmFtZSkge1xuICAgICAgbmFtZSA9IHBhY2thZ2VKc29uLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBwYXRoLmJhc2VuYW1lKHBhdGguYmFzZW5hbWUoYmFzZURpcikpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuYW1lID0gcGF0aC5iYXNlbmFtZShlbnRyeUZpbGUpLnJlcGxhY2UoXCIudHNcIiwgXCJcIik7XG4gIH1cblxuICBsZXQgdGFyZ2V0ID0gYXJncy50YXJnZXQ7XG4gIGlmICh0YXJnZXQgPT09IFwiZGVidWdcIiAmJiAhKGNvbmZpZy50YXJnZXQgJiYgY29uZmlnLnRhcmdldFt0YXJnZXRdLmRlYnVnKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tZGVidWdcIik7XG4gIH1cblxuICBpZiAoIWFzY0FyZ3Mub3B0aW9ucz8udGFyZ2V0KSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS10YXJnZXRcIiwgdGFyZ2V0KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSBhc2NBcmdzLm9wdGlvbnMudGFyZ2V0IGFzIHN0cmluZztcbiAgfVxuXG4gIGxldCBvdXREaXIgPSBhcmdzLm91dERpciA/IGFyZ3Mub3V0RGlyIDogY29uZmlnLm91dERpciB8fCBcIi4vYnVpbGRcIjtcbiAgb3V0RGlyID0gcGF0aC5qb2luKGJhc2VEaXIsIG91dERpciwgdGFyZ2V0KTtcbiAgY29uc3Qgd2F0RmlsZSAgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXRcIikpO1xuICBjb25zdCB3YXNtRmlsZSA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgcGF0aC5qb2luKG91dERpciwgbmFtZSArIFwiLndhc21cIikpO1xuXG4gIGlmIChhcmdzLndhdCAmJiAoYXJncy5vdXREaXIgJiYgIShoYXNPdXRwdXQoYXNjQXJndiwgXCIud2F0XCIpIHx8IGNvbmZpZy5vcHRpb25zPy50ZXh0RmlsZSkpKSB7XG4gICAgYXNjQXJndi5wdXNoKFwiLS10ZXh0RmlsZVwiLCB3YXRGaWxlKTtcbiAgfVxuICBpZiAoYXJncy5vdXREaXIgfHwgIShoYXNPdXRwdXQoYXNjQXJndiwgXCIud2FzbVwiKSB8fCAoY29uZmlnLm9wdGlvbnM/LmJpbmFyeUZpbGUpKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tYmluYXJ5RmlsZVwiLCB3YXNtRmlsZSk7XG4gIH1cblxuICBpZiAoYXJncy52ZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coW1wiYXNjXCIsIC4uLmFzY0FyZ3ZdLmpvaW4oXCIgXCIpKTtcbiAgfVxuICBhc2MubWFpbihhc2NBcmd2LCBvcHRpb25zLCBjYik7XG59XG5cblxuZnVuY3Rpb24gaGFzT3V0cHV0KGFzY0FyZ3Y6IHN0cmluZ1tdLCBzdWZmaXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gYXNjQXJndi5zb21lKChzKSA9PiBzLmVuZHNXaXRoKHN1ZmZpeCkpO1xufSJdfQ==