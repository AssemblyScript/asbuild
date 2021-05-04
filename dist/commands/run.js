"use strict";
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
exports.RunCmd = void 0;
var fs_1 = __importDefault(require("fs"));
var wasi_1 = require("wasi");
var runCmdUsage = "asb run\nRun a WASI binary\n\nUSAGE:\n    $0 run [options] [binary path] -- [binary options]";
exports.RunCmd = {
    command: "run <binary>",
    describe: "Run as-pect tests",
    builder: function (y) {
        return y.usage(runCmdUsage)
            .positional("binary", {
            describe: "path to Wasm binary",
            type: "string",
        })
            .option("preopen", {
            alias: ["p"],
            default: process.cwd(),
            boolean: false,
            description: "comma sperated list of directories to open.",
        });
    },
    handler: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var wasiArgs, wasi, importObject, wasm, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wasiArgs = args["_"].slice(1);
                    wasi = new wasi_1.WASI({
                        args: wasiArgs,
                        env: process.env,
                        preopens: {
                            "/": args.preopen,
                        }
                    });
                    importObject = { wasi_snapshot_preview1: wasi.wasiImport };
                    return [4 /*yield*/, WebAssembly.compile(fs_1.default.readFileSync(args.binary))];
                case 1:
                    wasm = _a.sent();
                    return [4 /*yield*/, WebAssembly.instantiate(wasm, importObject)];
                case 2:
                    instance = _a.sent();
                    wasi.start(instance);
                    return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3J1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBb0I7QUFDcEIsNkJBQTRCO0FBRzVCLElBQU0sV0FBVyxHQUFHLDhGQUltQyxDQUFDO0FBRTNDLFFBQUEsTUFBTSxHQUF3QjtJQUN6QyxPQUFPLEVBQUUsY0FBYztJQUN2QixRQUFRLEVBQUUsbUJBQW1CO0lBQzdCLE9BQU8sRUFBRSxVQUFDLENBQUM7UUFDVCxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQ25CLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDcEIsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixJQUFJLEVBQUUsUUFBUTtTQUNmLENBQUM7YUFDQSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNaLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLDZDQUE2QztTQUMzRCxDQUFDO0lBVkYsQ0FVRTtJQUNKLE9BQU8sRUFBRSxVQUFPLElBQUk7Ozs7O29CQUNaLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5QixJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUM7d0JBQ3BCLElBQUksRUFBRSxRQUFRO3dCQUNkLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRzt3QkFDaEIsUUFBUSxFQUFFOzRCQUNSLEdBQUcsRUFBVyxJQUFJLENBQUMsT0FBTzt5QkFDM0I7cUJBQ0YsQ0FBQyxDQUFDO29CQUNHLFlBQVksR0FBRyxFQUFFLHNCQUFzQixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFFcEQscUJBQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFnQixDQUFDLENBQUMsRUFBQTs7b0JBQXhFLElBQUksR0FBRyxTQUFpRTtvQkFDN0QscUJBQU0sV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUE7O29CQUE1RCxRQUFRLEdBQUcsU0FBaUQ7b0JBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7U0FDdEI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgV0FTSSB9IGZyb20gJ3dhc2knO1xuXG5cbmNvbnN0IHJ1bkNtZFVzYWdlID0gYGFzYiBydW5cblJ1biBhIFdBU0kgYmluYXJ5XG5cblVTQUdFOlxuICAgICQwIHJ1biBbb3B0aW9uc10gW2JpbmFyeSBwYXRoXSAtLSBbYmluYXJ5IG9wdGlvbnNdYDtcblxuZXhwb3J0IGNvbnN0IFJ1bkNtZDogeWFyZ3MuQ29tbWFuZE1vZHVsZSA9IHtcbiAgY29tbWFuZDogXCJydW4gPGJpbmFyeT5cIixcbiAgZGVzY3JpYmU6IFwiUnVuIGFzLXBlY3QgdGVzdHNcIixcbiAgYnVpbGRlcjogKHkpID0+XG4gICAgeS51c2FnZShydW5DbWRVc2FnZSlcbiAgICAucG9zaXRpb25hbChcImJpbmFyeVwiLCB7XG4gICAgICBkZXNjcmliZTogXCJwYXRoIHRvIFdhc20gYmluYXJ5XCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgIH0pXG4gICAgIC5vcHRpb24oXCJwcmVvcGVuXCIsIHtcbiAgICAgIGFsaWFzOiBbXCJwXCJdLFxuICAgICAgZGVmYXVsdDogcHJvY2Vzcy5jd2QoKSxcbiAgICAgIGJvb2xlYW46IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IFwiY29tbWEgc3BlcmF0ZWQgbGlzdCBvZiBkaXJlY3RvcmllcyB0byBvcGVuLlwiLFxuICAgIH0pLFxuICBoYW5kbGVyOiBhc3luYyAoYXJncykgPT4ge1xuICAgIGNvbnN0IHdhc2lBcmdzID0gYXJnc1tcIl9cIl0uc2xpY2UoMSk7XG5cbiAgICBjb25zdCB3YXNpID0gbmV3IFdBU0koe1xuICAgICAgYXJnczogd2FzaUFyZ3MsXG4gICAgICBlbnY6IHByb2Nlc3MuZW52LFxuICAgICAgcHJlb3BlbnM6IHtcbiAgICAgICAgXCIvXCIgOiA8c3RyaW5nPmFyZ3MucHJlb3BlbixcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBpbXBvcnRPYmplY3QgPSB7IHdhc2lfc25hcHNob3RfcHJldmlldzE6IHdhc2kud2FzaUltcG9ydCB9O1xuXG4gICAgY29uc3Qgd2FzbSA9IGF3YWl0IFdlYkFzc2VtYmx5LmNvbXBpbGUoZnMucmVhZEZpbGVTeW5jKGFyZ3MuYmluYXJ5IGFzIHN0cmluZykpO1xuICAgIGNvbnN0IGluc3RhbmNlID0gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUod2FzbSwgaW1wb3J0T2JqZWN0KTtcbiAgICB3YXNpLnN0YXJ0KGluc3RhbmNlKTtcbiAgfSxcbn07XG4iXX0=