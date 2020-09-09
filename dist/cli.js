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
    if (args.wat && (!(hasOutput(ascArgv, ".wat") || ((_b = config.options) === null || _b === void 0 ? void 0 : _b.textFile)))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUErQjtBQUMvQix5Q0FBNkI7QUFDN0IsMERBQThDO0FBQzlDLDBFQUE4RDtBQUM5RCxxQ0FBeUI7QUFZekIsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QixJQUFJLElBQUksR0FBZ0IsS0FBSztTQUMxQixLQUFLLENBQ0osa0dBQWtHLENBQ25HO1NBQ0EsT0FBTyxDQUNOLEtBQUssRUFDTCx1RUFBdUUsQ0FDeEU7U0FDQSxPQUFPLENBQUMsc0JBQXNCLEVBQUUsd0JBQXdCLENBQUM7U0FDekQsT0FBTyxDQUFDLGtCQUFrQixFQUFFLHdCQUF3QixDQUFDO1NBQ3JELE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakIsS0FBSyxFQUFFLEdBQUc7UUFDVixJQUFJLEVBQUUsUUFBUTtRQUNkLFdBQVcsRUFBRSw0QkFBNEI7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDYixDQUFDO1NBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNoQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUM7U0FDRCxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2IsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztTQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxXQUFXLEVBQ1QsZ0VBQWdFO0tBQ25FLENBQUM7U0FDRCxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2hCLElBQUksRUFBRSxRQUFR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LElBQUksQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBhc2MgZnJvbSBcImFzc2VtYmx5c2NyaXB0L2NsaS9hc2NcIjtcbmltcG9ydCAqIGFzIGFzY09wdGlvbnMgZnJvbSBcImFzc2VtYmx5c2NyaXB0L2NsaS91dGlsL29wdGlvbnNcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFTQnVpbGRBcmdzIHtcbiAgW3g6IHN0cmluZ106IHVua25vd247XG4gIGJhc2VEaXI6IHN0cmluZztcbiAgY29uZmlnOiBzdHJpbmc7XG4gIHdhdDogYm9vbGVhbjtcbiAgb3V0RGlyOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHRhcmdldDogc3RyaW5nO1xuICB2ZXJib3NlOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFpbihcbiAgY2xpOiBzdHJpbmdbXSxcbiAgb3B0aW9uczogYXNjLkFQSU9wdGlvbnMgPSB7fSxcbiAgY2FsbGJhY2s/OiAoYTogYW55KSA9PiBudW1iZXJcbikge1xuICBsZXQgYXJnczogQVNCdWlsZEFyZ3MgPSB5YXJnc1xuICAgIC51c2FnZShcbiAgICAgIFwiQnVpbGQgdG9vbCBmb3IgQXNzZW1ibHlTY3JpcHQgcHJvamVjdHMuXFxuXFxuVXNhZ2U6XFxuICBhc2IgW2lucHV0IGZpbGVdIFtvcHRpb25zXSAtLSBbYXNjIG9wdGlvbnNdXCJcbiAgICApXG4gICAgLmV4YW1wbGUoXG4gICAgICBcImFzYlwiLFxuICAgICAgXCJCdWlsZCByZWxlYXNlIG9mICdhc3NlbWJseS9pbmRleC50cyB0byBidWlsZC9yZWxlYXNlL3BhY2thZ2VOYW1lLndhc21cIlxuICAgIClcbiAgICAuZXhhbXBsZShcImFzYiAtLXRhcmdldCByZWxlYXNlXCIsIFwiQnVpbGQgYSByZWxlYXNlIGJpbmFyeVwiKVxuICAgIC5leGFtcGxlKFwiYXNiIC0tIC0tbWVhc3VyZVwiLCBcIlBhc3MgYXJndW1lbnQgdG8gJ2FzYydcIilcbiAgICAub3B0aW9uKFwiYmFzZURpclwiLCB7XG4gICAgICBhbGlhczogXCJkXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiQmFzZSBkaXJlY3Rvcnkgb2YgcHJvamVjdC5cIixcbiAgICAgIGRlZmF1bHQ6IFwiLlwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcImNvbmZpZ1wiLCB7XG4gICAgICBhbGlhczogXCJjXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBhc2NvbmZpZyBmaWxlXCIsXG4gICAgICBkZWZhdWx0OiBcIi4vYXNjb25maWcuanNvblwiLFxuICAgIH0pXG4gICAgLm9wdGlvbihcIndhdFwiLCB7XG4gICAgICBkZXNjcmlwdGlvbjogXCJPdXRwdXQgd2F0IGZpbGUgdG8gb3V0RGlyXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgfSlcbiAgICAub3B0aW9uKFwib3V0RGlyXCIsIHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgJ0RpcmVjdG9yeSB0byBwbGFjZSBidWlsdCBiaW5hcmllcy4gRGVmYXVsdCBcIi4vYnVpbGQvPHRhcmdldD4vXCInLFxuICAgIH0pXG4gICAgLm9wdGlvbihcInRhcmdldFwiLCB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGFyZ2V0IGZvciBjb21waWxhdGlvblwiLFxuICAgICAgZGVmYXVsdDogXCJyZWxlYXNlXCIsXG4gICAgfSlcbiAgICAub3B0aW9uKFwidmVyYm9zZVwiLCB7XG4gICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmludCBvdXQgYXJndW1lbnRzIHBhc3NlZCB0byBhc2NcIixcbiAgICB9KVxuICAgIC5wYXJzZShjbGkpO1xuXG4gIGNvbnN0IGFzY0FyZ3YgPSBhcmdzW1wiX1wiXSBhcyBzdHJpbmdbXTtcbiAgY29uc3QgW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdID0gZ2V0U2V0dXAoYXJncyk7XG4gIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyhjb25maWdQYXRoKTtcbiAgY29uc3Qgb3V0RGlyID0gYXJncy5vdXREaXIgfHwgY29uZmlnLm91dERpciB8fCBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCIuL2J1aWxkXCIpO1xuICBpZiAoY29uZmlnLndvcmtzcGFjZXMpIHtcbiAgICBpZiAoICEoPGFueT5jb25maWcud29ya3NwYWNlcyBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24uIFNob3VsZCBiZSBhbiBhcnJheS5cIik7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICAgIGNvbnN0IHdvcmtzcGFjZXMgPSBjb25maWcud29ya3NwYWNlcyBhcyBzdHJpbmdbXTtcbiAgICBmb3IgKGxldCB3b3Jrc3BhY2Ugb2Ygd29ya3NwYWNlcykge1xuICAgICAgYXJncy5iYXNlRGlyID0gcGF0aC5qb2luKGJhc2VEaXIsIHdvcmtzcGFjZSk7XG4gICAgICBhcmdzLm91dERpciA9IHBhdGgucmVsYXRpdmUoYmFzZURpciwgb3V0RGlyKTtcbiAgICAgIGNvbXBpbGVQcm9qZWN0KGFyZ3MsIGFzY0FyZ3Yuc2xpY2UoMCksIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29tcGlsZVByb2plY3QoYXJncywgYXNjQXJndiwgb3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNldHVwKGFyZ3M6IEFTQnVpbGRBcmdzKTogW3N0cmluZywgc3RyaW5nXSB7XG4gIGxldCBiYXNlRGlyID0gYXJncy5iYXNlRGlyO1xuICBiYXNlRGlyID0gYmFzZURpciA9PSBcIi5cIiA/IHByb2Nlc3MuY3dkKCkgOiBiYXNlRGlyO1xuICBsZXQgY29uZmlnUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oYmFzZURpciwgYXJncy5jb25maWcpKTtcbiAgcmV0dXJuIFtiYXNlRGlyLCBjb25maWdQYXRoXTtcbn1cblxuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29uZmlnKGNvbmZpZ1BhdGg6IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoY29uZmlnUGF0aCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICByZXR1cm4gREVGQVVMVF9DT05GSUc7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FmZVJlcXVpcmUocGF0aDogc3RyaW5nKTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcmVxdWlyZShwYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZVByb2plY3QoXG4gIGFyZ3M6IEFTQnVpbGRBcmdzLFxuICBhc2NBcmd2OiBzdHJpbmdbXSxcbiAgb3B0aW9uczogYXNjLkFQSU9wdGlvbnMsXG4gIGNiPzogKGE6IGFueSkgPT4gbnVtYmVyXG4pOiB2b2lkIHtcbiAgY29uc3QgW2Jhc2VEaXIsIGNvbmZpZ1BhdGhdID0gZ2V0U2V0dXAoYXJncyk7XG4gIGxldCBjb25maWc6IGFueSA9IGdldENvbmZpZyhjb25maWdQYXRoKTtcblxuICBpZiAoY29uZmlnICE9PSBERUZBVUxUX0NPTkZJRykge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tY29uZmlnXCIsIGNvbmZpZ1BhdGgpO1xuICB9XG4gIFxuICBjb25zdCBwYWNrYWdlSnNvbiA9IHNhZmVSZXF1aXJlKHBhdGguam9pbihiYXNlRGlyLCBcInBhY2thZ2UuanNvblwiKSk7XG4gIGNvbnN0IGFzY0FyZ3MgPSBhc2NPcHRpb25zLnBhcnNlKGFzY0FyZ3YsIGFzYy5vcHRpb25zLCBmYWxzZSk7XG4gIGxldCBlbnRyeUZpbGU6IHN0cmluZztcbiAgc3dpdGNoIChhc2NBcmdzLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHtcbiAgICAgIGVudHJ5RmlsZSA9IHBhdGguam9pbihiYXNlRGlyLCBjb25maWcuZW50cnkgfHwgcGF0aC5qb2luKFwiYXNzZW1ibHlcIiwgXCJpbmRleC50c1wiKSk7XG4gICAgICBhc2NBcmd2LnVuc2hpZnQoZW50cnlGaWxlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIDE6IHtcbiAgICAgIGVudHJ5RmlsZSA9IGFzY0FyZ3MuYXJndW1lbnRzWzBdO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3QgY29tcGlsZSB0d28gZW50cnkgZmlsZXMgYXQgb25jZS5cIik7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGVudHJ5RmlsZSkpIHtcbiAgICBjb25zb2xlLmxvZyhhcmdzKVxuICAgIHRocm93IG5ldyBFcnJvcihgRW50cnkgZmlsZSAke2VudHJ5RmlsZX0gZG9lc24ndCBleGlzdGApO1xuICB9XG5cbiAgbGV0IG5hbWU6IHN0cmluZztcbiAgaWYgKGVudHJ5RmlsZS5lbmRzV2l0aChcImluZGV4LnRzXCIpKSB7XG4gICAgaWYgKHBhY2thZ2VKc29uLm5hbWUpIHtcbiAgICAgIG5hbWUgPSBwYWNrYWdlSnNvbi5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gcGF0aC5iYXNlbmFtZShwYXRoLmJhc2VuYW1lKGJhc2VEaXIpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbmFtZSA9IHBhdGguYmFzZW5hbWUoZW50cnlGaWxlKS5yZXBsYWNlKFwiLnRzXCIsIFwiXCIpO1xuICB9XG5cbiAgbGV0IHRhcmdldCA9IGFyZ3MudGFyZ2V0O1xuICBpZiAodGFyZ2V0ID09PSBcImRlYnVnXCIgJiYgIShjb25maWcudGFyZ2V0ICYmIGNvbmZpZy50YXJnZXRbdGFyZ2V0XS5kZWJ1ZykpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWRlYnVnXCIpO1xuICB9XG5cbiAgaWYgKCFhc2NBcmdzLm9wdGlvbnM/LnRhcmdldCkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGFyZ2V0XCIsIHRhcmdldCk7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0ID0gYXNjQXJncy5vcHRpb25zLnRhcmdldCBhcyBzdHJpbmc7XG4gIH1cblxuICBsZXQgb3V0RGlyID0gYXJncy5vdXREaXIgPyBhcmdzLm91dERpciA6IGNvbmZpZy5vdXREaXIgfHwgXCIuL2J1aWxkXCI7XG4gIG91dERpciA9IHBhdGguam9pbihiYXNlRGlyLCBvdXREaXIsIHRhcmdldCk7XG4gIGNvbnN0IHdhdEZpbGUgID0gcGF0aC5yZWxhdGl2ZShiYXNlRGlyLCBwYXRoLmpvaW4ob3V0RGlyLCBuYW1lICsgXCIud2F0XCIpKTtcbiAgY29uc3Qgd2FzbUZpbGUgPSBwYXRoLnJlbGF0aXZlKGJhc2VEaXIsIHBhdGguam9pbihvdXREaXIsIG5hbWUgKyBcIi53YXNtXCIpKTtcblxuICBpZiAoYXJncy53YXQgJiYgKCEoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhdFwiKSB8fCBjb25maWcub3B0aW9ucz8udGV4dEZpbGUpKSkge1xuICAgIGFzY0FyZ3YucHVzaChcIi0tdGV4dEZpbGVcIiwgd2F0RmlsZSk7XG4gIH1cbiAgaWYgKGFyZ3Mub3V0RGlyIHx8ICEoaGFzT3V0cHV0KGFzY0FyZ3YsIFwiLndhc21cIikgfHwgKGNvbmZpZy5vcHRpb25zPy5iaW5hcnlGaWxlKSkpIHtcbiAgICBhc2NBcmd2LnB1c2goXCItLWJpbmFyeUZpbGVcIiwgd2FzbUZpbGUpO1xuICB9XG5cbiAgaWYgKGFyZ3MudmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKFtcImFzY1wiLCAuLi5hc2NBcmd2XS5qb2luKFwiIFwiKSk7XG4gIH1cbiAgYXNjLm1haW4oYXNjQXJndiwgb3B0aW9ucywgY2IpO1xufVxuXG5cbmZ1bmN0aW9uIGhhc091dHB1dChhc2NBcmd2OiBzdHJpbmdbXSwgc3VmZml4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGFzY0FyZ3Yuc29tZSgocykgPT4gcy5lbmRzV2l0aChzdWZmaXgpKTtcbn0iXX0=