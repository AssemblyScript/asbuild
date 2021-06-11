"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var yargs = __importStar(require("yargs"));
var commands_1 = require("./commands");
var utils_1 = require("./utils");
function main(cli, options, callback) {
    if (options === void 0) { options = {}; }
    utils_1.setGlobalAscOptions(options);
    utils_1.setGlobalCliCallback(callback);
    yargs
        .usage("Build tool for AssemblyScript projects.\n\nUsage:\n  asb [command] [options]")
        // To ensure backward compatibility, a default command delegating to BuildCmd.handler
        .command("$0", "Alias of build command, to maintain back-ward compatibility", function (y) {
        return commands_1.buildCmdBuilder(y)
            // explicitly hide options help to encourage users to use build cmd
            .hide("config")
            .hide("baseDir")
            .hide("wat")
            .hide("target")
            .hide("outDir")
            .hide("verbose");
    }, commands_1.BuildCmd.handler)
        .command(commands_1.BuildCmd)
        .command(commands_1.InitCmd)
        .command(commands_1.TestCmd)
        .command(commands_1.FmtCmd)
        .command(commands_1.RunCmd)
        .help()
        .scriptName("asb")
        .parse(cli);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQStCO0FBQy9CLHVDQU9vQjtBQUVwQixpQ0FBb0U7QUFFcEUsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QiwyQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3Qiw0QkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvQixLQUFLO1NBQ0YsS0FBSyxDQUNKLDhFQUE4RSxDQUMvRTtRQUNELHFGQUFxRjtTQUNwRixPQUFPLENBQ04sSUFBSSxFQUNKLDZEQUE2RCxFQUM3RCxVQUFDLENBQUM7UUFDQSxPQUFBLDBCQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLG1FQUFtRTthQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUNmLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUNkLElBQUksQ0FBQyxTQUFTLENBQUM7SUFQbEIsQ0FPa0IsRUFDcEIsbUJBQVEsQ0FBQyxPQUFPLENBQ2pCO1NBQ0EsT0FBTyxDQUFDLG1CQUFRLENBQUM7U0FDakIsT0FBTyxDQUFDLGtCQUFPLENBQUM7U0FDaEIsT0FBTyxDQUFDLGtCQUFPLENBQUM7U0FDaEIsT0FBTyxDQUFDLGlCQUFNLENBQUM7U0FDZixPQUFPLENBQUMsaUJBQU0sQ0FBQztTQUNmLElBQUksRUFBRTtTQUNOLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDakIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLENBQUM7QUFuQ0Qsb0JBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSBcInlhcmdzXCI7XG5pbXBvcnQge1xuICBCdWlsZENtZCxcbiAgYnVpbGRDbWRCdWlsZGVyLFxuICBJbml0Q21kLFxuICBUZXN0Q21kLFxuICBGbXRDbWQsXG4gIFJ1bkNtZCxcbn0gZnJvbSBcIi4vY29tbWFuZHNcIjtcbmltcG9ydCAqIGFzIGFzYyBmcm9tIFwiLi4vYXNjXCI7XG5pbXBvcnQgeyBzZXRHbG9iYWxBc2NPcHRpb25zLCBzZXRHbG9iYWxDbGlDYWxsYmFjayB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICBjbGk6IHN0cmluZ1tdLFxuICBvcHRpb25zOiBhc2MuQVBJT3B0aW9ucyA9IHt9LFxuICBjYWxsYmFjaz86IChhOiBhbnkpID0+IG51bWJlclxuKSB7XG4gIHNldEdsb2JhbEFzY09wdGlvbnMob3B0aW9ucyk7XG4gIHNldEdsb2JhbENsaUNhbGxiYWNrKGNhbGxiYWNrKTtcblxuICB5YXJnc1xuICAgIC51c2FnZShcbiAgICAgIFwiQnVpbGQgdG9vbCBmb3IgQXNzZW1ibHlTY3JpcHQgcHJvamVjdHMuXFxuXFxuVXNhZ2U6XFxuICBhc2IgW2NvbW1hbmRdIFtvcHRpb25zXVwiXG4gICAgKVxuICAgIC8vIFRvIGVuc3VyZSBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBhIGRlZmF1bHQgY29tbWFuZCBkZWxlZ2F0aW5nIHRvIEJ1aWxkQ21kLmhhbmRsZXJcbiAgICAuY29tbWFuZChcbiAgICAgIFwiJDBcIixcbiAgICAgIFwiQWxpYXMgb2YgYnVpbGQgY29tbWFuZCwgdG8gbWFpbnRhaW4gYmFjay13YXJkIGNvbXBhdGliaWxpdHlcIixcbiAgICAgICh5KSA9PlxuICAgICAgICBidWlsZENtZEJ1aWxkZXIoeSlcbiAgICAgICAgICAvLyBleHBsaWNpdGx5IGhpZGUgb3B0aW9ucyBoZWxwIHRvIGVuY291cmFnZSB1c2VycyB0byB1c2UgYnVpbGQgY21kXG4gICAgICAgICAgLmhpZGUoXCJjb25maWdcIilcbiAgICAgICAgICAuaGlkZShcImJhc2VEaXJcIilcbiAgICAgICAgICAuaGlkZShcIndhdFwiKVxuICAgICAgICAgIC5oaWRlKFwidGFyZ2V0XCIpXG4gICAgICAgICAgLmhpZGUoXCJvdXREaXJcIilcbiAgICAgICAgICAuaGlkZShcInZlcmJvc2VcIiksXG4gICAgICBCdWlsZENtZC5oYW5kbGVyXG4gICAgKVxuICAgIC5jb21tYW5kKEJ1aWxkQ21kKVxuICAgIC5jb21tYW5kKEluaXRDbWQpXG4gICAgLmNvbW1hbmQoVGVzdENtZClcbiAgICAuY29tbWFuZChGbXRDbWQpXG4gICAgLmNvbW1hbmQoUnVuQ21kKVxuICAgIC5oZWxwKClcbiAgICAuc2NyaXB0TmFtZShcImFzYlwiKVxuICAgIC5wYXJzZShjbGkpO1xufVxuIl19