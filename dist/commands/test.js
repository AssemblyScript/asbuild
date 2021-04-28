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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUFtQztBQUVuQyxJQUFNLFlBQVksR0FBRyxpRkFJcUIsQ0FBQztBQUU5QixRQUFBLE9BQU8sR0FBd0I7SUFDMUMsT0FBTyxFQUFFLE1BQU07SUFDZixRQUFRLEVBQUUsbUJBQW1CO0lBQzdCLE9BQU8sRUFBRSxVQUFDLENBQUM7UUFDVCxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN0QyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHVDQUF1QztTQUNyRCxDQUFDO0lBTEYsQ0FLRTtJQUNKLE9BQU8sRUFBRSxVQUFDLElBQUk7UUFDWixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDekI7UUFDRCxTQUFHLENBQUMsVUFBc0IsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQgeyBhc3AgfSBmcm9tIFwiQGFzLXBlY3QvY2xpXCI7XG5cbmNvbnN0IHRlc3RDbWRVc2FnZSA9IGAkMCB0ZXN0XG5SdW4gYXMtcGVjdCB0ZXN0c1xuXG5VU0FHRTpcbiAgICAkMCB0ZXN0IFtvcHRpb25zXSAtLSBbYXNwZWN0X29wdGlvbnNdYDtcblxuZXhwb3J0IGNvbnN0IFRlc3RDbWQ6IHlhcmdzLkNvbW1hbmRNb2R1bGUgPSB7XG4gIGNvbW1hbmQ6IFwidGVzdFwiLFxuICBkZXNjcmliZTogXCJSdW4gYXMtcGVjdCB0ZXN0c1wiLFxuICBidWlsZGVyOiAoeSkgPT5cbiAgICB5LnVzYWdlKHRlc3RDbWRVc2FnZSkub3B0aW9uKFwidmVyYm9zZVwiLCB7XG4gICAgICBhbGlhczogW1widnZcIl0sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGJvb2xlYW46IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogXCJQcmludCBvdXQgYXJndW1lbnRzIHBhc3NlZCB0byBhcy1wZWN0XCIsXG4gICAgfSksXG4gIGhhbmRsZXI6IChhcmdzKSA9PiB7XG4gICAgY29uc3QgYXNwZWN0QXJncyA9IGFyZ3NbXCJfXCJdLnNsaWNlKDEpO1xuICAgIGFzcGVjdEFyZ3MucHVzaChcIi0tbm9sb2dvXCIpO1xuICAgIGlmIChhcmdzLnZlcmJvc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKGFzcGVjdEFyZ3MpO1xuICAgIH1cbiAgICBhc3AoYXNwZWN0QXJncyBhcyBzdHJpbmdbXSk7XG4gIH0sXG59OyJdfQ==