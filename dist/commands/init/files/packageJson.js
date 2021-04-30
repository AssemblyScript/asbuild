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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUU1RCw4Q0FBOEQ7QUFFOUQsdUJBQXVCO0FBQ3ZCLElBQU0sZUFBZSxHQUFHLGFBQVMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBRXJFLElBQU0sY0FBYyxHQUFHLDJDQUEyQyxDQUFDO0FBRW5FLElBQUssY0FJSjtBQUpELFdBQUssY0FBYztJQUNqQiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7QUFDZixDQUFDLEVBSkksY0FBYyxLQUFkLGNBQWMsUUFJbEI7QUFTRCxTQUFnQixLQUFLO0lBQ25CLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNmLElBQUksT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixLQUFLLFFBQVEsRUFBRTtRQUN6RCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3RELEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDYjthQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0QsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO0tBQ0Y7SUFDRCxPQUFPLEVBQW9CLENBQUM7QUFDOUIsQ0FBQztBQVZELHNCQVVDO0FBRUQsU0FBZ0IsYUFBYTtJQUMzQixRQUFRLEtBQUssRUFBRSxFQUFFO1FBQ2YsS0FBSyxjQUFjLENBQUMsSUFBSTtZQUN0QixPQUFPO2dCQUNMLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsR0FBRyxFQUFFLFVBQVU7Z0JBQ2YsSUFBSSxFQUFFLFdBQVc7YUFDbEIsQ0FBQztRQUVKLEtBQUssY0FBYyxDQUFDLElBQUk7WUFDdEIsT0FBTztnQkFDTCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLEdBQUcsRUFBRSxNQUFNO2dCQUNYLElBQUksRUFBRSxXQUFXO2FBQ2xCLENBQUM7UUFFSjtZQUNFLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFVBQVUsRUFBRSxhQUFhO2dCQUN6QixHQUFHLEVBQUUsU0FBUztnQkFDZCxJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDO0tBQ0w7QUFDSCxDQUFDO0FBMUJELHNDQTBCQztBQUVEO0lBQXFDLG1DQUFRO0lBQTdDO1FBQUEscUVBNERDO1FBM0RDLFVBQUksR0FBRyxjQUFjLENBQUM7UUFDdEIsaUJBQVcsR0FDVCwwRUFBMEUsQ0FBQztRQUM3RSxRQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ1gsWUFBTSxHQUFHO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLFVBQVUsRUFBRSw0QkFBNEI7Z0JBQ3hDLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLFNBQVMsRUFBRSx1QkFBdUI7Z0JBQ2xDLGlCQUFpQixFQUFFLHNDQUFzQztnQkFDekQsaUJBQWlCLEVBQUUsd0NBQXdDO2dCQUMzRCxLQUFLLEVBQUssYUFBYSxFQUFFLENBQUMsR0FBRyw0QkFDM0IsYUFBYSxFQUFFLENBQUMsR0FBRyxxQkFDSDthQUNuQjtZQUNELGVBQWUsRUFBRTtnQkFDZixjQUFjLEVBQUUsR0FBRyxHQUFHLGFBQWE7Z0JBQ25DLGtDQUFrQyxFQUFFLFNBQVM7Z0JBQzdDLDJCQUEyQixFQUFFLFNBQVM7Z0JBQ3RDLGNBQWMsRUFBRSxHQUFHLEdBQUcsZUFBZTtnQkFDckMsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFVBQVUsRUFBRSxRQUFRO2FBQ3JCO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLHdCQUF3QixFQUFFLEdBQUcsR0FBRyxlQUFlO2FBQ2hEO1NBQ0YsQ0FBQztRQUlGLHNCQUFnQixHQUFHLFVBQUMsR0FBVztZQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3BFLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUM7YUFDaEM7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxjQUFjLEVBQUU7Z0JBQ3pELE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDcEQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQzthQUNoQztZQUVELElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFO2dCQUMzQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsR0FBRyxHQUFHLEdBQUcsZUFBZSxDQUFDO2dCQUMvRCxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsWUFBWSxDQUFDO2FBQzFDO1lBRUQsSUFBSSxlQUFlLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pELElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtnQkFDdEMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxHQUFHLGVBQWUsQ0FBQztnQkFDMUQsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsZUFBZSxDQUFDO2FBQ2hEO1lBRUQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDOztJQUNKLENBQUM7SUFoQ0Msb0NBQVUsR0FBVjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBOEJILHNCQUFDO0FBQUQsQ0FBQyxBQTVERCxDQUFxQyxxQkFBUSxHQTRENUM7QUE1RFksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIGFzcGVjdFZlcnNpb24gfSBmcm9tIFwiQGFzLXBlY3QvY2xpL2xpYlwiO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIGFzIGFzVmVyc2lvbiB9IGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvYXNjXCI7XG5cbi8vIGFzLXBlY3QgbmVlZCBeMC4xOC43XG5jb25zdCBjb21waWxlclZlcnNpb24gPSBhc1ZlcnNpb24gPj0gXCIwLjE4LjdcIiA/IGFzVmVyc2lvbiA6IFwiMC4xOC43XCI7XG5cbmNvbnN0IG5wbURlZmF1bHRUZXN0ID0gJ2VjaG8gXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcIiAmJiBleGl0IDEnO1xuXG5lbnVtIFBhY2thZ2VNYW5hZ2VyIHtcbiAgTlBNID0gXCJucG1cIixcbiAgWWFybiA9IFwieWFyblwiLFxuICBQTlBNID0gXCJwbnBtXCIsXG59XG5cbmludGVyZmFjZSBQTUNvbW1hbmQge1xuICB0ZXN0OiBzdHJpbmc7XG4gIGluc3RhbGw6IHN0cmluZztcbiAgcGtnSW5zdGFsbDogc3RyaW5nO1xuICBydW46IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBtKCk6IFBhY2thZ2VNYW5hZ2VyIHtcbiAgbGV0IHBtID0gXCJucG1cIjtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoL1xcYnlhcm5cXC8vLnRlc3QocHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50KSkge1xuICAgICAgcG0gPSBcInlhcm5cIjtcbiAgICB9IGVsc2UgaWYgKC9cXGJwbnBtXFwvLy50ZXN0KHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCkpIHtcbiAgICAgIHBtID0gXCJwbnBtXCI7XG4gICAgfVxuICB9XG4gIHJldHVybiBwbSBhcyBQYWNrYWdlTWFuYWdlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBtQ29tbWFuZHMoKTogUE1Db21tYW5kIHtcbiAgc3dpdGNoIChnZXRQbSgpKSB7XG4gICAgY2FzZSBQYWNrYWdlTWFuYWdlci5QTlBNOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5zdGFsbDogXCJwbnBtIGluc3RhbGxcIixcbiAgICAgICAgcGtnSW5zdGFsbDogXCJwbnBtIGFkZFwiLFxuICAgICAgICBydW46IFwicG5wbSBydW5cIixcbiAgICAgICAgdGVzdDogXCJwbnBtIHRlc3RcIixcbiAgICAgIH07XG5cbiAgICBjYXNlIFBhY2thZ2VNYW5hZ2VyLllhcm46XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbnN0YWxsOiBcInlhcm4gaW5zdGFsbFwiLFxuICAgICAgICBwa2dJbnN0YWxsOiBcInlhcm4gYWRkXCIsXG4gICAgICAgIHJ1bjogXCJ5YXJuXCIsXG4gICAgICAgIHRlc3Q6IFwieWFybiB0ZXN0XCIsXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwibnBtIGluc3RhbGxcIixcbiAgICAgICAgcGtnSW5zdGFsbDogXCJucG0gaW5zdGFsbFwiLFxuICAgICAgICBydW46IFwibnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcIm5wbSB0ZXN0XCIsXG4gICAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvbkZpbGUgZXh0ZW5kcyBJbml0RmlsZSB7XG4gIHBhdGggPSBcInBhY2thZ2UuanNvblwiO1xuICBkZXNjcmlwdGlvbiA9XG4gICAgXCJQYWNrYWdlIGluZm8gY29udGFpbmluZyB0aGUgbmVjZXNzYXJ5IGNvbW1hbmRzIHRvIGNvbXBpbGUgdG8gV2ViQXNzZW1ibHlcIjtcbiAgcG0gPSBcIm5wbVwiO1xuICBwa2dPYmogPSB7XG4gICAgc2NyaXB0czoge1xuICAgICAgXCJsaW50OmZpeFwiOiAnYXNiIGZtdCBcImFzc2VtYmx5LyoqLyoudHNcIicsXG4gICAgICB0ZXN0OiBcImFzYiB0ZXN0IC0tIC0tdmVyYm9zZVwiLFxuICAgICAgXCJ0ZXN0OmNpXCI6IFwiYXNiIHRlc3QgLS0gLS1zdW1tYXJ5XCIsXG4gICAgICBcImJ1aWxkOnVudG91Y2hlZFwiOiBcImFzYiBhc3NlbWJseS9pbmRleC50cyAtLXRhcmdldCBkZWJ1Z1wiLFxuICAgICAgXCJidWlsZDpvcHRpbWl6ZWRcIjogXCJhc2IgYXNzZW1ibHkvaW5kZXgudHMgLS10YXJnZXQgcmVsZWFzZVwiLFxuICAgICAgYnVpbGQ6IGAke2dldFBtQ29tbWFuZHMoKS5ydW59IGJ1aWxkOnVudG91Y2hlZCAmJiAke1xuICAgICAgICBnZXRQbUNvbW1hbmRzKCkucnVuXG4gICAgICB9IGJ1aWxkOm9wdGltaXplZGAsXG4gICAgfSxcbiAgICBkZXZEZXBlbmRlbmNpZXM6IHtcbiAgICAgIFwiQGFzLXBlY3QvY2xpXCI6IFwiXlwiICsgYXNwZWN0VmVyc2lvbixcbiAgICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNC4yMi4wXCIsXG4gICAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNC4yMi4wXCIsXG4gICAgICBhc3NlbWJseXNjcmlwdDogXCJeXCIgKyBjb21waWxlclZlcnNpb24sXG4gICAgICBlc2xpbnQ6IFwiXjcuMTcuMFwiLFxuICAgICAgdHlwZXNjcmlwdDogXCJeNC4yLjRcIixcbiAgICB9LFxuICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgXCJAYXNzZW1ibHlzY3JpcHQvbG9hZGVyXCI6IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uLFxuICAgIH0sXG4gIH07XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5wa2dPYmosIG51bGwsIDIpO1xuICB9XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSAob2xkOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGxldCBwa2dPbGRPYmogPSBKU09OLnBhcnNlKG9sZCk7XG4gICAgbGV0IHNjcmlwdHMgPSBwa2dPbGRPYmouc2NyaXB0cyB8fCB7fTtcbiAgICBpZiAoIXNjcmlwdHNbXCJidWlsZFwiXSkge1xuICAgICAgc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJidWlsZDp1bnRvdWNoZWRcIl07XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOm9wdGltaXplZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMuYnVpbGQ7XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG4gICAgaWYgKCFzY3JpcHRzW1widGVzdFwiXSB8fCBzY3JpcHRzW1widGVzdFwiXSA9PSBucG1EZWZhdWx0VGVzdCkge1xuICAgICAgc2NyaXB0c1tcInRlc3RcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzLnRlc3Q7XG4gICAgICBzY3JpcHRzW1widGVzdDpjaVwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHNbXCJ0ZXN0OmNpXCJdO1xuICAgICAgcGtnT2xkT2JqW1wic2NyaXB0c1wiXSA9IHNjcmlwdHM7XG4gICAgfVxuXG4gICAgbGV0IGRlcGVuZGVuY2llcyA9IHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSB8fCB7fTtcbiAgICBpZiAoIWRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0pIHtcbiAgICAgIGRlcGVuZGVuY2llc1tcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIl0gPSBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbjtcbiAgICAgIHBrZ09sZE9ialtcImRlcGVuZGVuY2llc1wiXSA9IGRlcGVuZGVuY2llcztcbiAgICB9XG5cbiAgICBsZXQgZGV2RGVwZW5kZW5jaWVzID0gcGtnT2xkT2JqW1wiZGV2RGVwZW5kZW5jaWVzXCJdIHx8IHt9O1xuICAgIGlmICghZGV2RGVwZW5kZW5jaWVzW1wiYXNzZW1ibHlzY3JpcHRcIl0pIHtcbiAgICAgIGRldkRlcGVuZGVuY2llc1tcImFzc2VtYmx5c2NyaXB0XCJdID0gXCJeXCIgKyBjb21waWxlclZlcnNpb247XG4gICAgICBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gPSBkZXZEZXBlbmRlbmNpZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBrZ09sZE9iaiwgbnVsbCwgMik7XG4gIH07XG59XG4iXX0=