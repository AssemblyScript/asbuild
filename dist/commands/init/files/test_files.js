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
exports.ExampleTestFile = exports.AsPectTypesFile = void 0;
var interfaces_1 = require("../interfaces");
var testContent = "\nimport { add } from \"..\";\n\ndescribe(\"test add\", () => {\n  it(\"19 + 13 should be 42\", () => {\n    expect<i32>(add(19, 23)).toBe(42, \"19 + 23 is 42\");\n  });\n\n  it(\"can log some values to the console\", () => {\n    log<string>(\"Hello world!\"); // strings!\n    log<f64>(3.1415); // floats!\n    log<u8>(244); // integers!\n    log<u64>(0xffffffff); // long values!\n    log<ArrayBuffer>(new ArrayBuffer(50)); // bytes!\n  });\n});\n";
var AsPectTypesFile = /** @class */ (function (_super) {
    __extends(AsPectTypesFile, _super);
    function AsPectTypesFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "assembly/__tests__/as-pect.d.ts";
        _this.updateOldContent = null;
        return _this;
    }
    AsPectTypesFile.prototype.getContent = function () {
        return "/// <reference types=\"@as-pect/assembly/types/as-pect\" />\n";
    };
    return AsPectTypesFile;
}(interfaces_1.InitFile));
exports.AsPectTypesFile = AsPectTypesFile;
var ExampleTestFile = /** @class */ (function (_super) {
    __extends(ExampleTestFile, _super);
    function ExampleTestFile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = "assembly/__tests__/example.spec.ts";
        _this.updateOldContent = null;
        return _this;
    }
    ExampleTestFile.prototype.getContent = function () {
        return testContent;
    };
    return ExampleTestFile;
}(interfaces_1.InitFile));
exports.ExampleTestFile = ExampleTestFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9maWxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ZpbGVzL3Rlc3RfZmlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUF5QztBQUV6QyxJQUFNLFdBQVcsR0FBRyxvY0FnQm5CLENBQUM7QUFFRjtJQUFxQyxtQ0FBUTtJQUE3QztRQUFBLHFFQU1DO1FBTEMsVUFBSSxHQUFHLGlDQUFpQyxDQUFDO1FBSXpDLHNCQUFnQixHQUFHLElBQUksQ0FBQzs7SUFDMUIsQ0FBQztJQUpDLG9DQUFVLEdBQVY7UUFDRSxPQUFPLCtEQUE2RCxDQUFDO0lBQ3ZFLENBQUM7SUFFSCxzQkFBQztBQUFELENBQUMsQUFORCxDQUFxQyxxQkFBUSxHQU01QztBQU5ZLDBDQUFlO0FBUTVCO0lBQXFDLG1DQUFRO0lBQTdDO1FBQUEscUVBTUM7UUFMQyxVQUFJLEdBQUcsb0NBQW9DLENBQUM7UUFJNUMsc0JBQWdCLEdBQUcsSUFBSSxDQUFDOztJQUMxQixDQUFDO0lBSkMsb0NBQVUsR0FBVjtRQUNFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFSCxzQkFBQztBQUFELENBQUMsQUFORCxDQUFxQyxxQkFBUSxHQU01QztBQU5ZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5pdEZpbGUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuXG5jb25zdCB0ZXN0Q29udGVudCA9IGBcbmltcG9ydCB7IGFkZCB9IGZyb20gXCIuLlwiO1xuXG5kZXNjcmliZShcInRlc3QgYWRkXCIsICgpID0+IHtcbiAgaXQoXCIxOSArIDEzIHNob3VsZCBiZSA0MlwiLCAoKSA9PiB7XG4gICAgZXhwZWN0PGkzMj4oYWRkKDE5LCAyMykpLnRvQmUoNDIsIFwiMTkgKyAyMyBpcyA0MlwiKTtcbiAgfSk7XG5cbiAgaXQoXCJjYW4gbG9nIHNvbWUgdmFsdWVzIHRvIHRoZSBjb25zb2xlXCIsICgpID0+IHtcbiAgICBsb2c8c3RyaW5nPihcIkhlbGxvIHdvcmxkIVwiKTsgLy8gc3RyaW5ncyFcbiAgICBsb2c8ZjY0PigzLjE0MTUpOyAvLyBmbG9hdHMhXG4gICAgbG9nPHU4PigyNDQpOyAvLyBpbnRlZ2VycyFcbiAgICBsb2c8dTY0PigweGZmZmZmZmZmKTsgLy8gbG9uZyB2YWx1ZXMhXG4gICAgbG9nPEFycmF5QnVmZmVyPihuZXcgQXJyYXlCdWZmZXIoNTApKTsgLy8gYnl0ZXMhXG4gIH0pO1xufSk7XG5gO1xuXG5leHBvcnQgY2xhc3MgQXNQZWN0VHlwZXNGaWxlIGV4dGVuZHMgSW5pdEZpbGUge1xuICBwYXRoID0gXCJhc3NlbWJseS9fX3Rlc3RzX18vYXMtcGVjdC5kLnRzXCI7XG4gIGdldENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYC8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiQGFzLXBlY3QvYXNzZW1ibHkvdHlwZXMvYXMtcGVjdFwiIC8+XFxuYDtcbiAgfVxuICB1cGRhdGVPbGRDb250ZW50ID0gbnVsbDtcbn1cblxuZXhwb3J0IGNsYXNzIEV4YW1wbGVUZXN0RmlsZSBleHRlbmRzIEluaXRGaWxlIHtcbiAgcGF0aCA9IFwiYXNzZW1ibHkvX190ZXN0c19fL2V4YW1wbGUuc3BlYy50c1wiO1xuICBnZXRDb250ZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRlc3RDb250ZW50O1xuICB9XG4gIHVwZGF0ZU9sZENvbnRlbnQgPSBudWxsO1xufVxuIl19