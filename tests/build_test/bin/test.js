let sh = require("shelljs");
let assert = require("assert");

const hello = "hello world";
// build WASI binary
sh.exec("../../../bin/asb", { silent: true }).stdout;
let res = sh.exec("../../../bin/asb run ./build/release/bin.wasm -- " + hello, {
  silent: true,
}).stdout;

assert(res.startsWith(hello));
console.log("Passed echo test");
