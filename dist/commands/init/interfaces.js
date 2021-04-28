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
exports.InitFile = exports.InitResult = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var utils_1 = require("../../utils");
var InitResult;
(function (InitResult) {
    InitResult[InitResult["UPDATED"] = 0] = "UPDATED";
    InitResult[InitResult["CREATED"] = 1] = "CREATED";
    InitResult[InitResult["EXISTS"] = 2] = "EXISTS";
    InitResult[InitResult["OVERWRITE"] = 3] = "OVERWRITE";
})(InitResult = exports.InitResult || (exports.InitResult = {}));
var InitFile = /** @class */ (function () {
    function InitFile() {
    }
    /**
     * Write the InitFile to given baseDir
     * @param baseDir Base directory where file will created in relative to
     * @param overwrite Whether to overwrite file if current InitFile does not
     *                  support updating old file content.
     */
    InitFile.prototype.write = function (baseDir, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var filePath = path.join(baseDir, this.path);
        // create the required dirs if not exists
        utils_1.ensureDirExists(filePath);
        // check if file already exists
        var fileExists = fs.existsSync(filePath);
        // check whether file can be updated or not
        var shouldUpdate = this.updateOldContent && fileExists;
        if (fileExists && !overwrite) {
            // if file exists and overwrite is false, then return
            return InitResult.EXISTS;
        }
        else {
            var newContent = shouldUpdate && this.updateOldContent
                ? this.updateOldContent(fs.readFileSync(filePath, { encoding: "utf8" }))
                : this.getContent();
            fs.writeFileSync(filePath, newContent);
        }
        return fileExists
            ? shouldUpdate
                ? InitResult.UPDATED
                : overwrite
                    ? InitResult.OVERWRITE
                    : InitResult.CREATED
            : InitResult.CREATED;
    };
    return InitFile;
}());
exports.InitFile = InitFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9pbml0L2ludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2QjtBQUM3QixxQ0FBeUI7QUFDekIscUNBQThDO0FBRTlDLElBQVksVUFLWDtBQUxELFdBQVksVUFBVTtJQUNwQixpREFBTyxDQUFBO0lBQ1AsaURBQU8sQ0FBQTtJQUNQLCtDQUFNLENBQUE7SUFDTixxREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUxXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBS3JCO0FBRUQ7SUFDRTtJQUFlLENBQUM7SUFNaEI7Ozs7O09BS0c7SUFDSCx3QkFBSyxHQUFMLFVBQU0sT0FBZSxFQUFFLFNBQWlCO1FBQWpCLDBCQUFBLEVBQUEsaUJBQWlCO1FBQ3RDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvQyx5Q0FBeUM7UUFDekMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxQiwrQkFBK0I7UUFDL0IsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQywyQ0FBMkM7UUFDM0MsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLFVBQVUsQ0FBQztRQUV6RCxJQUFJLFVBQVUsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUM1QixxREFBcUQ7WUFDckQsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQzFCO2FBQU07WUFDTCxJQUFNLFVBQVUsR0FDZCxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQjtnQkFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FDbkIsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FDaEQ7Z0JBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN4QztRQUVELE9BQU8sVUFBVTtZQUNmLENBQUMsQ0FBQyxZQUFZO2dCQUNaLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTztnQkFDcEIsQ0FBQyxDQUFDLFNBQVM7b0JBQ1gsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTO29CQUN0QixDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU87WUFDdEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDO0FBN0NxQiw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgZW5zdXJlRGlyRXhpc3RzIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbmV4cG9ydCBlbnVtIEluaXRSZXN1bHQge1xuICBVUERBVEVELFxuICBDUkVBVEVELFxuICBFWElTVFMsXG4gIE9WRVJXUklURSxcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluaXRGaWxlIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBhYnN0cmFjdCBwYXRoOiBzdHJpbmc7XG4gIGFic3RyYWN0IHVwZGF0ZU9sZENvbnRlbnQ6ICgob2xkOiBzdHJpbmcpID0+IHN0cmluZykgfCBudWxsO1xuXG4gIGFic3RyYWN0IGdldENvbnRlbnQoKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXcml0ZSB0aGUgSW5pdEZpbGUgdG8gZ2l2ZW4gYmFzZURpclxuICAgKiBAcGFyYW0gYmFzZURpciBCYXNlIGRpcmVjdG9yeSB3aGVyZSBmaWxlIHdpbGwgY3JlYXRlZCBpbiByZWxhdGl2ZSB0b1xuICAgKiBAcGFyYW0gb3ZlcndyaXRlIFdoZXRoZXIgdG8gb3ZlcndyaXRlIGZpbGUgaWYgY3VycmVudCBJbml0RmlsZSBkb2VzIG5vdFxuICAgKiAgICAgICAgICAgICAgICAgIHN1cHBvcnQgdXBkYXRpbmcgb2xkIGZpbGUgY29udGVudC5cbiAgICovXG4gIHdyaXRlKGJhc2VEaXI6IHN0cmluZywgb3ZlcndyaXRlID0gZmFsc2UpOiBJbml0UmVzdWx0IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihiYXNlRGlyLCB0aGlzLnBhdGgpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSByZXF1aXJlZCBkaXJzIGlmIG5vdCBleGlzdHNcbiAgICBlbnN1cmVEaXJFeGlzdHMoZmlsZVBhdGgpO1xuXG4gICAgLy8gY2hlY2sgaWYgZmlsZSBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGZpbGVFeGlzdHMgPSBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKTtcbiAgICAvLyBjaGVjayB3aGV0aGVyIGZpbGUgY2FuIGJlIHVwZGF0ZWQgb3Igbm90XG4gICAgY29uc3Qgc2hvdWxkVXBkYXRlID0gdGhpcy51cGRhdGVPbGRDb250ZW50ICYmIGZpbGVFeGlzdHM7XG5cbiAgICBpZiAoZmlsZUV4aXN0cyAmJiAhb3ZlcndyaXRlKSB7XG4gICAgICAvLyBpZiBmaWxlIGV4aXN0cyBhbmQgb3ZlcndyaXRlIGlzIGZhbHNlLCB0aGVuIHJldHVyblxuICAgICAgcmV0dXJuIEluaXRSZXN1bHQuRVhJU1RTO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXdDb250ZW50OiBzdHJpbmcgPVxuICAgICAgICBzaG91bGRVcGRhdGUgJiYgdGhpcy51cGRhdGVPbGRDb250ZW50XG4gICAgICAgICAgPyB0aGlzLnVwZGF0ZU9sZENvbnRlbnQoXG4gICAgICAgICAgICAgIGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogXCJ1dGY4XCIgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IHRoaXMuZ2V0Q29udGVudCgpO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgbmV3Q29udGVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVFeGlzdHNcbiAgICAgID8gc2hvdWxkVXBkYXRlXG4gICAgICAgID8gSW5pdFJlc3VsdC5VUERBVEVEXG4gICAgICAgIDogb3ZlcndyaXRlXG4gICAgICAgID8gSW5pdFJlc3VsdC5PVkVSV1JJVEVcbiAgICAgICAgOiBJbml0UmVzdWx0LkNSRUFURURcbiAgICAgIDogSW5pdFJlc3VsdC5DUkVBVEVEO1xuICB9XG59XG4iXX0=