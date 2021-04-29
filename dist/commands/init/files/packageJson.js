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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZUpzb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvaW5pdC9maWxlcy9wYWNrYWdlSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQXlDO0FBQ3pDLHdDQUE0RDtBQUU1RCw4Q0FBb0U7QUFFcEUsSUFBTSxjQUFjLEdBQUcsMkNBQTJDLENBQUM7QUFFbkUsSUFBSyxjQUlKO0FBSkQsV0FBSyxjQUFjO0lBQ2pCLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtBQUNmLENBQUMsRUFKSSxjQUFjLEtBQWQsY0FBYyxRQUlsQjtBQVFELFNBQWdCLEtBQUs7SUFDbkIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2YsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEtBQUssUUFBUSxFQUFFO1FBQ3pELElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDdEQsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNiO2FBQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsRUFBRTtZQUM3RCxFQUFFLEdBQUcsTUFBTSxDQUFDO1NBQ2I7S0FDRjtJQUNELE9BQU8sRUFBb0IsQ0FBQztBQUM5QixDQUFDO0FBVkQsc0JBVUM7QUFFRCxTQUFnQixhQUFhO0lBQzNCLFFBQVEsS0FBSyxFQUFFLEVBQUU7UUFDZixLQUFLLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLEdBQUcsRUFBRSxVQUFVO2dCQUNmLElBQUksRUFBRSxXQUFXO2FBQ2xCLENBQUM7UUFFSixLQUFLLGNBQWMsQ0FBQyxJQUFJO1lBQ3RCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGNB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UyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDOztJQUNKLENBQUM7SUFoQ0Msb0NBQVUsR0FBVjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBOEJILHNCQUFDO0FBQUQsQ0FBQyxBQXZERCxDQUFxQyxxQkFBUSxHQXVENUM7QUF2RFksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbml0RmlsZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIGFzcGVjdFZlcnNpb24gfSBmcm9tIFwiQGFzLXBlY3QvY2xpL2xpYlwiO1xuXG5pbXBvcnQgeyB2ZXJzaW9uIGFzIGNvbXBpbGVyVmVyc2lvbiB9IGZyb20gXCJhc3NlbWJseXNjcmlwdC9jbGkvYXNjXCI7XG5cbmNvbnN0IG5wbURlZmF1bHRUZXN0ID0gJ2VjaG8gXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcIiAmJiBleGl0IDEnO1xuXG5lbnVtIFBhY2thZ2VNYW5hZ2VyIHtcbiAgTlBNID0gXCJucG1cIixcbiAgWWFybiA9IFwieWFyblwiLFxuICBQTlBNID0gXCJwbnBtXCIsXG59XG5cbmludGVyZmFjZSBQTUNvbW1hbmQge1xuICB0ZXN0OiBzdHJpbmc7XG4gIGluc3RhbGw6IHN0cmluZztcbiAgcnVuOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbSgpOiBQYWNrYWdlTWFuYWdlciB7XG4gIGxldCBwbSA9IFwibnBtXCI7XG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYubnBtX2NvbmZpZ191c2VyX2FnZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKC9cXGJ5YXJuXFwvLy50ZXN0KHByb2Nlc3MuZW52Lm5wbV9jb25maWdfdXNlcl9hZ2VudCkpIHtcbiAgICAgIHBtID0gXCJ5YXJuXCI7XG4gICAgfSBlbHNlIGlmICgvXFxicG5wbVxcLy8udGVzdChwcm9jZXNzLmVudi5ucG1fY29uZmlnX3VzZXJfYWdlbnQpKSB7XG4gICAgICBwbSA9IFwicG5wbVwiO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcG0gYXMgUGFja2FnZU1hbmFnZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbUNvbW1hbmRzKCk6IFBNQ29tbWFuZCB7XG4gIHN3aXRjaCAoZ2V0UG0oKSkge1xuICAgIGNhc2UgUGFja2FnZU1hbmFnZXIuUE5QTTpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwicG5wbSBpbnN0YWxsXCIsXG4gICAgICAgIHJ1bjogXCJwbnBtIHJ1blwiLFxuICAgICAgICB0ZXN0OiBcInBucG0gdGVzdFwiLFxuICAgICAgfTtcblxuICAgIGNhc2UgUGFja2FnZU1hbmFnZXIuWWFybjpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwieWFybiBpbnN0YWxsXCIsXG4gICAgICAgIHJ1bjogXCJ5YXJuXCIsXG4gICAgICAgIHRlc3Q6IFwieWFybiB0ZXN0XCIsXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGluc3RhbGw6IFwibnBtIGluc3RhbGxcIixcbiAgICAgICAgcnVuOiBcIm5wbSBydW5cIixcbiAgICAgICAgdGVzdDogXCJucG0gdGVzdFwiLFxuICAgICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFja2FnZUpzb25GaWxlIGV4dGVuZHMgSW5pdEZpbGUge1xuICBwYXRoID0gXCJwYWNrYWdlLmpzb25cIjtcbiAgZGVzY3JpcHRpb24gPVxuICAgIFwiUGFja2FnZSBpbmZvIGNvbnRhaW5pbmcgdGhlIG5lY2Vzc2FyeSBjb21tYW5kcyB0byBjb21waWxlIHRvIFdlYkFzc2VtYmx5XCI7XG4gIHBtID0gXCJucG1cIjtcbiAgcGtnT2JqID0ge1xuICAgIHNjcmlwdHM6IHtcbiAgICAgIHRlc3Q6IFwiYXNiIHRlc3QgLS0gLS12ZXJib3NlXCIsXG4gICAgICBcInRlc3Q6Y2lcIjogXCJhc2IgdGVzdCAtLSAtLXN1bW1hcnlcIixcbiAgICAgIFwiYnVpbGQ6dW50b3VjaGVkXCI6IFwiYXNiIGFzc2VtYmx5L2luZGV4LnRzIC0tdGFyZ2V0IGRlYnVnXCIsXG4gICAgICBcImJ1aWxkOm9wdGltaXplZFwiOiBcImFzYiBhc3NlbWJseS9pbmRleC50cyAtLXRhcmdldCByZWxlYXNlXCIsXG4gICAgICBidWlsZDogYCR7Z2V0UG1Db21tYW5kcygpLnJ1bn0gYnVpbGQ6dW50b3VjaGVkICYmICR7XG4gICAgICAgIGdldFBtQ29tbWFuZHMoKS5ydW5cbiAgICAgIH0gYnVpbGQ6b3B0aW1pemVkYCxcbiAgICB9LFxuICAgIGRldkRlcGVuZGVuY2llczoge1xuICAgICAgXCJAYXMtcGVjdC9jbGlcIjogXCJeXCIgKyBhc3BlY3RWZXJzaW9uLFxuICAgICAgYXNzZW1ibHlzY3JpcHQ6IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uLFxuICAgIH0sXG4gICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICBcIkBhc3NlbWJseXNjcmlwdC9sb2FkZXJcIjogXCJeXCIgKyBjb21waWxlclZlcnNpb24sXG4gICAgfSxcbiAgfTtcbiAgZ2V0Q29udGVudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnBrZ09iaiwgbnVsbCwgMik7XG4gIH1cbiAgdXBkYXRlT2xkQ29udGVudCA9IChvbGQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgbGV0IHBrZ09sZE9iaiA9IEpTT04ucGFyc2Uob2xkKTtcbiAgICBsZXQgc2NyaXB0cyA9IHBrZ09sZE9iai5zY3JpcHRzIHx8IHt9O1xuICAgIGlmICghc2NyaXB0c1tcImJ1aWxkXCJdKSB7XG4gICAgICBzY3JpcHRzW1wiYnVpbGQ6dW50b3VjaGVkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcImJ1aWxkOnVudG91Y2hlZFwiXTtcbiAgICAgIHNjcmlwdHNbXCJidWlsZDpvcHRpbWl6ZWRcIl0gPSB0aGlzLnBrZ09iai5zY3JpcHRzW1wiYnVpbGQ6b3B0aW1pemVkXCJdO1xuICAgICAgc2NyaXB0c1tcImJ1aWxkXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0cy5idWlsZDtcbiAgICAgIHBrZ09sZE9ialtcInNjcmlwdHNcIl0gPSBzY3JpcHRzO1xuICAgIH1cbiAgICBpZiAoIXNjcmlwdHNbXCJ0ZXN0XCJdIHx8IHNjcmlwdHNbXCJ0ZXN0XCJdID09IG5wbURlZmF1bHRUZXN0KSB7XG4gICAgICBzY3JpcHRzW1widGVzdFwiXSA9IHRoaXMucGtnT2JqLnNjcmlwdHMudGVzdDtcbiAgICAgIHNjcmlwdHNbXCJ0ZXN0OmNpXCJdID0gdGhpcy5wa2dPYmouc2NyaXB0c1tcInRlc3Q6Y2lcIl07XG4gICAgICBwa2dPbGRPYmpbXCJzY3JpcHRzXCJdID0gc2NyaXB0cztcbiAgICB9XG5cbiAgICBsZXQgZGVwZW5kZW5jaWVzID0gcGtnT2xkT2JqW1wiZGVwZW5kZW5jaWVzXCJdIHx8IHt9O1xuICAgIGlmICghZGVwZW5kZW5jaWVzW1wiQGFzc2VtYmx5c2NyaXB0L2xvYWRlclwiXSkge1xuICAgICAgZGVwZW5kZW5jaWVzW1wiQGFzc2VtYmx5c2NyaXB0L2xvYWRlclwiXSA9IFwiXlwiICsgY29tcGlsZXJWZXJzaW9uO1xuICAgICAgcGtnT2xkT2JqW1wiZGVwZW5kZW5jaWVzXCJdID0gZGVwZW5kZW5jaWVzO1xuICAgIH1cblxuICAgIGxldCBkZXZEZXBlbmRlbmNpZXMgPSBwa2dPbGRPYmpbXCJkZXZEZXBlbmRlbmNpZXNcIl0gfHwge307XG4gICAgaWYgKCFkZXZEZXBlbmRlbmNpZXNbXCJhc3NlbWJseXNjcmlwdFwiXSkge1xuICAgICAgZGV2RGVwZW5kZW5jaWVzW1wiYXNzZW1ibHlzY3JpcHRcIl0gPSBcIl5cIiArIGNvbXBpbGVyVmVyc2lvbjtcbiAgICAgIHBrZ09sZE9ialtcImRldkRlcGVuZGVuY2llc1wiXSA9IGRldkRlcGVuZGVuY2llcztcbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGtnT2xkT2JqLCBudWxsLCAyKTtcbiAgfTtcbn1cbiJdfQ==