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
exports.PackageJsonFile = exports.getPmCommands = exports.getPm = void 0;
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
exports.getPm = getPm;
function getPmCommands() {
    switch (getPm()) {
        case PackageManager.PNPM:
            return {
                install: "pnpm install",
                pkgInstall: "pnpm add",
                run: "pnpm run",
                test: "pnpm test",
            };
        case PackageManager.Yarn:
            return {
                install: "yarn install",
                pkgInstall: "yarn add",
                run: "yarn",
                test: "yarn test",
            };
        default:
            return {
                install: "npm install",
                pkgInstall: "npm install",
                run: "npm run",
                test: "npm test",
            };
    }
}
exports.getPmCommands = getPmCommands;
var PackageJsonFile = /** @class */ (function (_super) {
    __extends(PackageJsonFile, _super);
    function PackageJsonFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "package.json";
        _this.description = "Package info containing the necessary commands to compile to WebAssembly";
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
                "@typescript-eslint/eslint-plugin": "^4.22.0",
                "@typescript-eslint/parser": "^4.22.0",
                assemblyscript: "^" + asc_1.version,
                eslint: "^7.17.0",
            },
            dependencies: {
                "@assemblyscript/loader": "^" + asc_1.version,
                typescript: "^4.2.4",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUU1RCw4Q0FBb0U7QUFFcEUsSUFBTSxjQUFjLEdBQUcsMkNBQTJDLENBQUM7QUFFbkUsSUFBSyxjQUlKO0FBSkQsV0FBSyxjQUFjO0lBQ2pCLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtBQUNmLENBQUMsRUFKSSxjQUFjLEtBQWQsY0FBYyxRQUlsQjtBQVNELFNBQWdCLEtBQUs7SUFDbkIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2YsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEtBQUssUUFBUSxFQUFFO1FBQ3pELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDdEQsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO2FBQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsRUFBRTtZQUM3RCxFQUFFLEdBQUcsTUFBTSxDQUFDO1NBQ2I7S0FDRjtJQUNELE9BQU8sRUFBb0IsQ0FBQztBQUM5QixDQUFDO0FBVkQsc0JBVUM7QUFFRCxTQUFnQixhQUFhO0lBQzNCLFFBQVEsS0FBSyxFQUFFLEVBQUU7UUFDZixLQUFLLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixHQUFHLEVBQUUsVUFBVTtnQkFDZixJQUFJLEVBQUUsV0FBVzthQUNsQixDQUFDO1FBRUosS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixP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QUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO2dCQUN0QyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLEdBQUcsYUFBZSxDQUFDO2dCQUMxRCxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxlQUFlLENBQUM7YUFDaEQ7WUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQWhDQyxvQ0FBVSxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUE4Qkgsc0JBQUM7QUFBRCxDQUFDLEFBM0RELENBQXFDLHFCQUFRLEdBMkQ1QztBQTNEWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluaXRGaWxlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IHZlcnNpb24gYXMgYXNwZWN0VmVyc2lvbiB9IGZyb20gXCJAYXMtcGVjdC9jbGkvbGliXCI7XG5cbmltcG9ydCB7IHZlcnNpb24gYXMgY29tcGlsZXJWZXJzaW9uIH0gZnJvbSBcImFzc2VtYmx5c2NyaXB0L2NsaS9hc2NcIjtcblxuY29uc3QgbnBtRGVmYXVsdFRlc3QgPSAnZWNobyBcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFwiICYmIGV4aXQgMSc7XG5cbmVudW0gUGFja2FnZU1hbmFnZXIge1xuICBOUE0gPSBcIm5wbVwiLFxuICBZYXJuID0gXCJ5YXJuXCIsXG4gIFBOUE0gPSBcInBucG1cIixcbn1cblxuaW50ZXJmYWNlIFBNQ29tbWFuZCB7XG4gIHRlc3Q6IHN0cmluZztcbiAgaW5zdGFsbDogc3RyaW5nO1xuICBwa2dJbnN0YWxsOiBzdHJpbmc7XG4gIHJ1bjogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG0oKTogUGFja2FnZU1hbmFnZXIge1xuICBsZXQgcG0gPSBcIm5wbVwiO1xuICBpZiAodHlwZW9mIHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmICgvXFxieWFyblxcLy8udGVzdChwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQpKSB7XG4gICAgICBwbSA9IFwieWFyblwiO1xuICAgIH0gZWxzZSBpZiAoL1xcYnBucG1cXC8vLnRlc3QocHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50KSkge1xuICAgICAgcG0gPSBcInBucG1cIjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBtIGFzIFBhY2thZ2VNYW5hZ2VyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG1Db21tYW5kcygpOiBQTUNvbW1hbmQge1xuICBzd2l0Y2ggKGdldFBtKCkpIHtcbiAgICBjYXNlIFBhY2thZ2VNYW5hZ2VyLlBOUE06XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbnN0YWxsOiBcInBucG0gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcInBucG0gYWRkXCIsXG4gICAgICAgIHJ1bjogXCJwbnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcInBucG0gdGVzdFwiLFxuICAgICAgfTtcblxuICAgIGNhc2UgUGFja2FnZU1hbmFnZXIuWWFybjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwieWFybiBpbnN0YWxsXCIsXG4gICAgICAgIHBrZ0luc3RhbGw6IFwieWFybiBhZGRcIixcbiAgICAgICAgcnVuOiBcInlhcm5cIixcbiAgICAgICAgdGVzdDogXCJ5YXJuIHRlc3RcIixcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJucG0gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcIm5wbSBpbnN0YWxsXCIsXG4gICAgICAgIHJ1bjogXCJucG0gcnVuXCIsXG4gICAgICAgIHRlc3Q6IFwibnBtIHRlc3RcIixcbiAgICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VKc29uRmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwicGFja2FnZS5qc29uXCI7XG4gIGRlc2NyaXB0aW9uID1cbiAgICBcIlBhY2thZ2UgaW5mbyBjb250YWluaW5nIHRoZSBuZWNlc3NhcnkgY29tbWFuZHMgdG8gY29tcGlsZSB0byBXZWJBc3NlbWJseVwiO1xuICBwbSA9IFwibnBtXCI7XG4gIHBrZ09iaiA9IHtcbiAgICBzY3JpcHRzOiB7XG4gICAgICB0ZXN0OiBcImFzYiB0ZXN0IC0tIC0tdmVyYm9zZVwiLFxuICAgICAgXCJ0ZXN0OmNpXCI6IFwiYXNiIHRlc3QgLS0gLS1zdW1tYXJ5XCIsXG4gICAgICBcImJ1aWxkOnVudG91Y2hlZFwiOiBcImFzYiBhc3NlbWJseS9pbmRleC50cyAtLXRhcmdldCBkZWJ1Z1wiLFxuICAgICAgXCJidWlsZDpvcHRpbWl6ZWRcIjogXCJhc2IgYXNzZW1ibHkvaW5kZXgudHMgLS10YXJnZXQgcmVsZWFzZVwiLFxuICAgICAgYnVpbGQ6IGAke2dldFBtQ29tbWFuZHMoKS5ydW59IGJ1aWxkOnVudG91Y2hlZCAmJiAke1xuICAgICAgICBnZXRQbUNvbW1hbmRzKCkucnVuXG4gICAgICB9IGJ1aWxkOm9wdGltaXplZGAsXG4gICAgfSxcbiAgICBkZXZEZXBlbmRlbmNpZXM6IHtcbiAgICAgIFwiQGFzLXBlY3QvY2xpXCI6IFwiXlwiICsgYXNwZWN0VmVyc2lvbixcbiAgICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNC4yMi4wXCIsXG4gICAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNC4yMi4wXCIsXG4gICAgICBhc3NlbWJseXNjcmlwdDogXCJeXCIgKyBjb21waWxlclZlcnNpb24sXG4gICAgICBlc2xpbnQ6IFwiXjcuMTcuMFwiLFxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIjogXCJeXCIgKyBjb21waWxlclZlcnNpb24sXG4gICAgICB0eXBlc2NyaXB0OiBcIl40LjIuNFwiLFxuICAgIH0sXG4gIH07XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5wa2dPYmosIG51bGwsIDIpO1xuICB9XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBwa2dPbGRPYmogPSBKU09OLnBhcnNlKG9sZCk7XG4gICAgbGV0IHNjcmlwdHMgPSBwa2dPbGRPYmouc2NyaXB0cyB8fCB7fTtcbiAgICBpZiAoIXNjcmlwdHNbXCJidWlsZFwiXSkge1xuICAgICAgc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJidWlsZDp1bnRvdWNoZWRcIl07XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOm9wdGltaXplZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMuYnVpbGQ7XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG4gICAgaWYgKCFzY3JpcHRzW1widGVzdFwiXSB8fCBzY3JpcHRzW1widGVzdFwiXSA9PSBucG1EZWZhdWx0VGVzdCkge1xuICAgICAgc2NyaXB0c1tcInRlc3RcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzLnRlc3Q7XG4gICAgICBzY3JpcHRzW1widGVzdDpjaVwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJ0ZXN0OmNpXCJdO1xuICAgICAgcGtnT2xkT2JqW1wic2NyaXB0c1wiXSA9IHNjcmlwdHM7XG4gICAgfVxuXG4gICAgbGV0IGRlcGVuZGVuY2llcyA9IHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSB8fCB7fTtcbiAgICBpZiAoIWRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0pIHtcbiAgICAgIGRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0gPSBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbjtcbiAgICAgIHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSA9IGRlcGVuZGVuY2llcztcbiAgICB9XG5cbiAgICBsZXQgZGV2RGVwZW5kZW5jaWVzID0gcGtnT2xkT2JqW1wiZGV2RGVwZW5kZW5jaWVzXCJdIHx8IHt9O1xuICAgIGlmICghZGV2RGVwZW5kZW5jaWVzW1wiYXNzZW1ibHlzY3JpcHRcIl0pIHtcbiAgICAgIGRldkRlcGVuZGVuY2llc1tcImFzc2VtYmx5c2NyaXB0XCJdID0gXCJeXCIgKyBjb21waWxlclZlcnNpb247XG4gICAgICBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gPSBkZXZEZXBlbmRlbmNpZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBrZ09sZE9iaiwgbnVsbCwgMik7XG4gIH07XG59XG4iXX0=