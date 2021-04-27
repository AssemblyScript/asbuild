"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FmtCmd = void 0;
exports.FmtCmd = {
    command: "fmt",
    describe: "This utility formats all AS files of the current module using eslint.",
    aliases: ["format", "lint"],
    handler: function (args) {
        console.log(args);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm10LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2ZtdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBd0I7SUFDekMsT0FBTyxFQUFFLEtBQUs7SUFDZCxRQUFRLEVBQUUsdUVBQXVFO0lBQ2pGLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7SUFDM0IsT0FBTyxFQUFFLFVBQUMsSUFBSTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB5YXJncyBmcm9tIFwieWFyZ3NcIjtcblxuZXhwb3J0IGNvbnN0IEZtdENtZDogeWFyZ3MuQ29tbWFuZE1vZHVsZSA9IHtcbiAgY29tbWFuZDogXCJmbXRcIixcbiAgZGVzY3JpYmU6IFwiVGhpcyB1dGlsaXR5IGZvcm1hdHMgYWxsIEFTIGZpbGVzIG9mIHRoZSBjdXJyZW50IG1vZHVsZSB1c2luZyBlc2xpbnQuXCIsXG4gIGFsaWFzZXM6IFtcImZvcm1hdFwiLCBcImxpbnRcIl0sXG4gIGhhbmRsZXI6IChhcmdzKSA9PiB7XG4gICAgY29uc29sZS5sb2coYXJncyk7XG4gIH0sXG59O1xuIl19