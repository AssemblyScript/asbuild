import { main } from "../../src";
import * as loader from "assemblyscript/lib/loader";
import * as path from "path";
import * as fs from "fs";


let binary: Uint8Array;
let textFile: string;
let stderr: string;

let args = process.argv.slice(2);
if (args.indexOf("--") == -1) {
  args.push("--");
} 
args.push("--explicitStart")

let mapFiles = new Map();

main(args, {
  writeFile(name: string, contents: any) {
    mapFiles.set(name, contents);
    if (name.endsWith(".wasm")) {
      binary = contents;
    } else if (name.endsWith(".wat")) {
      textFile = contents;
    }
  },
  stderr: {
    write(s: string) {
      stderr = s;
    }
  }

}, (err) => {
  if (err) {
    console.error(err);
    console.error(stderr);
    process.exit(1);
  }

  const jsonPath = path.join(process.cwd(), "expected.json");
  if (fs.existsSync(jsonPath) && stderr) {
    const actual = JSON.parse(stderr).options;
    const expected = require(jsonPath);
    let errored = false;
    for (let name of Object.getOwnPropertyNames(expected)) {
      if (name === "binaryFile" && actual[name].endsWith(expected[name])) {
        continue;
      } else if (actual[name] !== expected[name]) {
        // If object check just first level
        if (typeof actual[name] === 'object' && typeof expected[name] === 'object') {
          let error = false;
          for (let field of Object.getOwnPropertyNames(actual[name])) {
            if (actual[name][field] !== expected[name][field]) {
              error = true;
              break;
            }
          }
          if (!error) {
            continue;
          }
        }
        console.error(name + ": " + actual[name] + " expected " + expected[name]);
        errored = true;
      }
    }
    if (errored) {
      process.exit(1);
    }
    process.exit(0);
  }

  
  if (!binary && !textFile) {
    console.error("No binary was generated for the asconfig test in " + process.cwd());
    process.exit(1);
  }

  const theModule = loader.instantiateSync(binary);

  try {
    console.log("running " + process.cwd())
    theModule.exports._start();
  } catch (err) {
    console.error("The wasm module _start() function failed in " + process.cwd());
    console.error(err);
    process.exit(1);
  }
  return 0;
});
