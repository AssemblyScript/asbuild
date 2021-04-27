"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCmd = void 0;
var cli_1 = require("@as-pect/cli");
var testCmdUsage = "$0 test\nRun as-pect tests\n\nUSAGE:\n    $0 test [options] -- [aspect_options]";
exports.TestCmd = {
    command: "test",
    describe: "Run as-pect tests",
    builder: function (y) {
        return y.usage(testCmdUsage).option("verbose", {
            alias: ["vv"],
            default: false,
            boolean: true,
            description: "Print out arguments passed to as-pect",
        });
    },
    handler: function (args) {
        var aspectArgs = args["_"].slice(1);
        aspectArgs.push("--nologo");
        if (args.verbose) {
            console.log(aspectArgs);
        }
        cli_1.asp(aspectArgs);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUFtQztBQUVuQyxJQUFNLFlBQVksR0FBRyxpRkFJcUIsQ0FBQztBQUU5QixRQUFBLE9BQU8sR0FBd0I7SUFDMUMsT0FBTyxFQUFFLE1BQU07SUFDZixRQUFRLEVBQUUsbUJBQW1CO0lBQzdCLE9BQU8sRUFBRSxVQUFDLENBQUM7UUFDVCxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHVDQUF1QztTQUNyRCxDQUFDO0lBTEYsQ0FLRTtJQUNKLE9BQU8sRUFBRSxVQUFDLElBQUk7UUFDWixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDekI7UUFDRCxTQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcbmltcG9ydCB7IGFzcCB9IGZyb20gXCJAYXMtcGVjdC9jbGlcIjtcblxuY29uc3QgdGVzdENtZFVzYWdlID0gYCQwIHRlc3RcblJ1biBhcy1wZWN0IHRlc3RzXG5cblVTQUdFOlxuICAgICQwIHRlc3QgW29wdGlvbnNdIC0tIFthc3BlY3Rfb3B0aW9uc11gO1xuXG5leHBvcnQgY29uc3QgVGVzdENtZDogeWFyZ3MuQ29tbWFuZE1vZHVsZSA9IHtcbiAgY29tbWFuZDogXCJ0ZXN0XCIsXG4gIGRlc2NyaWJlOiBcIlJ1biBhcy1wZWN0IHRlc3RzXCIsXG4gIGJ1aWxkZXI6ICh5KSA9PlxuICAgIHkudXNhZ2UodGVzdENtZFVzYWdlKS5vcHRpb24oXCJ2ZXJib3NlXCIsIHtcbiAgICAgIGFsaWFzOiBbXCJ2dlwiXSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgYm9vbGVhbjogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlByaW50IG91dCBhcmd1bWVudHMgcGFzc2VkIHRvIGFzLXBlY3RcIixcbiAgICB9KSxcbiAgaGFuZGxlcjogKGFyZ3MpID0+IHtcbiAgICBjb25zdCBhc3BlY3RBcmdzID0gYXJnc1tcIl9cIl0uc2xpY2UoMSk7XG4gICAgYXNwZWN0QXJncy5wdXNoKFwiLS1ub2xvZ29cIik7XG4gICAgaWYgKGFyZ3MudmVyYm9zZSkge1xuICAgICAgY29uc29sZS5sb2coYXNwZWN0QXJncyk7XG4gICAgfVxuICAgIGFzcChhc3BlY3RBcmdzKTtcbiAgfSxcbn07Il19