"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCmd = void 0;
var files_1 = require("./files");
var interfaces_1 = require("./interfaces");
// import { InitResult } from "./interfaces";
exports.InitCmd = {
    command: "init [baseDir]",
    describe: "Create a new AS package in an given directory",
    builder: function (y) {
        return y.positional("baseDir", {
            type: "string",
            default: ".",
            description: "Create a sample AS project in this directory",
        });
    },
    handler: function (args) {
        var baseDir = args.baseDir;
        for (var _i = 0, initFiles_1 = files_1.initFiles; _i < initFiles_1.length; _i++) {
            var file = initFiles_1[_i];
            switch (file.write(baseDir)) {
                case interfaces_1.InitResult.CREATED:
                    console.log("CREATED - " + file.path);
                    break;
                case interfaces_1.InitResult.EXISTS:
                    console.log("EXISTS - " + file.path);
                    break;
                case interfaces_1.InitResult.UPDATED:
                    console.log("UPDATED - " + file.path);
                    break;
                default:
                    break;
            }
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2luaXQvY21kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFvQztBQUNwQywyQ0FBMEM7QUFDMUMsNkNBQTZDO0FBRWhDLFFBQUEsT0FBTyxHQUF3QjtJQUMxQyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFFBQVEsRUFBRSwrQ0FBK0M7SUFDekQsT0FBTyxFQUFFLFVBQUMsQ0FBQztRQUNULE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsR0FBRztZQUNaLFdBQVcsRUFBRSw4Q0FBOEM7U0FDNUQsQ0FBQztJQUpGLENBSUU7SUFDSixPQUFPLEVBQUUsVUFBQyxJQUFJO1FBQ1osSUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQWlCLENBQUM7UUFDL0MsS0FBaUIsVUFBUyxFQUFULGNBQUEsaUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVMsRUFBRTtZQUF2QixJQUFJLElBQUksa0JBQUE7WUFDWCxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLEtBQUssdUJBQVUsQ0FBQyxPQUFPO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWEsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO29CQUN0QyxNQUFNO2dCQUNSLEtBQUssdUJBQVUsQ0FBQyxNQUFNO29CQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQVksSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO29CQUNyQyxNQUFNO2dCQUNSLEtBQUssdUJBQVUsQ0FBQyxPQUFPO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWEsSUFBSSxDQUFDLElBQU0sQ0FBQyxDQUFDO29CQUN0QyxNQUFNO2dCQUVSO29CQUNFLE1BQU07YUFDVDtTQUNGO0lBQ0gsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGluaXRGaWxlcyB9IGZyb20gXCIuL2ZpbGVzXCI7XG5pbXBvcnQgeyBJbml0UmVzdWx0IH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuLy8gaW1wb3J0IHsgSW5pdFJlc3VsdCB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuZXhwb3J0IGNvbnN0IEluaXRDbWQ6IHlhcmdzLkNvbW1hbmRNb2R1bGUgPSB7XG4gIGNvbW1hbmQ6IFwiaW5pdCBbYmFzZURpcl1cIixcbiAgZGVzY3JpYmU6IFwiQ3JlYXRlIGEgbmV3IEFTIHBhY2thZ2UgaW4gYW4gZ2l2ZW4gZGlyZWN0b3J5XCIsXG4gIGJ1aWxkZXI6ICh5KSA9PlxuICAgIHkucG9zaXRpb25hbChcImJhc2VEaXJcIiwge1xuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiLlwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiQ3JlYXRlIGEgc2FtcGxlIEFTIHByb2plY3QgaW4gdGhpcyBkaXJlY3RvcnlcIixcbiAgICB9KSxcbiAgaGFuZGxlcjogKGFyZ3MpID0+IHtcbiAgICBjb25zdCBiYXNlRGlyOiBzdHJpbmcgPSBhcmdzLmJhc2VEaXIgYXMgc3RyaW5nO1xuICAgIGZvciAobGV0IGZpbGUgb2YgaW5pdEZpbGVzKSB7XG4gICAgICBzd2l0Y2ggKGZpbGUud3JpdGUoYmFzZURpcikpIHtcbiAgICAgICAgY2FzZSBJbml0UmVzdWx0LkNSRUFURUQ6XG4gICAgICAgICAgY29uc29sZS5sb2coYENSRUFURUQgLSAke2ZpbGUucGF0aH1gKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBJbml0UmVzdWx0LkVYSVNUUzpcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRVhJU1RTIC0gJHtmaWxlLnBhdGh9YCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSW5pdFJlc3VsdC5VUERBVEVEOlxuICAgICAgICAgIGNvbnNvbGUubG9nKGBVUERBVEVEIC0gJHtmaWxlLnBhdGh9YCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59O1xuIl19