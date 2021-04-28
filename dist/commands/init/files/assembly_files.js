"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsConfigFile = exports.AssemblyIndexFile = void 0;
var interfaces_1 = require("../interfaces");
var indexContent = "// The entry file of your WebAssembly module.\n\nexport function add(a: i32, b: i32): i32 {\n  return a + b;\n}\n";
var tsconfigContent = "{\n    \"extends\": \"assemblyscript/std/assembly.json\",\n    \"include\": [\n      \"./**/*.ts\"\n    ]\n}\n";
var AssemblyIndexFile = /** @class */ (function (_super) {
    __extends(AssemblyIndexFile, _super);
    function AssemblyIndexFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "assembly/index.ts";
        _this.updateOldContent = null;
        return _this;
    }
    AssemblyIndexFile.prototype.getContent = function () {
        return indexContent;
    };
    return AssemblyIndexFile;
}(interfaces_1.InitFile));
exports.AssemblyIndexFile = AssemblyIndexFile;
var TsConfigFile = /** @class */ (function (_super) {
    __extends(TsConfigFile, _super);
    function TsConfigFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "assembly/tsconfig.json";
        _this.updateOldContent = null;
        return _this;
    }
    TsConfigFile.prototype.getContent = function () {
        return tsconfigContent;
    };
    return TsConfigFile;
}(interfaces_1.InitFile));
exports.TsConfigFile = TsConfigFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibHlfZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9hc3NlbWJseV9maWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBRXpDLElBQU0sWUFBWSxHQUFHLG1IQUtwQixDQUFDO0FBRUYsSUFBTSxlQUFlLEdBQUcsZ0hBTXZCLENBQUM7QUFFRjtJQUF1QyxxQ0FBUTtJQUEvQztRQUFBLHFFQU1DO1FBTEMsVUFBSSxHQUFHLG1CQUFtQixDQUFDO1FBSTNCLHNCQUFnQixHQUFHLElBQUksQ0FBQzs7SUFDMUIsQ0FBQztJQUpDLHNDQUFVLEdBQVY7UUFDRSxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUgsd0JBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBdUMscUJBQVEsR0FNOUM7QUFOWSw4Q0FBaUI7QUFROUI7SUFBa0MsZ0NBQVE7SUFBMUM7UUFBQSxxRUFNQztRQUxDLFVBQUksR0FBRyx3QkFBd0IsQ0FBQztRQUloQyxzQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0lBQzFCLENBQUM7SUFKQyxpQ0FBVSxHQUFWO1FBQ0UsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUVILG1CQUFDO0FBQUQsQ0FBQyxBQU5ELENBQWtDLHFCQUFRLEdBTXpDO0FBTlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5cbmNvbnN0IGluZGV4Q29udGVudCA9IGAvLyBUaGUgZW50cnkgZmlsZSBvZiB5b3VyIFdlYkFzc2VtYmx5IG1vZHVsZS5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZChhOiBpMzIsIGI6IGkzMik6IGkzMiB7XG4gIHJldHVybiBhICsgYjtcbn1cbmA7XG5cbmNvbnN0IHRzY29uZmlnQ29udGVudCA9IGB7XG4gICAgXCJleHRlbmRzXCI6IFwiYXNzZW1ibHlzY3JpcHQvc3RkL2Fzc2VtYmx5Lmpzb25cIixcbiAgICBcImluY2x1ZGVcIjogW1xuICAgICAgXCIuLyoqLyoudHNcIlxuICAgIF1cbn1cbmA7XG5cbmV4cG9ydCBjbGFzcyBBc3NlbWJseUluZGV4RmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwiYXNzZW1ibHkvaW5kZXgudHNcIjtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBpbmRleENvbnRlbnQ7XG4gIH1cbiAgdXBkYXRlT2xkQ29udGVudCA9IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBUc0NvbmZpZ0ZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcImFzc2VtYmx5L3RzY29uZmlnLmpzb25cIjtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0c2NvbmZpZ0NvbnRlbnQ7XG4gIH1cbiAgdXBkYXRlT2xkQ29udGVudCA9IG51bGw7XG59XG4iXX0=