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
// - Print proper format results instead of just "Done"
// - Support more eslint options, like '--max-warnings`,
//   '--dry-run', 'quiet', etc.
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
            .onFinishCommand(function (code) { return process.exit(code); });
    },
    handler: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var retCode, files, engine, results, error_1;
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
                    _a.trys.push([1, 4, , 5]);
                    engine = new eslint_1.ESLint({
                        extensions: ["ts"],
                        fix: true,
                    });
                    return [4 /*yield*/, engine.lintFiles(files)];
                case 2:
                    results = _a.sent();
                    // fix files in place
                    return [4 /*yield*/, eslint_1.ESLint.outputFixes(results)];
                case 3:
                    // fix files in place
                    _a.sent();
                    console.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{bold.green Done!}"], ["{bold.green Done!}"]))));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{bold.bgRedBright ERROR:} Unexpected Error while running ESlint on given files."], ["{bold.bgRedBright ERROR:} Unexpected Error while running ESlint on given files."]))));
                    console.error(error_1);
                    retCode = 1;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, retCode];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm10LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2ZtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlDQUE2QjtBQUM3QiwwREFBNkQ7QUFDN0QsZ0RBQStDO0FBQy9DLGdEQUEwQjtBQUMxQix3REFBeUQ7QUFDekQsaUNBQWdDO0FBRWhDLFFBQVE7QUFDUix1REFBdUQ7QUFDdkQsd0RBQXdEO0FBQ3hELCtCQUErQjtBQUMvQix5REFBeUQ7QUFFNUMsUUFBQSxNQUFNLEdBQXdCO0lBQ3pDLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLFFBQVEsRUFBRSxtREFBbUQ7SUFDN0QsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztJQUMzQixPQUFPLEVBQUUsVUFBQyxDQUFDO1FBQ1QsT0FBQSxDQUFDO2FBQ0UsVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUNuQixXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNmLENBQUM7YUFDRCxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2QsV0FBVyxFQUFFLHFEQUFxRDtZQUNsRSxPQUFPLEVBQUUsSUFBSTtZQUNiLEtBQUssRUFBRSxpQkFBaUI7U0FDekIsQ0FBQzthQUNELGVBQWUsQ0FBQyxVQUFDLElBQVksSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQWxCLENBQWtCLENBQUM7SUFWeEQsQ0FVd0Q7SUFFMUQsT0FBTyxFQUFFLFVBQU8sSUFBSTs7Ozs7b0JBQ2xCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxzQkFBTyxDQUFDLEVBQUM7cUJBQ1Y7b0JBRUcsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDVixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQWlCLENBQUM7Ozs7b0JBSTdCLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQzt3QkFDeEIsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO3dCQUNsQixHQUFHLEVBQUUsSUFBSTtxQkFDVixDQUFDLENBQUM7b0JBR2EscUJBQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQXZDLE9BQU8sR0FBRyxTQUE2QjtvQkFFN0MscUJBQXFCO29CQUNyQixxQkFBTSxlQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFBOztvQkFEakMscUJBQXFCO29CQUNyQixTQUFpQyxDQUFDO29CQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssdUZBQUEsb0JBQW9CLEtBQUMsQ0FBQzs7OztvQkFFdkMsT0FBTyxDQUFDLEtBQUssQ0FDWCxlQUFLLG9KQUFBLGlGQUFpRixLQUN2RixDQUFDO29CQUNGLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBSyxDQUFDLENBQUM7b0JBQ3JCLE9BQU8sR0FBRyxDQUFDLENBQUM7O3dCQUVkLHNCQUFPLE9BQU8sRUFBQzs7O1NBQ2hCO0NBQ0YsQ0FBQztBQUVGLFNBQVMsVUFBVSxDQUFDLE9BQWU7SUFDakMsd0JBQXdCO0lBQ3hCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsSUFBTSxVQUFVLEdBQUcsSUFBSSwrQkFBZ0IsRUFBRSxDQUFDO0lBQzFDLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUVmLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBSyw0RkFBQSxnQkFBaUIsRUFBK0IsT0FBTyxLQUF0QyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFRLENBQUM7SUFDdkUsUUFBUSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLEtBQUssdUJBQVUsQ0FBQyxNQUFNO1lBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQ04sZUFBSywwR0FBQSxrQkFBbUI7Z0JBRXZCLG1CQUFtQixLQUZJLFVBQVUsQ0FBQyxlQUFlLENBQ2hELEdBQUcsQ0FDSixFQUNGLENBQUM7WUFDRixNQUFNO1FBQ1IsS0FBSyx1QkFBVSxDQUFDLE9BQU87WUFDckIsR0FBRyxDQUFDLElBQUksT0FBUixHQUFHLEVBQ0U7Z0JBQ0QsZUFBSywrRkFBQSx3QkFBeUIsRUFBZSxFQUFFLEtBQWpCLFVBQVUsQ0FBQyxJQUFJO2dCQUM3QyxFQUFFO2dCQUNGLGVBQUssdUZBQUEsb0JBQW9CO2dCQUN6QixlQUFLLHFFQUFBLEVBQUU7Z0JBQ1AsZUFBSyx3SUFBQSxxRUFBcUU7Z0JBQzFFLEVBQUU7Z0JBQ0YsZUFBSyxrRkFBQSxJQUFLLEVBQTBCLFNBQVMsS0FBbkMsMkJBQWEsRUFBRSxDQUFDLFVBQVU7Z0JBQ3BDLGVBQUssdUdBQUEsSUFBSyxFQUEwQiw0QkFBNEIsS0FBdEQsMkJBQWEsRUFBRSxDQUFDLFVBQVU7Z0JBQ3BDLGVBQUssOEdBQUEsSUFBSztvQkFFVixtQ0FBbUMsS0FEakMsMkJBQWEsRUFBRSxDQUFDLFVBQVU7Z0JBRTVCLEVBQUU7Z0JBQ0YsZUFBSyx3RkFBQSxtQkFBbUI7YUFDekIsRUFDRDtZQUNGLE1BQU07UUFFUjtZQUNFLE1BQU07S0FDVDtJQUVELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBFc2xpbnRDb25maWdGaWxlIH0gZnJvbSBcIi4vaW5pdC9maWxlcy9lc2xpbnRDb25maWdcIjtcbmltcG9ydCB7IEluaXRSZXN1bHQgfSBmcm9tIFwiLi9pbml0L2ludGVyZmFjZXNcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IGdldFBtQ29tbWFuZHMgfSBmcm9tIFwiLi9pbml0L2ZpbGVzL3BhY2thZ2VKc29uXCI7XG5pbXBvcnQgeyBFU0xpbnQgfSBmcm9tIFwiZXNsaW50XCI7XG5cbi8vIFRPRE86XG4vLyAtIFByaW50IHByb3BlciBmb3JtYXQgcmVzdWx0cyBpbnN0ZWFkIG9mIGp1c3QgXCJEb25lXCJcbi8vIC0gU3VwcG9ydCBtb3JlIGVzbGludCBvcHRpb25zLCBsaWtlICctLW1heC13YXJuaW5nc2AsXG4vLyAgICctLWRyeS1ydW4nLCAncXVpZXQnLCBldGMuXG4vLyAgIChNdWNoIG9mIHRoZXNlIGNhbiBiZSBwb3J0ZWQgZnJvbSBlc2xpbnQncyBgY2xpLmpzYClcblxuZXhwb3J0IGNvbnN0IEZtdENtZDogeWFyZ3MuQ29tbWFuZE1vZHVsZSA9IHtcbiAgY29tbWFuZDogXCJmbXQgW3BhdGhzLi5dXCIsXG4gIGRlc2NyaWJlOiBcIlRoaXMgdXRpbGl0eSBmb3JtYXRzIGN1cnJlbnQgbW9kdWxlIHVzaW5nIGVzbGludC5cIixcbiAgYWxpYXNlczogW1wiZm9ybWF0XCIsIFwibGludFwiXSxcbiAgYnVpbGRlcjogKHkpID0+XG4gICAgeVxuICAgICAgLnBvc2l0aW9uYWwoXCJwYXRoc1wiLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGhzIHRvIGZvcm1hdFwiLFxuICAgICAgICBkZWZhdWx0OiBbXCIuXCJdLFxuICAgICAgfSlcbiAgICAgIC5vcHRpb24oXCJpbml0XCIsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiR2VuZXJhdGVzIHJlY29tbWVuZGVkIGVzbGludCBjb25maWcgZm9yIEFTIFByb2plY3RzXCIsXG4gICAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgICAgIGdyb3VwOiBcIkluaXRpYWxpc2F0aW9uOlwiLFxuICAgICAgfSlcbiAgICAgIC5vbkZpbmlzaENvbW1hbmQoKGNvZGU6IG51bWJlcikgPT4gcHJvY2Vzcy5leGl0KGNvZGUpKSxcblxuICBoYW5kbGVyOiBhc3luYyAoYXJncyk6IFByb21pc2U8bnVtYmVyPiA9PiB7XG4gICAgaWYgKGFyZ3MuaW5pdCkge1xuICAgICAgY29uc29sZS5sb2coaW5pdENvbmZpZyhwcm9jZXNzLmN3ZCgpKSk7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBsZXQgcmV0Q29kZSA9IDA7XG4gICAgY29uc3QgZmlsZXMgPSBhcmdzLnBhdGhzIGFzIHN0cmluZ1tdO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIGNyZWF0ZSBFU0xpbnQgZW5naW5lXG4gICAgICBjb25zdCBlbmdpbmUgPSBuZXcgRVNMaW50KHtcbiAgICAgICAgZXh0ZW5zaW9uczogW1widHNcIl0sXG4gICAgICAgIGZpeDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBnZW5lcmF0ZSBsaW50IHJlc3VsdHNcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBlbmdpbmUubGludEZpbGVzKGZpbGVzKTtcblxuICAgICAgLy8gZml4IGZpbGVzIGluIHBsYWNlXG4gICAgICBhd2FpdCBFU0xpbnQub3V0cHV0Rml4ZXMocmVzdWx0cyk7XG4gICAgICBjb25zb2xlLmxvZyhjaGFsa2B7Ym9sZC5ncmVlbiBEb25lIX1gKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgY2hhbGtge2JvbGQuYmdSZWRCcmlnaHQgRVJST1I6fSBVbmV4cGVjdGVkIEVycm9yIHdoaWxlIHJ1bm5pbmcgRVNsaW50IG9uIGdpdmVuIGZpbGVzLmBcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIHJldENvZGUgPSAxO1xuICAgIH1cbiAgICByZXR1cm4gcmV0Q29kZTtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGluaXRDb25maWcoYmFzZURpcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gd3JpdGUgdGhlIGNvbmZpZyBmaWxlXG4gIGNvbnN0IGRpciA9IHBhdGgucmVzb2x2ZShiYXNlRGlyKTtcbiAgY29uc3QgZXNsaW50RmlsZSA9IG5ldyBFc2xpbnRDb25maWdGaWxlKCk7XG4gIGNvbnN0IG1zZyA9IFtdO1xuXG4gIG1zZy5wdXNoKGNoYWxrYFdyaXRpbmcge2N5YW4gJHtlc2xpbnRGaWxlLmdldFJlbGF0aXZlUGF0aChkaXIpfX0gLi4uYCk7XG4gIHN3aXRjaCAoZXNsaW50RmlsZS53cml0ZShkaXIpKSB7XG4gICAgY2FzZSBJbml0UmVzdWx0LkVYSVNUUzpcbiAgICAgIG1zZy5wdXNoKFxuICAgICAgICBjaGFsa2BGaWxlIHtib2xkLmN5YW4gJHtlc2xpbnRGaWxlLmdldFJlbGF0aXZlUGF0aChcbiAgICAgICAgICBkaXJcbiAgICAgICAgKX19IGFscmVhZHkgZXhpc3RzLmBcbiAgICAgICk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIEluaXRSZXN1bHQuQ1JFQVRFRDpcbiAgICAgIG1zZy5wdXNoKFxuICAgICAgICAuLi5bXG4gICAgICAgICAgY2hhbGtge2JvbGQuZ3JlZW4gQ3JlYXRlZDp9ICR7ZXNsaW50RmlsZS5wYXRofWAsXG4gICAgICAgICAgYGAsXG4gICAgICAgICAgY2hhbGtge2JvbGQuZ3JlZW4gRG9uZSF9YCxcbiAgICAgICAgICBjaGFsa2BgLFxuICAgICAgICAgIGNoYWxrYERvbid0IGZvcmdldCB0byBpbnN0YWxsICdlc2xpbnQnIGFuZCBpdCdzIHBsdWdpbnMgYmVmb3JlIHlvdSBzdGFydDpgLFxuICAgICAgICAgIGBgLFxuICAgICAgICAgIGNoYWxrYCAgJHtnZXRQbUNvbW1hbmRzKCkucGtnSW5zdGFsbH0gZXNsaW50YCxcbiAgICAgICAgICBjaGFsa2AgICR7Z2V0UG1Db21tYW5kcygpLnBrZ0luc3RhbGx9IEB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJgLFxuICAgICAgICAgIGNoYWxrYCAgJHtcbiAgICAgICAgICAgIGdldFBtQ29tbWFuZHMoKS5wa2dJbnN0YWxsXG4gICAgICAgICAgfSBAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpbmAsXG4gICAgICAgICAgYGAsXG4gICAgICAgICAgY2hhbGtgSGF2ZSBhIG5pY2UgZGF5ICFgLFxuICAgICAgICBdXG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgICBcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gbXNnLmpvaW4oXCJcXG5cIik7XG59XG4iXX0=