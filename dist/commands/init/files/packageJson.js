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
// as-pect need ^0.18.7
var compilerVersion = asc_1.version >= "0.18.7" ? asc_1.version : "0.18.7";
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
                "lint:fix": 'asb fmt "assembly/**/*.ts"',
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
                assemblyscript: "^" + compilerVersion,
                asbuild: "latest",
                eslint: "^7.17.0",
                typescript: "^4.2.4",
            },
            dependencies: {
                "@assemblyscript/loader": "^" + compilerVersion,
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
                dependencies["@assemblyscript/loader"] = "^" + compilerVersion;
                pkgOldObj["dependencies"] = dependencies;
            }
            var devDependencies = pkgOldObj["devDependencies"] || {};
            if (!devDependencies["assemblyscript"]) {
                devDependencies["assemblyscript"] = "^" + compilerVersion;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUM1RCw4Q0FBOEQ7QUFFOUQsdUJBQXVCO0FBQ3ZCLElBQU0sZUFBZSxHQUFHLGFBQVMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBRXJFLElBQU0sY0FBYyxHQUFHLDJDQUEyQyxDQUFDO0FBRW5FLElBQUssY0FJSjtBQUpELFdBQUssY0FBYztJQUNqQiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7QUFDZixDQUFDLEVBSkksY0FBYyxLQUFkLGNBQWMsUUFJbEI7QUFTRCxTQUFnQixLQUFLO0lBQ25CLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNmLElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixLQUFLLFFBQVEsRUFBRTtRQUN6RCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3RELEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDYjthQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0QsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO0tBQ0Y7SUFDRCxPQUFPLEVBQW9CLENBQUM7QUFDOUIsQ0FBQztBQVZELHNCQVVDO0FBRUQsU0FBZ0IsYUFBYTtJQUMzQixRQUFRLEtBQUssRUFBRSxFQUFFO1FBQ2YsS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixPQUFPO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVB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QUcsR0FBRyxHQUFHLGVBQWUsQ0FBQztnQkFDL0QsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFlBQVksQ0FBQzthQUMxQztZQUVELElBQUksZUFBZSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6RCxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7Z0JBQ3RDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUcsR0FBRyxlQUFlLENBQUM7Z0JBQzFELFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLGVBQWUsQ0FBQzthQUNoRDtZQUVELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQzs7SUFDSixDQUFDO0lBaENDLG9DQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQThCSCxzQkFBQztBQUFELENBQUMsQUE3REQsQ0FBcUMscUJBQVEsR0E2RDVDO0FBN0RZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5pdEZpbGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBhc3BlY3RWZXJzaW9uIH0gZnJvbSBcIkBhcy1wZWN0L2NsaS9saWJcIjtcbmltcG9ydCB7IHZlcnNpb24gYXMgYXNWZXJzaW9uIH0gZnJvbSBcImFzc2VtYmx5c2NyaXB0L2NsaS9hc2NcIjtcblxuLy8gYXMtcGVjdCBuZWVkIF4wLjE4LjdcbmNvbnN0IGNvbXBpbGVyVmVyc2lvbiA9IGFzVmVyc2lvbiA+PSBcIjAuMTguN1wiID8gYXNWZXJzaW9uIDogXCIwLjE4LjdcIjtcblxuY29uc3QgbnBtRGVmYXVsdFRlc3QgPSAnZWNobyBcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFwiICYmIGV4aXQgMSc7XG5cbmVudW0gUGFja2FnZU1hbmFnZXIge1xuICBOUE0gPSBcIm5wbVwiLFxuICBZYXJuID0gXCJ5YXJuXCIsXG4gIFBOUE0gPSBcInBucG1cIixcbn1cblxuaW50ZXJmYWNlIFBNQ29tbWFuZCB7XG4gIHRlc3Q6IHN0cmluZztcbiAgaW5zdGFsbDogc3RyaW5nO1xuICBwa2dJbnN0YWxsOiBzdHJpbmc7XG4gIHJ1bjogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG0oKTogUGFja2FnZU1hbmFnZXIge1xuICBsZXQgcG0gPSBcIm5wbVwiO1xuICBpZiAodHlwZW9mIHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGlmICgvXFxieWFyblxcLy8udGVzdChwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQpKSB7XG4gICAgICBwbSA9IFwieWFyblwiO1xuICAgIH0gZWxzZSBpZiAoL1xcYnBucG1cXC8vLnRlc3QocHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50KSkge1xuICAgICAgcG0gPSBcInBucG1cIjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBtIGFzIFBhY2thZ2VNYW5hZ2VyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG1Db21tYW5kcygpOiBQTUNvbW1hbmQge1xuICBzd2l0Y2ggKGdldFBtKCkpIHtcbiAgICBjYXNlIFBhY2thZ2VNYW5hZ2VyLlBOUE06XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbnN0YWxsOiBcInBucG0gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcInBucG0gYWRkXCIsXG4gICAgICAgIHJ1bjogXCJwbnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcInBucG0gdGVzdFwiLFxuICAgICAgfTtcblxuICAgIGNhc2UgUGFja2FnZU1hbmFnZXIuWWFybjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwieWFybiBpbnN0YWxsXCIsXG4gICAgICAgIHBrZ0luc3RhbGw6IFwieWFybiBhZGRcIixcbiAgICAgICAgcnVuOiBcInlhcm5cIixcbiAgICAgICAgdGVzdDogXCJ5YXJuIHRlc3RcIixcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJucG0gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcIm5wbSBpbnN0YWxsXCIsXG4gICAgICAgIHJ1bjogXCJucG0gcnVuXCIsXG4gICAgICAgIHRlc3Q6IFwibnBtIHRlc3RcIixcbiAgICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VKc29uRmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwicGFja2FnZS5qc29uXCI7XG4gIGRlc2NyaXB0aW9uID1cbiAgICBcIlBhY2thZ2UgaW5mbyBjb250YWluaW5nIHRoZSBuZWNlc3NhcnkgY29tbWFuZHMgdG8gY29tcGlsZSB0byBXZWJBc3NlbWJseVwiO1xuICBwbSA9IFwibnBtXCI7XG4gIHBrZ09iaiA9IHtcbiAgICBzY3JpcHRzOiB7XG4gICAgICBcImxpbnQ6Zml4XCI6ICdhc2IgZm10IFwiYXNzZW1ibHkvKiovKi50c1wiJyxcbiAgICAgIHRlc3Q6IFwiYXNiIHRlc3QgLS0gLS12ZXJib3NlXCIsXG4gICAgICBcInRlc3Q6Y2lcIjogXCJhc2IgdGVzdCAtLSAtLXN1bW1hcnlcIixcbiAgICAgIFwiYnVpbGQ6dW50b3VjaGVkXCI6IFwiYXNiIGFzc2VtYmx5L2luZGV4LnRzIC0tdGFyZ2V0IGRlYnVnXCIsXG4gICAgICBcImJ1aWxkOm9wdGltaXplZFwiOiBcImFzYiBhc3NlbWJseS9pbmRleC50cyAtLXRhcmdldCByZWxlYXNlXCIsXG4gICAgICBidWlsZDogYCR7Z2V0UG1Db21tYW5kcygpLnJ1bn0gYnVpbGQ6dW50b3VjaGVkICYmICR7XG4gICAgICAgIGdldFBtQ29tbWFuZHMoKS5ydW5cbiAgICAgIH0gYnVpbGQ6b3B0aW1pemVkYCxcbiAgICB9LFxuICAgIGRldkRlcGVuZGVuY2llczoge1xuICAgICAgXCJAYXMtcGVjdC9jbGlcIjogXCJeXCIgKyBhc3BlY3RWZXJzaW9uLFxuICAgICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl40LjIyLjBcIixcbiAgICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl40LjIyLjBcIixcbiAgICAgIGFzc2VtYmx5c2NyaXB0OiBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbixcbiAgICAgIGFzYnVpbGQ6IFwibGF0ZXN0XCIsXG4gICAgICBlc2xpbnQ6IFwiXjcuMTcuMFwiLFxuICAgICAgdHlwZXNjcmlwdDogXCJeNC4yLjRcIixcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgXCJAYXNzZW1ibHlzY3JpcHQvbG9hZGVyXCI6IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uLFxuICAgIH0sXG4gIH07XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5wa2dPYmosIG51bGwsIDIpO1xuICB9XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBwa2dPbGRPYmogPSBKU09OLnBhcnNlKG9sZCk7XG4gICAgbGV0IHNjcmlwdHMgPSBwa2dPbGRPYmouc2NyaXB0cyB8fCB7fTtcbiAgICBpZiAoIXNjcmlwdHNbXCJidWlsZFwiXSkge1xuICAgICAgc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJidWlsZDp1bnRvdWNoZWRcIl07XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOm9wdGltaXplZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMuYnVpbGQ7XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG4gICAgaWYgKCFzY3JpcHRzW1widGVzdFwiXSB8fCBzY3JpcHRzW1widGVzdFwiXSA9PSBucG1EZWZhdWx0VGVzdCkge1xuICAgICAgc2NyaXB0c1tcInRlc3RcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzLnRlc3Q7XG4gICAgICBzY3JpcHRzW1widGVzdDpjaVwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJ0ZXN0OmNpXCJdO1xuICAgICAgcGtnT2xkT2JqW1wic2NyaXB0c1wiXSA9IHNjcmlwdHM7XG4gICAgfVxuXG4gICAgbGV0IGRlcGVuZGVuY2llcyA9IHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSB8fCB7fTtcbiAgICBpZiAoIWRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0pIHtcbiAgICAgIGRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0gPSBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbjtcbiAgICAgIHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSA9IGRlcGVuZGVuY2llcztcbiAgICB9XG5cbiAgICBsZXQgZGV2RGVwZW5kZW5jaWVzID0gcGtnT2xkT2JqW1wiZGV2RGVwZW5kZW5jaWVzXCJdIHx8IHt9O1xuICAgIGlmICghZGV2RGVwZW5kZW5jaWVzW1wiYXNzZW1ibHlzY3JpcHRcIl0pIHtcbiAgICAgIGRldkRlcGVuZGVuY2llc1tcImFzc2VtYmx5c2NyaXB0XCJdID0gXCJeXCIgKyBjb21waWxlclZlcnNpb247XG4gICAgICBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gPSBkZXZEZXBlbmRlbmNpZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBrZ09sZE9iaiwgbnVsbCwgMik7XG4gIH07XG59XG4iXX0=