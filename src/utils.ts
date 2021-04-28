import * as asc from "assemblyscript/cli/asc";
import * as path from "path";
import * as fs from "fs";

const DEFAULT_ASC_OPTIONS: asc.APIOptions = {};
const DEFAULT_CLI_CALLBACK: (a: any) => number = (err) => {
  if (err) {
    throw err;
  }
  return 1;
};

// @ts-ignore
let ASC_OPTIONS = DEFAULT_ASC_OPTIONS;
// @ts-ignore
let CLI_CALLBACK = DEFAULT_CLI_CALLBACK;

/**
 * @note Only for use by testing mechanism
 */
export function setGlobalAscOptions(
  ascOptions: asc.APIOptions = DEFAULT_ASC_OPTIONS
) {
  ASC_OPTIONS = ascOptions;
}

export function getGlobalAscOptions(): asc.APIOptions {
  return ASC_OPTIONS;
}

/**
 * @note Only for use by testing mechanism
 */
export function setGlobalCliCallback(
  callback: (a: any) => number = DEFAULT_CLI_CALLBACK
) {
  CLI_CALLBACK = callback;
}

export function getGlobalCliCallback(): (a: any) => number {
  return CLI_CALLBACK;
}

export function ensureDirExists(filePath: string) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirExists(dirname);
  fs.mkdirSync(dirname);
}
