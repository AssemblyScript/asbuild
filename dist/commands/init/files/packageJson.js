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
var asc_1 = require("../../../../asc");
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
                lint: 'asb fmt "assembly/**/*.ts" --lint',
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
            if (!scripts["lint"] || scripts["lint"] == npmDefaultTest) {
                scripts["lint"] = _this.pkgObj.scripts.lint;
                scripts["lint:fix"] = _this.pkgObj.scripts["lint:fix"];
                pkgOldObj["scripts"] = scripts;
            }
            var dependencies = pkgOldObj["dependencies"] || {};
            for (var _i = 0, _a = Object.entries(_this.pkgObj.dependencies); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (!dependencies[key])
                    dependencies[key] = value;
            }
            pkgOldObj["dependencies"] = dependencies;
            var devDependencies = pkgOldObj["devDependencies"] || {};
            for (var _c = 0, _d = Object.entries(_this.pkgObj.devDependencies); _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], value = _e[1];
                if (!devDependencies[key])
                    devDependencies[key] = value;
            }
            pkgOldObj["devDependencies"] = devDependencies;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUM1RCx1Q0FBdUQ7QUFFdkQsdUJBQXVCO0FBQ3ZCLElBQU0sZUFBZSxHQUFHLGFBQVMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBRXJFLElBQU0sY0FBYyxHQUFHLDJDQUEyQyxDQUFDO0FBRW5FLElBQUssY0FJSjtBQUpELFdBQUssY0FBYztJQUNqQiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7QUFDZixDQUFDLEVBSkksY0FBYyxLQUFkLGNBQWMsUUFJbEI7QUFTRCxTQUFnQixLQUFLO0lBQ25CLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNmLElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixLQUFLLFFBQVEsRUFBRTtRQUN6RCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3RELEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDYjthQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0QsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO0tBQ0Y7SUFDRCxPQUFPLEVBQW9CLENBQUM7QUFDOUIsQ0FBQztBQVZELHNCQVVDO0FBRUQsU0FBZ0IsYUFBYTtJQUMzQixRQUFRLEtBQUssRUFBRSxFQUFFO1FBQ2YsS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixPQUFPO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVB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LENBQUM7UUFDNUMsQ0FBQyxDQUFDOztJQUNKLENBQUM7SUF0Q0Msb0NBQVUsR0FBVjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBb0NILHNCQUFDO0FBQUQsQ0FBQyxBQXBFRCxDQUFxQyxxQkFBUSxHQW9FNUM7QUFwRVksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIGFzcGVjdFZlcnNpb24gfSBmcm9tIFwiQGFzLXBlY3QvY2xpL2xpYlwiO1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBhc1ZlcnNpb24gfSBmcm9tIFwiLi4vLi4vLi4vLi4vYXNjXCI7XG5cbi8vIGFzLXBlY3QgbmVlZCBeMC4xOC43XG5jb25zdCBjb21waWxlclZlcnNpb24gPSBhc1ZlcnNpb24gPj0gXCIwLjE4LjdcIiA/IGFzVmVyc2lvbiA6IFwiMC4xOC43XCI7XG5cbmNvbnN0IG5wbURlZmF1bHRUZXN0ID0gJ2VjaG8gXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcIiAmJiBleGl0IDEnO1xuXG5lbnVtIFBhY2thZ2VNYW5hZ2VyIHtcbiAgTlBNID0gXCJucG1cIixcbiAgWWFybiA9IFwieWFyblwiLFxuICBQTlBNID0gXCJwbnBtXCIsXG59XG5cbmludGVyZmFjZSBQTUNvbW1hbmQge1xuICB0ZXN0OiBzdHJpbmc7XG4gIGluc3RhbGw6IHN0cmluZztcbiAgcGtnSW5zdGFsbDogc3RyaW5nO1xuICBydW46IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBtKCk6IFBhY2thZ2VNYW5hZ2VyIHtcbiAgbGV0IHBtID0gXCJucG1cIjtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoL1xcYnlhcm5cXC8vLnRlc3QocHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50KSkge1xuICAgICAgcG0gPSBcInlhcm5cIjtcbiAgICB9IGVsc2UgaWYgKC9cXGJwbnBtXFwvLy50ZXN0KHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCkpIHtcbiAgICAgIHBtID0gXCJwbnBtXCI7XG4gICAgfVxuICB9XG4gIHJldHVybiBwbSBhcyBQYWNrYWdlTWFuYWdlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBtQ29tbWFuZHMoKTogUE1Db21tYW5kIHtcbiAgc3dpdGNoIChnZXRQbSgpKSB7XG4gICAgY2FzZSBQYWNrYWdlTWFuYWdlci5QTlBNOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJwbnBtIGluc3RhbGxcIixcbiAgICAgICAgcGtnSW5zdGFsbDogXCJwbnBtIGFkZFwiLFxuICAgICAgICBydW46IFwicG5wbSBydW5cIixcbiAgICAgICAgdGVzdDogXCJwbnBtIHRlc3RcIixcbiAgICAgIH07XG5cbiAgICBjYXNlIFBhY2thZ2VNYW5hZ2VyLllhcm46XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbnN0YWxsOiBcInlhcm4gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcInlhcm4gYWRkXCIsXG4gICAgICAgIHJ1bjogXCJ5YXJuXCIsXG4gICAgICAgIHRlc3Q6IFwieWFybiB0ZXN0XCIsXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwibnBtIGluc3RhbGxcIixcbiAgICAgICAgcGtnSW5zdGFsbDogXCJucG0gaW5zdGFsbFwiLFxuICAgICAgICBydW46IFwibnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcIm5wbSB0ZXN0XCIsXG4gICAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvbkZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcInBhY2thZ2UuanNvblwiO1xuICBkZXNjcmlwdGlvbiA9XG4gICAgXCJQYWNrYWdlIGluZm8gY29udGFpbmluZyB0aGUgbmVjZXNzYXJ5IGNvbW1hbmRzIHRvIGNvbXBpbGUgdG8gV2ViQXNzZW1ibHlcIjtcbiAgcG0gPSBcIm5wbVwiO1xuICBwa2dPYmogPSB7XG4gICAgc2NyaXB0czoge1xuICAgICAgXCJsaW50OmZpeFwiOiAnYXNiIGZtdCBcImFzc2VtYmx5LyoqLyoudHNcIicsXG4gICAgICBsaW50OiAnYXNiIGZtdCBcImFzc2VtYmx5LyoqLyoudHNcIiAtLWxpbnQnLFxuICAgICAgdGVzdDogXCJhc2IgdGVzdCAtLSAtLXZlcmJvc2VcIixcbiAgICAgIFwidGVzdDpjaVwiOiBcImFzYiB0ZXN0IC0tIC0tc3VtbWFyeVwiLFxuICAgICAgXCJidWlsZDp1bnRvdWNoZWRcIjogXCJhc2IgYXNzZW1ibHkvaW5kZXgudHMgLS10YXJnZXQgZGVidWdcIixcbiAgICAgIFwiYnVpbGQ6b3B0aW1pemVkXCI6IFwiYXNiIGFzc2VtYmx5L2luZGV4LnRzIC0tdGFyZ2V0IHJlbGVhc2VcIixcbiAgICAgIGJ1aWxkOiBgJHtnZXRQbUNvbW1hbmRzKCkucnVufSBidWlsZDp1bnRvdWNoZWQgJiYgJHtcbiAgICAgICAgZ2V0UG1Db21tYW5kcygpLnJ1blxuICAgICAgfSBidWlsZDpvcHRpbWl6ZWRgLFxuICAgIH0sXG4gICAgZGV2RGVwZW5kZW5jaWVzOiB7XG4gICAgICBcIkBhcy1wZWN0L2NsaVwiOiBcIl5cIiArIGFzcGVjdFZlcnNpb24sXG4gICAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjQuMjIuMFwiLFxuICAgICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjQuMjIuMFwiLFxuICAgICAgYXNzZW1ibHlzY3JpcHQ6IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uLFxuICAgICAgYXNidWlsZDogXCJsYXRlc3RcIixcbiAgICAgIGVzbGludDogXCJeNy4xNy4wXCIsXG4gICAgICB0eXBlc2NyaXB0OiBcIl40LjIuNFwiLFxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIjogXCJeXCIgKyBjb21waWxlclZlcnNpb24sXG4gICAgfSxcbiAgfTtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnBrZ09iaiwgbnVsbCwgMik7XG4gIH1cbiAgdXBkYXRlT2xkQ29udGVudCA9IChvbGQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgbGV0IHBrZ09sZE9iaiA9IEpTT04ucGFyc2Uob2xkKTtcbiAgICBsZXQgc2NyaXB0cyA9IHBrZ09sZE9iai5zY3JpcHRzIHx8IHt9O1xuICAgIGlmICghc2NyaXB0c1tcImJ1aWxkXCJdKSB7XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6dW50b3VjaGVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZDpvcHRpbWl6ZWRcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdO1xuICAgICAgc2NyaXB0c1tcImJ1aWxkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0cy5idWlsZDtcbiAgICAgIHBrZ09sZE9ialtcInNjcmlwdHNcIl0gPSBzY3JpcHRzO1xuICAgIH1cbiAgICBpZiAoIXNjcmlwdHNbXCJ0ZXN0XCJdIHx8IHNjcmlwdHNbXCJ0ZXN0XCJdID09IG5wbURlZmF1bHRUZXN0KSB7XG4gICAgICBzY3JpcHRzW1widGVzdFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMudGVzdDtcbiAgICAgIHNjcmlwdHNbXCJ0ZXN0OmNpXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcInRlc3Q6Y2lcIl07XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG5cbiAgICBpZiAoIXNjcmlwdHNbXCJsaW50XCJdIHx8IHNjcmlwdHNbXCJsaW50XCJdID09IG5wbURlZmF1bHRUZXN0KSB7XG4gICAgICBzY3JpcHRzW1wibGludFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMubGludDtcbiAgICAgIHNjcmlwdHNbXCJsaW50OmZpeFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJsaW50OmZpeFwiXTtcbiAgICAgIHBrZ09sZE9ialtcInNjcmlwdHNcIl0gPSBzY3JpcHRzO1xuICAgIH1cblxuICAgIGxldCBkZXBlbmRlbmNpZXMgPSBwa2dPbGRPYmpbXCJkZXBlbmRlbmNpZXNcIl0gfHwge307XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5wa2dPYmouZGVwZW5kZW5jaWVzKSkge1xuICAgICAgaWYgKCFkZXBlbmRlbmNpZXNba2V5XSkgZGVwZW5kZW5jaWVzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcGtnT2xkT2JqW1wiZGVwZW5kZW5jaWVzXCJdID0gZGVwZW5kZW5jaWVzO1xuXG4gICAgbGV0IGRldkRlcGVuZGVuY2llcyA9IHBrZ09sZE9ialtcImRldkRlcGVuZGVuY2llc1wiXSB8fCB7fTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnBrZ09iai5kZXZEZXBlbmRlbmNpZXMpKSB7XG4gICAgICBpZiAoIWRldkRlcGVuZGVuY2llc1trZXldKSBkZXZEZXBlbmRlbmNpZXNba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gPSBkZXZEZXBlbmRlbmNpZXM7XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGtnT2xkT2JqLCBudWxsLCAyKTtcbiAgfTtcbn1cbiJdfQ==