"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("./cli");
cli_1.main(process.argv.slice(2), {}, function (err) {
    if (err) {
        throw err;
    }
    return 1;
});
