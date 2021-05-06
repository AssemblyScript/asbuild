// Integration tests for asb cli
import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as tmp from "tmp";
import { expect } from "chai";
import { initFiles } from "../src/commands/init/files";
import { getPmCommands } from "../src/commands/init/files/packageJson";

const EXECUTABLE_PATH = path.resolve(path.join(__dirname, "../bin/asb"));

function checkInitTreeExists(dir: string): boolean {
  return initFiles.every((f) => fs.existsSync(f.getRelativePath(dir)));
}

function awaitExit(exitingProcess: childProcess.ChildProcess): Promise<void> {
  return new Promise((resolve) => exitingProcess.once("exit", resolve));
}

function assertExitCode(
  exitingProcess: childProcess.ChildProcess,
  expectedExitCode: number
) {
  return awaitExit(exitingProcess).then((exitCode) => {
    expect(
      exitCode,
      `Expected an exit code of ${expectedExitCode} but got ${exitCode}.`
    ).to.be.equal(expectedExitCode);
  });
}

function getOutput(runningProcess: childProcess.ChildProcess) {
  let stdout = "";
  let stderr = "";

  runningProcess.stdout!.on("data", (data) => (stdout += data));
  runningProcess.stderr!.on("data", (data) => (stderr += data));
  return awaitExit(runningProcess).then(() => ({ stdout, stderr }));
}

const rawASFileContent = `
export function add(a:i32, b:i32) {
                            return a + b
}
`;

const formattedFileContent = `
export function add(a:i32, b:i32) {
  return a + b;
}
`;

describe("bin/asb", () => {
  const forkedProcesses = new Set<childProcess.ChildProcess>();
  let workDir: tmp.DirResult | null;
  let oldCwd: string;

  function run(
    exe: string,
    args: string[],
    options: childProcess.ForkOptions = {}
  ) {
    const newProcess = childProcess.fork(
      exe,
      args,
      Object.assign({ silent: true }, options)
    );

    forkedProcesses.add(newProcess);
    return newProcess;
  }

  function runASB(args: string[], options: childProcess.ForkOptions = {}) {
    return run(EXECUTABLE_PATH, args, options);
  }

  beforeEach(() => {
    workDir = tmp.dirSync({ unsafeCleanup: true });
    oldCwd = process.cwd();
    process.chdir(workDir.name);
  });

  it("running init with 'y'", () => {
    const child = runASB(["init"]);
    child.stdin!.write("y\n");
    child.stdin!.end();
    return assertExitCode(child, 0);
    // checkInitTreeExists;
  });

  it("running init with 'n'", () => {
    const child = runASB(["init"]);
    child.stdin!.write("n\n");
    child.stdin!.end();
    return assertExitCode(child, 2);
  });

  it("running init with --yes", () => {
    const child = runASB(["init", "--yes"]);
    return assertExitCode(child, 0);
  });

  it("running init basDir option", async () => {
    const child = runASB(["init", "hello123", "--yes"]);
    await awaitExit(child);
    expect(child.exitCode).to.be.eq(0);
    expect(checkInitTreeExists("hello123")).to.be.true;
  });

  it("running test -- --verbose", async function () {
    // setting a large timeout
    this.timeout(15000);
    const initChild = runASB(["init", "--yes"]);
    await awaitExit(initChild);
    const testChild = runASB(["test", "--", "--verbose"]);
    await awaitExit(testChild);
    expect(testChild.exitCode).to.be.eq(0);
  });

  describe("running fmt", function () {
    this.timeout(40000);
    const installDir: tmp.DirResult = tmp.dirSync({ unsafeCleanup: true });

    before(async () => {
      process.chdir(installDir.name);
      // create init project
      const initChild = runASB(["init", "--yes"]);
      await awaitExit(initChild);
      // install packages
      childProcess.execSync(`${getPmCommands().install}`, {
        stdio: "ignore",
        // stdio: "inherit",
      });
    });

    beforeEach(() => {
      process.chdir(installDir.name);
    });

    it("fmt *.ts", async () => {
      fs.writeFileSync("index.ts", rawASFileContent);
      const fmtChild = runASB(["fmt", "*.ts"], { stdio: "ignore" });
      await awaitExit(fmtChild);
      expect(fmtChild.exitCode).to.be.eq(0);
      expect(fs.readFileSync("index.ts", { encoding: "utf8" })).to.be.equal(
        formattedFileContent
      );
    });

    it("fmt *.ts --lint", async () => {
      fs.writeFileSync("index.ts", rawASFileContent);
      const fmtChild = runASB(["fmt", "*.ts", "--lint"]);
      const { stdout } = await getOutput(fmtChild);
      // check for output warning
      expect(stdout).to.include("problem");
      // make sure file is unchanged
      expect(fs.readFileSync("index.ts", { encoding: "utf8" })).to.be.equal(
        rawASFileContent
      );
      //
    });
  });

  afterEach(() => {
    // Clean up all the processes after every test.
    forkedProcesses.forEach((child) => child.kill());
    forkedProcesses.clear();
    process.chdir(oldCwd);
    if (workDir) {
      workDir.removeCallback();
      workDir = null;
    }
  });
});
