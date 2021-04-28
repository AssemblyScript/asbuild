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
exports.IndexJsFile = void 0;
var interfaces_1 = require("../interfaces");
var IndexJsFile = /** @class */ (function (_super) {
    __extends(IndexJsFile, _super);
    function IndexJsFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "index.js";
        _this.updateOldContent = function (old) {
            var commentOut = old
                .split("\n")
                .map(function (v) { return "// " + v; })
                .join("\n");
            return commentOut + "\n\n" + _this.getContent();
        };
        return _this;
    }
    IndexJsFile.prototype.getContent = function () {
        return [
            "const fs = require(\"fs\");",
            "const loader = require(\"@assemblyscript/loader\");",
            "const imports = { /* imports go here */ };",
            "const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + \"/build/optimized.wasm\"), imports);",
            "module.exports = wasmModule.exports;",
        ].join("\n");
    };
    return IndexJsFile;
}(interfaces_1.InitFile));
exports.IndexJsFile = IndexJsFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhKcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ZpbGVzL2luZGV4SnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUV6QztJQUFpQywrQkFBUTtJQUF6QztRQUFBLHFFQW1CQztRQWxCQyxVQUFJLEdBQUcsVUFBVSxDQUFDO1FBV2xCLHNCQUFnQixHQUFHLFVBQUMsR0FBVztZQUM3QixJQUFJLFVBQVUsR0FBRyxHQUFHO2lCQUNqQixLQUFLLENBQUMsSUFBSSxDQUFDO2lCQUNYLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUssR0FBRyxDQUFDLEVBQVQsQ0FBUyxDQUFDO2lCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZCxPQUFPLFVBQVUsR0FBRyxNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pELENBQUMsQ0FBQzs7SUFDSixDQUFDO0lBakJDLGdDQUFVLEdBQVY7UUFDRSxPQUFPO1lBQ0wsNkJBQTJCO1lBQzNCLHFEQUFtRDtZQUNuRCw0Q0FBNEM7WUFDNUMsNkdBQTJHO1lBQzNHLHNDQUFzQztTQUN2QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7SUFTSCxrQkFBQztBQUFELENBQUMsQUFuQkQsQ0FBaUMscUJBQVEsR0FtQnhDO0FBbkJZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5pdEZpbGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuXG5leHBvcnQgY2xhc3MgSW5kZXhKc0ZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcImluZGV4LmpzXCI7XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1xuICAgICAgYGNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO2AsXG4gICAgICBgY29uc3QgbG9hZGVyID0gcmVxdWlyZShcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIik7YCxcbiAgICAgIGBjb25zdCBpbXBvcnRzID0geyAvKiBpbXBvcnRzIGdvIGhlcmUgKi8gfTtgLFxuICAgICAgYGNvbnN0IHdhc21Nb2R1bGUgPSBsb2FkZXIuaW5zdGFudGlhdGVTeW5jKGZzLnJlYWRGaWxlU3luYyhfX2Rpcm5hbWUgKyBcIi9idWlsZC9vcHRpbWl6ZWQud2FzbVwiKSwgaW1wb3J0cyk7YCxcbiAgICAgIGBtb2R1bGUuZXhwb3J0cyA9IHdhc21Nb2R1bGUuZXhwb3J0cztgLFxuICAgIF0uam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIHZhciBjb21tZW50T3V0ID0gb2xkXG4gICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgIC5tYXAoKHYpID0+IFwiLy8gXCIgKyB2KVxuICAgICAgLmpvaW4oXCJcXG5cIik7XG4gICAgcmV0dXJuIGNvbW1lbnRPdXQgKyBcIlxcblxcblwiICsgdGhpcy5nZXRDb250ZW50KCk7XG4gIH07XG59XG4iXX0=