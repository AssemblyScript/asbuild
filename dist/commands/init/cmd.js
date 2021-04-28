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
            var relativePath = file.getRelativePath(baseDir);
            switch (file.write(baseDir)) {
                case interfaces_1.InitResult.CREATED:
                    console.log("CREATED - " + relativePath);
                    break;
                case interfaces_1.InitResult.EXISTS:
                    console.log("EXISTS - " + relativePath);
                    break;
                case interfaces_1.InitResult.UPDATED:
                    console.log("UPDATED - " + relativePath);
                    break;
                default:
                    break;
            }
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY21kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2luaXQvY21kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFvQztBQUNwQywyQ0FBMEM7QUFDMUMsNkNBQTZDO0FBRWhDLFFBQUEsT0FBTyxHQUF3QjtJQUMxQyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFFBQVEsRUFBRSwrQ0FBK0M7SUFDekQsT0FBTyxFQUFFLFVBQUMsQ0FBQztRQUNULE9BQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsR0FBRztZQUNaLFdBQVcsRUFBRSw4Q0FBOEM7U0FDNUQsQ0FBQztJQUpGLENBSUU7SUFDSixPQUFPLEVBQUUsVUFBQyxJQUFJO1FBQ1osSUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQWlCLENBQUM7UUFDL0MsS0FBaUIsVUFBUyxFQUFULGNBQUEsaUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVMsRUFBRTtZQUF2QixJQUFJLElBQUksa0JBQUE7WUFDWCxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDM0IsS0FBSyx1QkFBVSxDQUFDLE9BQU87b0JBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBYSxZQUFjLENBQUMsQ0FBQztvQkFDekMsTUFBTTtnQkFDUixLQUFLLHVCQUFVLENBQUMsTUFBTTtvQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFZLFlBQWMsQ0FBQyxDQUFDO29CQUN4QyxNQUFNO2dCQUNSLEtBQUssdUJBQVUsQ0FBQyxPQUFPO29CQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWEsWUFBYyxDQUFDLENBQUM7b0JBQ3pDLE1BQU07Z0JBQ1I7b0JBQ0UsTUFBTTthQUNUO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhcmdzIGZyb20gXCJ5YXJnc1wiO1xuaW1wb3J0IHsgaW5pdEZpbGVzIH0gZnJvbSBcIi4vZmlsZXNcIjtcbmltcG9ydCB7IEluaXRSZXN1bHQgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG4vLyBpbXBvcnQgeyBJbml0UmVzdWx0IH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG5leHBvcnQgY29uc3QgSW5pdENtZDogeWFyZ3MuQ29tbWFuZE1vZHVsZSA9IHtcbiAgY29tbWFuZDogXCJpbml0IFtiYXNlRGlyXVwiLFxuICBkZXNjcmliZTogXCJDcmVhdGUgYSBuZXcgQVMgcGFja2FnZSBpbiBhbiBnaXZlbiBkaXJlY3RvcnlcIixcbiAgYnVpbGRlcjogKHkpID0+XG4gICAgeS5wb3NpdGlvbmFsKFwiYmFzZURpclwiLCB7XG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCIuXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJDcmVhdGUgYSBzYW1wbGUgQVMgcHJvamVjdCBpbiB0aGlzIGRpcmVjdG9yeVwiLFxuICAgIH0pLFxuICBoYW5kbGVyOiAoYXJncykgPT4ge1xuICAgIGNvbnN0IGJhc2VEaXI6IHN0cmluZyA9IGFyZ3MuYmFzZURpciBhcyBzdHJpbmc7XG4gICAgZm9yIChsZXQgZmlsZSBvZiBpbml0RmlsZXMpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGZpbGUuZ2V0UmVsYXRpdmVQYXRoKGJhc2VEaXIpO1xuICAgICAgc3dpdGNoIChmaWxlLndyaXRlKGJhc2VEaXIpKSB7XG4gICAgICAgIGNhc2UgSW5pdFJlc3VsdC5DUkVBVEVEOlxuICAgICAgICAgIGNvbnNvbGUubG9nKGBDUkVBVEVEIC0gJHtyZWxhdGl2ZVBhdGh9YCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgSW5pdFJlc3VsdC5FWElTVFM6XG4gICAgICAgICAgY29uc29sZS5sb2coYEVYSVNUUyAtICR7cmVsYXRpdmVQYXRofWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEluaXRSZXN1bHQuVVBEQVRFRDpcbiAgICAgICAgICBjb25zb2xlLmxvZyhgVVBEQVRFRCAtICR7cmVsYXRpdmVQYXRofWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn07XG4iXX0=