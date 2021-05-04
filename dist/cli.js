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
        .parse(cli);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQStCO0FBQy9CLHVDQU9vQjtBQUVwQixpQ0FBb0U7QUFFcEUsU0FBZ0IsSUFBSSxDQUNsQixHQUFhLEVBQ2IsT0FBNEIsRUFDNUIsUUFBNkI7SUFEN0Isd0JBQUEsRUFBQSxZQUE0QjtJQUc1QiwyQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3Qiw0QkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvQixLQUFLO1NBQ0YsS0FBSyxDQUNKLDhFQUE4RSxDQUMvRTtRQUNELHFGQUFxRjtTQUNwRixPQUFPLENBQ04sSUFBSSxFQUNKLDZEQUE2RCxFQUM3RCxVQUFDLENBQUM7UUFDQSxPQUFBLDBCQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLG1FQUFtRTthQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUNmLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUNkLElBQUksQ0FBQyxTQUFTLENBQUM7SUFQbEIsQ0FPa0IsRUFDcEIsbUJBQVEsQ0FBQyxPQUFPLENBQ2pCO1NBQ0EsT0FBTyxDQUFDLG1CQUFRLENBQUM7U0FDakIsT0FBTyxDQUFDLGtCQUFPLENBQUM7U0FDaEIsT0FBTyxDQUFDLGtCQUFPLENBQUM7U0FDaEIsT0FBTyxDQUFDLGlCQUFNLENBQUM7U0FDZixPQUFPLENBQUMsaUJBQU0sQ0FBQztTQUNmLElBQUksRUFBRTtTQUNOLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQixDQUFDO0FBbENELG9CQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhcmdzIGZyb20gXCJ5YXJnc1wiO1xuaW1wb3J0IHtcbiAgQnVpbGRDbWQsXG4gIGJ1aWxkQ21kQnVpbGRlcixcbiAgSW5pdENtZCxcbiAgVGVzdENtZCxcbiAgRm10Q21kLFxuICBSdW5DbWQsXG59IGZyb20gXCIuL2NvbW1hbmRzXCI7XG5pbXBvcnQgKiBhcyBhc2MgZnJvbSBcImFzc2VtYmx5c2NyaXB0L2NsaS9hc2NcIjtcbmltcG9ydCB7IHNldEdsb2JhbEFzY09wdGlvbnMsIHNldEdsb2JhbENsaUNhbGxiYWNrIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oXG4gIGNsaTogc3RyaW5nW10sXG4gIG9wdGlvbnM6IGFzYy5BUElPcHRpb25zID0ge30sXG4gIGNhbGxiYWNrPzogKGE6IGFueSkgPT4gbnVtYmVyXG4pIHtcbiAgc2V0R2xvYmFsQXNjT3B0aW9ucyhvcHRpb25zKTtcbiAgc2V0R2xvYmFsQ2xpQ2FsbGJhY2soY2FsbGJhY2spO1xuXG4gIHlhcmdzXG4gICAgLnVzYWdlKFxuICAgICAgXCJCdWlsZCB0b29sIGZvciBBc3NlbWJseVNjcmlwdCBwcm9qZWN0cy5cXG5cXG5Vc2FnZTpcXG4gIGFzYiBbY29tbWFuZF0gW29wdGlvbnNdXCJcbiAgICApXG4gICAgLy8gVG8gZW5zdXJlIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGEgZGVmYXVsdCBjb21tYW5kIGRlbGVnYXRpbmcgdG8gQnVpbGRDbWQuaGFuZGxlclxuICAgIC5jb21tYW5kKFxuICAgICAgXCIkMFwiLFxuICAgICAgXCJBbGlhcyBvZiBidWlsZCBjb21tYW5kLCB0byBtYWludGFpbiBiYWNrLXdhcmQgY29tcGF0aWJpbGl0eVwiLFxuICAgICAgKHkpID0+XG4gICAgICAgIGJ1aWxkQ21kQnVpbGRlcih5KVxuICAgICAgICAgIC8vIGV4cGxpY2l0bHkgaGlkZSBvcHRpb25zIGhlbHAgdG8gZW5jb3VyYWdlIHVzZXJzIHRvIHVzZSBidWlsZCBjbWRcbiAgICAgICAgICAuaGlkZShcImNvbmZpZ1wiKVxuICAgICAgICAgIC5oaWRlKFwiYmFzZURpclwiKVxuICAgICAgICAgIC5oaWRlKFwid2F0XCIpXG4gICAgICAgICAgLmhpZGUoXCJ0YXJnZXRcIilcbiAgICAgICAgICAuaGlkZShcIm91dERpclwiKVxuICAgICAgICAgIC5oaWRlKFwidmVyYm9zZVwiKSxcbiAgICAgIEJ1aWxkQ21kLmhhbmRsZXJcbiAgICApXG4gICAgLmNvbW1hbmQoQnVpbGRDbWQpXG4gICAgLmNvbW1hbmQoSW5pdENtZClcbiAgICAuY29tbWFuZChUZXN0Q21kKVxuICAgIC5jb21tYW5kKEZtdENtZClcbiAgICAuY29tbWFuZChSdW5DbWQpXG4gICAgLmhlbHAoKVxuICAgIC5wYXJzZShjbGkpO1xufVxuIl19