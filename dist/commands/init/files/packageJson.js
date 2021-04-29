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
exports.PackageJsonFile = void 0;
var interfaces_1 = require("../interfaces");
var lib_1 = require("@as-pect/cli/lib");
var asc_1 = require("assemblyscript/cli/asc");
var npmDefaultTest = 'echo "Error: no test specified" && exit 1';
var PackageManager;
(function (PackageManager) {
    PackageManager["NPM"] = "npm";
    PackageManager["Yarn"] = "yarn";
    PackageManager["PNPM"] = "pnpm";
})(PackageManager || (PackageManager = {}));
function getPm() {
    var pm = "npm";
    if (typeof process.env.npm_config_user_agent === "string") {
        if (/\byarn\//.test(process.env.npm_config_user_agent)) {
            pm = "yarn";
        }
        else if (/\bpnpm\//.test(process.env.npm_config_user_agent)) {
            pm = "pnpm";
        }
    }
    return pm;
}
function getPmCommands() {
    switch (getPm()) {
        case PackageManager.PNPM:
            return {
                install: "pnpm install",
                run: "pnpm run",
                test: "pnpm test",
            };
        case PackageManager.Yarn:
            return {
                install: "yarn install",
                run: "yarn",
                test: "yarn test",
            };
        default:
            return {
                install: "npm install",
                run: "npm run",
                test: "npm test",
            };
    }
}
var PackageJsonFile = /** @class */ (function (_super) {
    __extends(PackageJsonFile, _super);
    function PackageJsonFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "package.json";
        _this.pm = "npm";
        _this.pkgObj = {
            scripts: {
                test: "asb test -- --verbose",
                "test:ci": "asb test -- --summary",
                "build:untouched": "asb assembly/index.ts --target debug",
                "build:optimized": "asb assembly/index.ts --target release",
                build: getPmCommands().run + " build:untouched && " + getPmCommands().run + " build:optimized",
            },
            devDependencies: {
                "@as-pect/cli": "^" + lib_1.version,
                assemblyscript: "^" + asc_1.version,
            },
            dependencies: {
                "@assemblyscript/loader": "^" + asc_1.version,
            },
        };
        _this.updateOldContent = function (old) {
            var pkgOldObj = JSON.parse(old);
            var scripts = pkgOldObj.scripts || {};
            if (!scripts["build"]) {
                scripts["build:untouched"] = _this.pkgObj.scripts["build:untouched"];
                scripts["build:optimized"] = _this.pkgObj.scripts["build:optimized"];
                scripts["build"] = _this.pkgObj.scripts.build;
                pkgOldObj["scripts"] = scripts;
            }
            if (!scripts["test"] || scripts["test"] == npmDefaultTest) {
                scripts["test"] = _this.pkgObj.scripts.test;
                scripts["test:ci"] = _this.pkgObj.scripts["test:ci"];
                pkgOldObj["scripts"] = scripts;
            }
            var dependencies = pkgOldObj["dependencies"] || {};
            if (!dependencies["@assemblyscript/loader"]) {
                dependencies["@assemblyscript/loader"] = "^" + asc_1.version;
                pkgOldObj["dependencies"] = dependencies;
            }
            var devDependencies = pkgOldObj["devDependencies"] || {};
            if (!devDependencies["assemblyscript"]) {
                devDependencies["assemblyscript"] = "^" + asc_1.version;
                pkgOldObj["devDependencies"] = devDependencies;
            }
            return JSON.stringify(pkgOldObj, null, 2);
        };
        return _this;
    }
    PackageJsonFile.prototype.getContent = function () {
        return JSON.stringify(this.pkgObj, null, 2);
    };
    return PackageJsonFile;
}(interfaces_1.InitFile));
exports.PackageJsonFile = PackageJsonFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUU1RCw4Q0FBb0U7QUFFcEUsSUFBTSxjQUFjLEdBQUcsMkNBQTJDLENBQUM7QUFFbkUsSUFBSyxjQUlKO0FBSkQsV0FBSyxjQUFjO0lBQ2pCLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtBQUNmLENBQUMsRUFKSSxjQUFjLEtBQWQsY0FBYyxRQUlsQjtBQVFELFNBQVMsS0FBSztJQUNaLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNmLElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixLQUFLLFFBQVEsRUFBRTtRQUN6RCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3RELEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDYjthQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0QsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO0tBQ0Y7SUFDRCxPQUFPLEVBQW9CLENBQUM7QUFDOUIsQ0FBQztBQUVELFNBQVMsYUFBYTtJQUNwQixRQUFRLEtBQUssRUFBRSxFQUFFO1FBQ2YsS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixPQUFPO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixHQUFHLEVBQUUsVUFBVTtnQkFDZixJQUFJLEVBQUUsV0FBVzthQUNsQixDQUFDO1FBRUosS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixPQUFPO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixHQUFH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Qzs7SUFDSixDQUFDO0lBaENDLG9DQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQThCSCxzQkFBQztBQUFELENBQUMsQUFyREQsQ0FBcUMscUJBQVEsR0FxRDVDO0FBckRZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5pdEZpbGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBhc3BlY3RWZXJzaW9uIH0gZnJvbSBcIkBhcy1wZWN0L2NsaS9saWJcIjtcblxuaW1wb3J0IHsgdmVyc2lvbiBhcyBjb21waWxlclZlcnNpb24gfSBmcm9tIFwiYXNzZW1ibHlzY3JpcHQvY2xpL2FzY1wiO1xuXG5jb25zdCBucG1EZWZhdWx0VGVzdCA9ICdlY2hvIFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXCIgJiYgZXhpdCAxJztcblxuZW51bSBQYWNrYWdlTWFuYWdlciB7XG4gIE5QTSA9IFwibnBtXCIsXG4gIFlhcm4gPSBcInlhcm5cIixcbiAgUE5QTSA9IFwicG5wbVwiLFxufVxuXG5pbnRlcmZhY2UgUE1Db21tYW5kIHtcbiAgdGVzdDogc3RyaW5nO1xuICBpbnN0YWxsOiBzdHJpbmc7XG4gIHJ1bjogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBnZXRQbSgpOiBQYWNrYWdlTWFuYWdlciB7XG4gIGxldCBwbSA9IFwibnBtXCI7XG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKC9cXGJ5YXJuXFwvLy50ZXN0KHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCkpIHtcbiAgICAgIHBtID0gXCJ5YXJuXCI7XG4gICAgfSBlbHNlIGlmICgvXFxicG5wbVxcLy8udGVzdChwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQpKSB7XG4gICAgICBwbSA9IFwicG5wbVwiO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcG0gYXMgUGFja2FnZU1hbmFnZXI7XG59XG5cbmZ1bmN0aW9uIGdldFBtQ29tbWFuZHMoKTogUE1Db21tYW5kIHtcbiAgc3dpdGNoIChnZXRQbSgpKSB7XG4gICAgY2FzZSBQYWNrYWdlTWFuYWdlci5QTlBNOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJwbnBtIGluc3RhbGxcIixcbiAgICAgICAgcnVuOiBcInBucG0gcnVuXCIsXG4gICAgICAgIHRlc3Q6IFwicG5wbSB0ZXN0XCIsXG4gICAgICB9O1xuXG4gICAgY2FzZSBQYWNrYWdlTWFuYWdlci5ZYXJuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJ5YXJuIGluc3RhbGxcIixcbiAgICAgICAgcnVuOiBcInlhcm5cIixcbiAgICAgICAgdGVzdDogXCJ5YXJuIHRlc3RcIixcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJucG0gaW5zdGFsbFwiLFxuICAgICAgICBydW46IFwibnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcIm5wbSB0ZXN0XCIsXG4gICAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvbkZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcInBhY2thZ2UuanNvblwiO1xuICBwbSA9IFwibnBtXCI7XG4gIHBrZ09iaiA9IHtcbiAgICBzY3JpcHRzOiB7XG4gICAgICB0ZXN0OiBcImFzYiB0ZXN0IC0tIC0tdmVyYm9zZVwiLFxuICAgICAgXCJ0ZXN0OmNpXCI6IFwiYXNiIHRlc3QgLS0gLS1zdW1tYXJ5XCIsXG4gICAgICBcImJ1aWxkOnVudG91Y2hlZFwiOiBcImFzYiBhc3NlbWJseS9pbmRleC50cyAtLXRhcmdldCBkZWJ1Z1wiLFxuICAgICAgXCJidWlsZDpvcHRpbWl6ZWRcIjogXCJhc2IgYXNzZW1ibHkvaW5kZXgudHMgLS10YXJnZXQgcmVsZWFzZVwiLFxuICAgICAgYnVpbGQ6IGAke2dldFBtQ29tbWFuZHMoKS5ydW59IGJ1aWxkOnVudG91Y2hlZCAmJiAke1xuICAgICAgICBnZXRQbUNvbW1hbmRzKCkucnVuXG4gICAgICB9IGJ1aWxkOm9wdGltaXplZGAsXG4gICAgfSxcbiAgICBkZXZEZXBlbmRlbmNpZXM6IHtcbiAgICAgIFwiQGFzLXBlY3QvY2xpXCI6IFwiXlwiICsgYXNwZWN0VmVyc2lvbixcbiAgICAgIGFzc2VtYmx5c2NyaXB0OiBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbixcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgXCJAYXNzZW1ibHlzY3JpcHQvbG9hZGVyXCI6IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uLFxuICAgIH0sXG4gIH07XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5wa2dPYmosIG51bGwsIDIpO1xuICB9XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBwa2dPbGRPYmogPSBKU09OLnBhcnNlKG9sZCk7XG4gICAgbGV0IHNjcmlwdHMgPSBwa2dPbGRPYmouc2NyaXB0cyB8fCB7fTtcbiAgICBpZiAoIXNjcmlwdHNbXCJidWlsZFwiXSkge1xuICAgICAgc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJidWlsZDp1bnRvdWNoZWRcIl07XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOm9wdGltaXplZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMuYnVpbGQ7XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG4gICAgaWYgKCFzY3JpcHRzW1widGVzdFwiXSB8fCBzY3JpcHRzW1widGVzdFwiXSA9PSBucG1EZWZhdWx0VGVzdCkge1xuICAgICAgc2NyaXB0c1tcInRlc3RcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzLnRlc3Q7XG4gICAgICBzY3JpcHRzW1widGVzdDpjaVwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJ0ZXN0OmNpXCJdO1xuICAgICAgcGtnT2xkT2JqW1wic2NyaXB0c1wiXSA9IHNjcmlwdHM7XG4gICAgfVxuXG4gICAgbGV0IGRlcGVuZGVuY2llcyA9IHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSB8fCB7fTtcbiAgICBpZiAoIWRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0pIHtcbiAgICAgIGRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0gPSBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbjtcbiAgICAgIHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSA9IGRlcGVuZGVuY2llcztcbiAgICB9XG5cbiAgICBsZXQgZGV2RGVwZW5kZW5jaWVzID0gcGtnT2xkT2JqW1wiZGV2RGVwZW5kZW5jaWVzXCJdIHx8IHt9O1xuICAgIGlmICghZGV2RGVwZW5kZW5jaWVzW1wiYXNzZW1ibHlzY3JpcHRcIl0pIHtcbiAgICAgIGRldkRlcGVuZGVuY2llc1tcImFzc2VtYmx5c2NyaXB0XCJdID0gXCJeXCIgKyBjb21waWxlclZlcnNpb247XG4gICAgICBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gPSBkZXZEZXBlbmRlbmNpZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBrZ09sZE9iaiwgbnVsbCwgMik7XG4gIH07XG59XG4iXX0=