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
exports.BuildGitignoreFile = exports.RootGitignoreFile = void 0;
var interfaces_1 = require("../interfaces");
var RootGitignoreFile = /** @class */ (function (_super) {
    __extends(RootGitignoreFile, _super);
    function RootGitignoreFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = ".gitignore";
        _this.updateOldContent = function (old) { return old + "\n" + _this.getContent(); };
        return _this;
    }
    RootGitignoreFile.prototype.getContent = function () {
        return [
            "node_modules/",
            "assembly/**/__tests__/*.map",
            "assembly/**/__tests__/*.wat",
        ].join("\n");
    };
    return RootGitignoreFile;
}(interfaces_1.InitFile));
exports.RootGitignoreFile = RootGitignoreFile;
var BuildGitignoreFile = /** @class */ (function (_super) {
    __extends(BuildGitignoreFile, _super);
    function BuildGitignoreFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = ".gitignore";
        _this.updateOldContent = function (old) { return old + "\n" + _this.getContent(); };
        return _this;
    }
    BuildGitignoreFile.prototype.getContent = function () {
        return ["*.wasm", "*.wasm.map", "*.asm.js"].join("\n");
    };
    return BuildGitignoreFile;
}(interfaces_1.InitFile));
exports.BuildGitignoreFile = BuildGitignoreFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aWdub3Jlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ZpbGVzL2dpdGlnbm9yZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUV6QztJQUF1QyxxQ0FBUTtJQUEvQztRQUFBLHFFQVVDO1FBVEMsVUFBSSxHQUFHLFlBQVksQ0FBQztRQUNwQixzQkFBZ0IsR0FBRyxVQUFDLEdBQVcsSUFBSyxPQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUE5QixDQUE4QixDQUFDOztJQVFyRSxDQUFDO0lBUEMsc0NBQVUsR0FBVjtRQUNFLE9BQU87WUFDTCxlQUFlO1lBQ2YsNkJBQTZCO1lBQzdCLDZCQUE2QjtTQUM5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFWRCxDQUF1QyxxQkFBUSxHQVU5QztBQVZZLDhDQUFpQjtBQVk5QjtJQUF3QyxzQ0FBUTtJQUFoRDtRQUFBLHFFQU1DO1FBTEMsVUFBSSxHQUFHLFlBQVksQ0FBQztRQUNwQixzQkFBZ0IsR0FBRyxVQUFDLEdBQVcsSUFBSyxPQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUE5QixDQUE4QixDQUFDOztJQUlyRSxDQUFDO0lBSEMsdUNBQVUsR0FBVjtRQUNFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBd0MscUJBQVEsR0FNL0M7QUFOWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5cbmV4cG9ydCBjbGFzcyBSb290R2l0aWdub3JlRmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwiLmdpdGlnbm9yZVwiO1xuICB1cGRhdGVPbGRDb250ZW50ID0gKG9sZDogc3RyaW5nKSA9PiBvbGQgKyBcIlxcblwiICsgdGhpcy5nZXRDb250ZW50KCk7XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1xuICAgICAgXCJub2RlX21vZHVsZXMvXCIsXG4gICAgICBcImFzc2VtYmx5LyoqL19fdGVzdHNfXy8qLm1hcFwiLFxuICAgICAgXCJhc3NlbWJseS8qKi9fX3Rlc3RzX18vKi53YXRcIixcbiAgICBdLmpvaW4oXCJcXG5cIik7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJ1aWxkR2l0aWdub3JlRmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwiLmdpdGlnbm9yZVwiO1xuICB1cGRhdGVPbGRDb250ZW50ID0gKG9sZDogc3RyaW5nKSA9PiBvbGQgKyBcIlxcblwiICsgdGhpcy5nZXRDb250ZW50KCk7XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1wiKi53YXNtXCIsIFwiKi53YXNtLm1hcFwiLCBcIiouYXNtLmpzXCJdLmpvaW4oXCJcXG5cIik7XG4gIH1cbn1cblxuXG4iXX0=