import * as asc from "../asc";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import * as sinon from "sinon";

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

export async function askYesNo(ques: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  const res: string = await new Promise((resolve) =>
    rl.question(ques + " [Y/n]: ", resolve)
  );
  rl.close();
  return /^$|^y?$/.test(res.toLowerCase().trim());
}

export function log(message?: any, error = false) {
  error ? console.error(message) : console.info(message);
}

export function mockModule<T extends { [K: string]: any }>(
  moduleToMock: T,
  defaultMockValuesForMock: Partial<{ [K in keyof T]: T[K] }>
) {
  return (
    sandbox: sinon.SinonSandbox,
    returnOverrides?: Partial<{ [K in keyof T]: T[K] }>
  ): void => {
    const returns: any = returnOverrides || {};
    const functions = Object.keys(moduleToMock);
    functions.forEach((f) => {
      const override = returns[f] || defaultMockValuesForMock[f];
      if (override) {
        sandbox.stub(moduleToMock, f).callsFake(override);
      }
    });
  };
}
