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
        _this.description = "Git configuration that excludes tests residue and node_modules.";
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
        _this.path = "build/.gitignore";
        _this.description = "Git configuration that excludes compiled binaries from source control.";
        _this.updateOldContent = function (old) { return old + "\n" + _this.getContent(); };
        return _this;
    }
    BuildGitignoreFile.prototype.getContent = function () {
        return ["*.wasm", "*.wasm.map", "*.asm.js"].join("\n");
    };
    return BuildGitignoreFile;
}(interfaces_1.InitFile));
exports.BuildGitignoreFile = BuildGitignoreFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aWdub3Jlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ZpbGVzL2dpdGlnbm9yZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUV6QztJQUF1QyxxQ0FBUTtJQUEvQztRQUFBLHFFQVlDO1FBWEMsVUFBSSxHQUFHLFlBQVksQ0FBQztRQUNwQixpQkFBVyxHQUNULGlFQUFpRSxDQUFDO1FBQ3BFLHNCQUFnQixHQUFHLFVBQUMsR0FBVyxJQUFLLE9BQUEsR0FBRyxHQUFHLElBQUksR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQTlCLENBQThCLENBQUM7O0lBUXJFLENBQUM7SUFQQyxzQ0FBVSxHQUFWO1FBQ0UsT0FBTztZQUNMLGVBQWU7WUFDZiw2QkFBNkI7WUFDN0IsNkJBQTZCO1NBQzlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQVpELENBQXVDLHFCQUFRLEdBWTlDO0FBWlksOENBQWlCO0FBYzlCO0lBQXdDLHNDQUFRO0lBQWhEO1FBQUEscUVBUUM7UUFQQyxVQUFJLEdBQUcsa0JBQWtCLENBQUM7UUFDMUIsaUJBQVcsR0FDVCx3RUFBd0UsQ0FBQztRQUMzRSxzQkFBZ0IsR0FBRyxVQUFDLEdBQVcsSUFBSyxPQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUE5QixDQUE4QixDQUFDOztJQUlyRSxDQUFDO0lBSEMsdUNBQVUsR0FBVjtRQUNFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBUkQsQ0FBd0MscUJBQVEsR0FRL0M7QUFSWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5cbmV4cG9ydCBjbGFzcyBSb290R2l0aWdub3JlRmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwiLmdpdGlnbm9yZVwiO1xuICBkZXNjcmlwdGlvbiA9XG4gICAgXCJHaXQgY29uZmlndXJhdGlvbiB0aGF0IGV4Y2x1ZGVzIHRlc3RzIHJlc2lkdWUgYW5kIG5vZGVfbW9kdWxlcy5cIjtcbiAgdXBkYXRlT2xkQ29udGVudCA9IChvbGQ6IHN0cmluZykgPT4gb2xkICsgXCJcXG5cIiArIHRoaXMuZ2V0Q29udGVudCgpO1xuICBnZXRDb250ZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIFwibm9kZV9tb2R1bGVzL1wiLFxuICAgICAgXCJhc3NlbWJseS8qKi9fX3Rlc3RzX18vKi5tYXBcIixcbiAgICAgIFwiYXNzZW1ibHkvKiovX190ZXN0c19fLyoud2F0XCIsXG4gICAgXS5qb2luKFwiXFxuXCIpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWlsZEdpdGlnbm9yZUZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcImJ1aWxkLy5naXRpZ25vcmVcIjtcbiAgZGVzY3JpcHRpb24gPVxuICAgIFwiR2l0IGNvbmZpZ3VyYXRpb24gdGhhdCBleGNsdWRlcyBjb21waWxlZCBiaW5hcmllcyBmcm9tIHNvdXJjZSBjb250cm9sLlwiO1xuICB1cGRhdGVPbGRDb250ZW50ID0gKG9sZDogc3RyaW5nKSA9PiBvbGQgKyBcIlxcblwiICsgdGhpcy5nZXRDb250ZW50KCk7XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gW1wiKi53YXNtXCIsIFwiKi53YXNtLm1hcFwiLCBcIiouYXNtLmpzXCJdLmpvaW4oXCJcXG5cIik7XG4gIH1cbn1cbiJdfQ==