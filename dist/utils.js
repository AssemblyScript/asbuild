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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirExists = exports.getGlobalCliCallback = exports.setGlobalCliCallback = exports.getGlobalAscOptions = exports.setGlobalAscOptions = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var DEFAULT_ASC_OPTIONS = {};
var DEFAULT_CLI_CALLBACK = function (err) {
    if (err) {
        throw err;
    }
    return 1;
};
// @ts-ignore
var ASC_OPTIONS = DEFAULT_ASC_OPTIONS;
// @ts-ignore
var CLI_CALLBACK = DEFAULT_CLI_CALLBACK;
/**
 * @note Only for use by testing mechanism
 */
function setGlobalAscOptions(ascOptions) {
    if (ascOptions === void 0) { ascOptions = DEFAULT_ASC_OPTIONS; }
    ASC_OPTIONS = ascOptions;
}
exports.setGlobalAscOptions = setGlobalAscOptions;
function getGlobalAscOptions() {
    return ASC_OPTIONS;
}
exports.getGlobalAscOptions = getGlobalAscOptions;
/**
 * @note Only for use by testing mechanism
 */
function setGlobalCliCallback(callback) {
    if (callback === void 0) { callback = DEFAULT_CLI_CALLBACK; }
    CLI_CALLBACK = callback;
}
exports.setGlobalCliCallback = setGlobalCliCallback;
function getGlobalCliCallback() {
    return CLI_CALLBACK;
}
exports.getGlobalCliCallback = getGlobalCliCallback;
function ensureDirExists(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return;
    }
    ensureDirExists(dirname);
    fs.mkdirSync(dirname);
}
exports.ensureDirExists = ensureDirExists;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHlDQUE2QjtBQUM3QixxQ0FBeUI7QUFFekIsSUFBTSxtQkFBbUIsR0FBbUIsRUFBRSxDQUFDO0FBQy9DLElBQU0sb0JBQW9CLEdBQXVCLFVBQUMsR0FBRztJQUNuRCxJQUFJLEdBQUcsRUFBRTtRQUNQLE1BQU0sR0FBRyxDQUFDO0tBQ1g7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQUVGLGFBQWE7QUFDYixJQUFJLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztBQUN0QyxhQUFhO0FBQ2IsSUFBSSxZQUFZLEdBQUcsb0JBQW9CLENBQUM7QUFFeEM7O0dBRUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FDakMsVUFBZ0Q7SUFBaEQsMkJBQUEsRUFBQSxnQ0FBZ0Q7SUFFaEQsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUMzQixDQUFDO0FBSkQsa0RBSUM7QUFFRCxTQUFnQixtQkFBbUI7SUFDakMsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUZELGtEQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FDbEMsUUFBbUQ7SUFBbkQseUJBQUEsRUFBQSwrQkFBbUQ7SUFFbkQsWUFBWSxHQUFHLFFBQVEsQ0FBQztBQUMxQixDQUFDO0FBSkQsb0RBSUM7QUFFRCxTQUFnQixvQkFBb0I7SUFDbEMsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQUZELG9EQUVDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLFFBQWdCO0lBQzlDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzFCLE9BQU87S0FDUjtJQUNELGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QixFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFQRCwwQ0FPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFzYyBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmNvbnN0IERFRkFVTFRfQVNDX09QVElPTlM6IGFzYy5BUElPcHRpb25zID0ge307XG5jb25zdCBERUZBVUxUX0NMSV9DQUxMQkFDSzogKGE6IGFueSkgPT4gbnVtYmVyID0gKGVycikgPT4ge1xuICBpZiAoZXJyKSB7XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHJldHVybiAxO1xufTtcblxuLy8gQHRzLWlnbm9yZVxubGV0IEFTQ19PUFRJT05TID0gREVGQVVMVF9BU0NfT1BUSU9OUztcbi8vIEB0cy1pZ25vcmVcbmxldCBDTElfQ0FMTEJBQ0sgPSBERUZBVUxUX0NMSV9DQUxMQkFDSztcblxuLyoqXG4gKiBAbm90ZSBPbmx5IGZvciB1c2UgYnkgdGVzdGluZyBtZWNoYW5pc21cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEdsb2JhbEFzY09wdGlvbnMoXG4gIGFzY09wdGlvbnM6IGFzYy5BUElPcHRpb25zID0gREVGQVVMVF9BU0NfT1BUSU9OU1xuKSB7XG4gIEFTQ19PUFRJT05TID0gYXNjT3B0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsb2JhbEFzY09wdGlvbnMoKTogYXNjLkFQSU9wdGlvbnMge1xuICByZXR1cm4gQVNDX09QVElPTlM7XG59XG5cbi8qKlxuICogQG5vdGUgT25seSBmb3IgdXNlIGJ5IHRlc3RpbmcgbWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRHbG9iYWxDbGlDYWxsYmFjayhcbiAgY2FsbGJhY2s6IChhOiBhbnkpID0+IG51bWJlciA9IERFRkFVTFRfQ0xJX0NBTExCQUNLXG4pIHtcbiAgQ0xJX0NBTExCQUNLID0gY2FsbGJhY2s7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxDbGlDYWxsYmFjaygpOiAoYTogYW55KSA9PiBudW1iZXIge1xuICByZXR1cm4gQ0xJX0NBTExCQUNLO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlRGlyRXhpc3RzKGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgdmFyIGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhkaXJuYW1lKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbnN1cmVEaXJFeGlzdHMoZGlybmFtZSk7XG4gIGZzLm1rZGlyU3luYyhkaXJuYW1lKTtcbn1cbiJdfQ==