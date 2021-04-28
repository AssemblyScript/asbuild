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
        _this.path = "build/.gitignore";
        _this.updateOldContent = function (old) { return old + "\n" + _this.getContent(); };
        return _this;
    }
    BuildGitignoreFile.prototype.getContent = function () {
        return ["*.wasm", "*.wasm.map", "*.asm.js"].join("\n");
    };
    return BuildGitignoreFile;
}(interfaces_1.InitFile));
exports.BuildGitignoreFile = BuildGitignoreFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aWdub3Jlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ZpbGVzL2dpdGlnbm9yZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUV6QztJQUF1QyxxQ0FBUTtJQUEvQztRQUFBLHFFQVVDO1FBVEMsVUFBSSxHQUFHLFlBQVksQ0FBQztRQUNwQixzQkFBZ0IsR0FBRyxVQUFDLEdBQVcsSUFBSyxPQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUE5QixDQUE4QixDQUFDOztJQVFyRSxDQUFDO0lBUEMsc0NBQVUsR0FBVjtRQUNFLE9BQU87WUFDTCxlQUFlO1lBQ2YsNkJBQTZCO1lBQzdCLDZCQUE2QjtTQUM5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFWRCxDQUF1QyxxQkFBUSxHQVU5QztBQVZZLDhDQUFpQjtBQVk5QjtJQUF3QyxzQ0FBUTtJQUFoRDtRQUFBLHFFQU1DO1FBTEMsVUFBSSxHQUFHLGtCQUFrQixDQUFDO1FBQzFCLHNCQUFnQixHQUFHLFVBQUMsR0FBVyxJQUFLLE9BQUEsR0FBRyxHQUFHLElBQUksR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQTlCLENBQThCLENBQUM7O0lBSXJFLENBQUM7SUFIQyx1Q0FBVSxHQUFWO1FBQ0UsT0FBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFORCxDQUF3QyxxQkFBUSxHQU0vQztBQU5ZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluaXRGaWxlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcblxuZXhwb3J0IGNsYXNzIFJvb3RHaXRpZ25vcmVGaWxlIGV4dGVuZHMgSW5pdEZpbGUge1xuICBwYXRoID0gXCIuZ2l0aWdub3JlXCI7XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpID0+IG9sZCArIFwiXFxuXCIgKyB0aGlzLmdldENvbnRlbnQoKTtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBbXG4gICAgICBcIm5vZGVfbW9kdWxlcy9cIixcbiAgICAgIFwiYXNzZW1ibHkvKiovX190ZXN0c19fLyoubWFwXCIsXG4gICAgICBcImFzc2VtYmx5LyoqL19fdGVzdHNfXy8qLndhdFwiLFxuICAgIF0uam9pbihcIlxcblwiKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQnVpbGRHaXRpZ25vcmVGaWxlIGV4dGVuZHMgSW5pdEZpbGUge1xuICBwYXRoID0gXCJidWlsZC8uZ2l0aWdub3JlXCI7XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpID0+IG9sZCArIFwiXFxuXCIgKyB0aGlzLmdldENvbnRlbnQoKTtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBbXCIqLndhc21cIiwgXCIqLndhc20ubWFwXCIsIFwiKi5hc20uanNcIl0uam9pbihcIlxcblwiKTtcbiAgfVxufVxuXG5cbiJdfQ==