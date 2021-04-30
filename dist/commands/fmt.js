"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FmtCmd = void 0;
var path = __importStar(require("path"));
var eslintConfig_1 = require("./init/files/eslintConfig");
var interfaces_1 = require("./init/interfaces");
var chalk_1 = __importDefault(require("chalk"));
var packageJson_1 = require("./init/files/packageJson");
var eslint_1 = require("eslint");
// TODO:
// - Support more eslint options, like '--max-warnings`,
//   (Much of these can be ported from eslint's `cli.js`)
exports.FmtCmd = {
    command: "fmt [paths..]",
    describe: "This utility formats current module using eslint.",
    aliases: ["format", "lint"],
    builder: function (y) {
        return y
            .positional("paths", {
            description: "Paths to format",
            default: ["."],
        })
            .option("init", {
            description: "Generates recommended eslint config for AS Projects",
            boolean: true,
            group: "Initialisation:",
        })
            .option("lint", {
            alias: ["dry-run"],
            boolean: true,
            default: false,
            description: "Tries to fix problems without saving the changes to the file system",
            group: "Miscellaneous",
        })
            .onFinishCommand(function (code) { return process.exit(code); });
    },
    handler: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var retCode, files, engine, results, formatter, resultText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.init) {
                        console.log(initConfig(process.cwd()));
                        return [2 /*return*/, 0];
                    }
                    retCode = 0;
                    files = args.paths;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    engine = new eslint_1.ESLint({
                        extensions: ["ts"],
                        fix: true,
                    });
                    return [4 /*yield*/, engine.lintFiles(files)];
                case 2:
                    results = _a.sent();
                    if (!!args.dryRun) return [3 /*break*/, 4];
                    // fix files in place
                    return [4 /*yield*/, eslint_1.ESLint.outputFixes(results)];
                case 3:
                    // fix files in place
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, engine.loadFormatter("stylish")];
                case 5:
                    formatter = _a.sent();
                    resultText = formatter.format(results);
                    console.log(resultText);
                    console.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{bold.green Done!}"], ["{bold.green Done!}"]))));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{bold.bgRedBright ERROR:} Unexpected Error while running ESlint on given files."], ["{bold.bgRedBright ERROR:} Unexpected Error while running ESlint on given files."]))));
                    console.error(error_1);
                    retCode = 1;
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/, retCode];
            }
        });
    }); },
};
function initConfig(baseDir) {
    // write the config file
    var dir = path.resolve(baseDir);
    var eslintFile = new eslintConfig_1.EslintConfigFile();
    var msg = [];
    msg.push(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Writing {cyan ", "} ..."], ["Writing {cyan ", "} ..."])), eslintFile.getRelativePath(dir)));
    switch (eslintFile.write(dir)) {
        case interfaces_1.InitResult.EXISTS:
            msg.push(chalk_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["File {bold.cyan ", "} already exists."], ["File {bold.cyan ",
                "} already exists."])), eslintFile.getRelativePath(dir)));
            break;
        case interfaces_1.InitResult.CREATED:
            msg.push.apply(msg, [
                chalk_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{bold.green Created:} ", ""], ["{bold.green Created:} ", ""])), eslintFile.path),
                "",
                chalk_1.default(templateObject_6 || (templateObject_6 = __makeTemplateObject(["{bold.green Done!}"], ["{bold.green Done!}"]))),
                chalk_1.default(templateObject_7 || (templateObject_7 = __makeTemplateObject([""], [""]))),
                chalk_1.default(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Don't forget to install 'eslint' and it's plugins before you start:"], ["Don't forget to install 'eslint' and it's plugins before you start:"]))),
                "",
                chalk_1.default(templateObject_9 || (templateObject_9 = __makeTemplateObject(["  ", " eslint"], ["  ", " eslint"])), packageJson_1.getPmCommands().pkgInstall),
                chalk_1.default(templateObject_10 || (templateObject_10 = __makeTemplateObject(["  ", " @typescript-eslint/parser"], ["  ", " @typescript-eslint/parser"])), packageJson_1.getPmCommands().pkgInstall),
                chalk_1.default(templateObject_11 || (templateObject_11 = __makeTemplateObject(["  ", " @typescript-eslint/eslint-plugin"], ["  ",
                    " @typescript-eslint/eslint-plugin"])), packageJson_1.getPmCommands().pkgInstall),
                "",
                chalk_1.default(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Have a nice day !"], ["Have a nice day !"]))),
            ]);
            break;
        default:
            break;
    }
    return msg.join("\n");
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm10LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2ZtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlDQUE2QjtBQUM3QiwwREFBNkQ7QUFDN0QsZ0RBQStDO0FBQy9DLGdEQUEwQjtBQUMxQix3REFBeUQ7QUFDekQsaUNBQWdDO0FBRWhDLFFBQVE7QUFDUix3REFBd0Q7QUFDeEQseURBQXlEO0FBRTVDLFFBQUEsTUFBTSxHQUF3QjtJQUN6QyxPQUFPLEVBQUUsZUFBZTtJQUN4QixRQUFRLEVBQUUsbURBQW1EO0lBQzdELE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7SUFDM0IsT0FBTyxFQUFFLFVBQUMsQ0FBQztRQUNULE9BQUEsQ0FBQzthQUNFLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDbkIsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDZixDQUFDO2FBQ0QsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNkLFdBQVcsRUFBRSxxREFBcUQ7WUFDbEUsT0FBTyxFQUFFLElBQUk7WUFDYixLQUFLLEVBQUUsaUJBQWlCO1NBQ3pCLENBQUM7YUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2QsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQ1QscUVBQXFFO1lBQ3ZFLEtBQUssRUFBRSxlQUFlO1NBQ3ZCLENBQUM7YUFDRCxlQUFlLENBQUMsVUFBQyxJQUFZLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFsQixDQUFrQixDQUFDO0lBbEJ4RCxDQWtCd0Q7SUFFMUQsT0FBTyxFQUFFLFVBQU8sSUFBSTs7Ozs7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QU07UUFFUjtZQUNFLE1BQU07S0FDVDtJQUVELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBFc2xpbnRDb25maWdGaWxlIH0gZnJvbSBcIi4vaW5pdC9maWxlcy9lc2xpbnRDb25maWdcIjtcbmltcG9ydCB7IEluaXRSZXN1bHQgfSBmcm9tIFwiLi9pbml0L2ludGVyZmFjZXNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IGdldFBtQ29tbWFuZHMgfSBmcm9tIFwiLi9pbml0L2ZpbGVzL3BhY2thZ2VKc29uXCI7XG5pbXBvcnQgeyBFU0xpbnQgfSBmcm9tIFwiZXNsaW50XCI7XG5cbi8vIFRPRE86XG4vLyAtIFN1cHBvcnQgbW9yZSBlc2xpbnQgb3B0aW9ucywgbGlrZSAnLS1tYXgtd2FybmluZ3NgLFxuLy8gICAoTXVjaCBvZiB0aGVzZSBjYW4gYmUgcG9ydGVkIGZyb20gZXNsaW50J3MgYGNsaS5qc2ApXG5cbmV4cG9ydCBjb25zdCBGbXRDbWQ6IHlhcmdzLkNvbW1hbmRNb2R1bGUgPSB7XG4gIGNvbW1hbmQ6IFwiZm10IFtwYXRocy4uXVwiLFxuICBkZXNjcmliZTogXCJUaGlzIHV0aWxpdHkgZm9ybWF0cyBjdXJyZW50IG1vZHVsZSB1c2luZyBlc2xpbnQuXCIsXG4gIGFsaWFzZXM6IFtcImZvcm1hdFwiLCBcImxpbnRcIl0sXG4gIGJ1aWxkZXI6ICh5KSA9PlxuICAgIHlcbiAgICAgIC5wb3NpdGlvbmFsKFwicGF0aHNcIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJQYXRocyB0byBmb3JtYXRcIixcbiAgICAgICAgZGVmYXVsdDogW1wiLlwiXSxcbiAgICAgIH0pXG4gICAgICAub3B0aW9uKFwiaW5pdFwiLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlbmVyYXRlcyByZWNvbW1lbmRlZCBlc2xpbnQgY29uZmlnIGZvciBBUyBQcm9qZWN0c1wiLFxuICAgICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgICBncm91cDogXCJJbml0aWFsaXNhdGlvbjpcIixcbiAgICAgIH0pXG4gICAgICAub3B0aW9uKFwibGludFwiLCB7XG4gICAgICAgIGFsaWFzOiBbXCJkcnktcnVuXCJdLFxuICAgICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJUcmllcyB0byBmaXggcHJvYmxlbXMgd2l0aG91dCBzYXZpbmcgdGhlIGNoYW5nZXMgdG8gdGhlIGZpbGUgc3lzdGVtXCIsXG4gICAgICAgIGdyb3VwOiBcIk1pc2NlbGxhbmVvdXNcIixcbiAgICAgIH0pXG4gICAgICAub25GaW5pc2hDb21tYW5kKChjb2RlOiBudW1iZXIpID0+IHByb2Nlc3MuZXhpdChjb2RlKSksXG5cbiAgaGFuZGxlcjogYXN5bmMgKGFyZ3MpOiBQcm9taXNlPG51bWJlcj4gPT4ge1xuICAgIGlmIChhcmdzLmluaXQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGluaXRDb25maWcocHJvY2Vzcy5jd2QoKSkpO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IHJldENvZGUgPSAwO1xuICAgIGNvbnN0IGZpbGVzID0gYXJncy5wYXRocyBhcyBzdHJpbmdbXTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBjcmVhdGUgRVNMaW50IGVuZ2luZVxuICAgICAgY29uc3QgZW5naW5lID0gbmV3IEVTTGludCh7XG4gICAgICAgIGV4dGVuc2lvbnM6IFtcInRzXCJdLFxuICAgICAgICBmaXg6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIC8vIGdlbmVyYXRlIGxpbnQgcmVzdWx0c1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IGVuZ2luZS5saW50RmlsZXMoZmlsZXMpO1xuICAgICAgaWYgKCFhcmdzLmRyeVJ1bikge1xuICAgICAgICAvLyBmaXggZmlsZXMgaW4gcGxhY2VcbiAgICAgICAgYXdhaXQgRVNMaW50Lm91dHB1dEZpeGVzKHJlc3VsdHMpO1xuICAgICAgfVxuICAgICAgLy8gZm9ybWF0IHRoZSByZXN1bHRzXG4gICAgICBjb25zdCBmb3JtYXR0ZXIgPSBhd2FpdCBlbmdpbmUubG9hZEZvcm1hdHRlcihcInN0eWxpc2hcIik7XG4gICAgICBjb25zdCByZXN1bHRUZXh0ID0gZm9ybWF0dGVyLmZvcm1hdChyZXN1bHRzKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdFRleHQpO1xuICAgICAgY29uc29sZS5sb2coY2hhbGtge2JvbGQuZ3JlZW4gRG9uZSF9YCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGNoYWxrYHtib2xkLmJnUmVkQnJpZ2h0IEVSUk9SOn0gVW5leHBlY3RlZCBFcnJvciB3aGlsZSBydW5uaW5nIEVTbGludCBvbiBnaXZlbiBmaWxlcy5gXG4gICAgICApO1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICByZXRDb2RlID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHJldENvZGU7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBpbml0Q29uZmlnKGJhc2VEaXI6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIHdyaXRlIHRoZSBjb25maWcgZmlsZVxuICBjb25zdCBkaXIgPSBwYXRoLnJlc29sdmUoYmFzZURpcik7XG4gIGNvbnN0IGVzbGludEZpbGUgPSBuZXcgRXNsaW50Q29uZmlnRmlsZSgpO1xuICBjb25zdCBtc2cgPSBbXTtcblxuICBtc2cucHVzaChjaGFsa2BXcml0aW5nIHtjeWFuICR7ZXNsaW50RmlsZS5nZXRSZWxhdGl2ZVBhdGgoZGlyKX19IC4uLmApO1xuICBzd2l0Y2ggKGVzbGludEZpbGUud3JpdGUoZGlyKSkge1xuICAgIGNhc2UgSW5pdFJlc3VsdC5FWElTVFM6XG4gICAgICBtc2cucHVzaChcbiAgICAgICAgY2hhbGtgRmlsZSB7Ym9sZC5jeWFuICR7ZXNsaW50RmlsZS5nZXRSZWxhdGl2ZVBhdGgoXG4gICAgICAgICAgZGlyXG4gICAgICAgICl9fSBhbHJlYWR5IGV4aXN0cy5gXG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBJbml0UmVzdWx0LkNSRUFURUQ6XG4gICAgICBtc2cucHVzaChcbiAgICAgICAgLi4uW1xuICAgICAgICAgIGNoYWxrYHtib2xkLmdyZWVuIENyZWF0ZWQ6fSAke2VzbGludEZpbGUucGF0aH1gLFxuICAgICAgICAgIGBgLFxuICAgICAgICAgIGNoYWxrYHtib2xkLmdyZWVuIERvbmUhfWAsXG4gICAgICAgICAgY2hhbGtgYCxcbiAgICAgICAgICBjaGFsa2BEb24ndCBmb3JnZXQgdG8gaW5zdGFsbCAnZXNsaW50JyBhbmQgaXQncyBwbHVnaW5zIGJlZm9yZSB5b3Ugc3RhcnQ6YCxcbiAgICAgICAgICBgYCxcbiAgICAgICAgICBjaGFsa2AgICR7Z2V0UG1Db21tYW5kcygpLnBrZ0luc3RhbGx9IGVzbGludGAsXG4gICAgICAgICAgY2hhbGtgICAke2dldFBtQ29tbWFuZHMoKS5wa2dJbnN0YWxsfSBAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyYCxcbiAgICAgICAgICBjaGFsa2AgICR7XG4gICAgICAgICAgICBnZXRQbUNvbW1hbmRzKCkucGtnSW5zdGFsbFxuICAgICAgICAgIH0gQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5gLFxuICAgICAgICAgIGBgLFxuICAgICAgICAgIGNoYWxrYEhhdmUgYSBuaWNlIGRheSAhYCxcbiAgICAgICAgXVxuICAgICAgKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIG1zZy5qb2luKFwiXFxuXCIpO1xufVxuIl19