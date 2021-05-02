import { FmtCmd, fmtCmdBuilder, initConfig } from "../src/commands/fmt";
import { InitFile, InitResult } from "../src/commands/init/interfaces";
import { mockModule } from "../src/utils";
import * as utils from "../src/utils";
import { EslintConfigFile } from "../src/commands/init/files/eslintConfig";
import * as yargs from "yargs";
import * as sinon from "sinon";
import * as tmp from "tmp";
import * as path from "path";
import * as fs from "fs";

import * as chai from "chai";
const expect = chai.expect;

import sinonChai from "sinon-chai";
chai.use(sinonChai);


describe(`test fmt`, () => {
  const parser = yargs.command({
    command: FmtCmd.command,
    describe: FmtCmd.describe,
    aliases: FmtCmd.aliases,
    builder: fmtCmdBuilder,
    handler: FmtCmd.handler,
    // handler: (a) => a,
  });
  const mockUtils = mockModule(utils, {
    log: (message) => message,
  });
  const mockInitFile = mockModule(InitFile.prototype, {
    write: (d) =>
      d.includes("EXISTS") ? InitResult.EXISTS : InitResult.CREATED,
    getRelativePath: InitFile.prototype.getRelativePath,
  });

  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("initConfig() should work fine both cases", () => {
    mockInitFile(sandbox);
    mockUtils(sandbox);
    expect(initConfig("EXISTS")).to.be.equal(InitResult.EXISTS);
    expect(initConfig("CREATED")).to.be.equal(InitResult.CREATED);
  });

  it("--init option should execute regardless of other args", () => {
    const stubWrite = sandbox.stub().returns(InitResult.CREATED);
    mockInitFile(sandbox, {
      write: stubWrite(),
    });
    mockUtils(sandbox);
    parser.parse(["fmt", "--init"]);
    expect(stubWrite).to.have.been.calledOnce;
  });

  describe("test fmt command and options", () => {
    const oldCwd = path.resolve(process.cwd());
    let workDir: tmp.DirResult;
    beforeEach(() => {
      workDir = tmp.dirSync({ unsafeCleanup: true });
      process.chdir(workDir.name);
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      workDir.removeCallback();
      process.chdir(oldCwd);
      sandbox.restore();
    });

    it("'asb fmt --init' works", () => {
      let logs: string[] = [];
      mockUtils(sandbox, {
        log: (m) => logs.push(m),
      });
      // should create the file
      parser.parse(["fmt", "--init"]);
      expect(logs.join("\n")).to.contain("Created");
      expect(
        fs.existsSync(path.join(workDir.name, new EslintConfigFile().path))
      ).to.be.true;
      // prints file exits
      logs = [];
      parser.parse(["fmt", "--init"]);
      expect(logs.join("\n")).to.not.contain("Created");
    });
    it("'asb fmt *.ts' should fail without eslint config", async () => {
      let logs: string[] = [];
      mockUtils(sandbox, {
        log: (m) => logs.push(m),
      });
      // should fail as there is no eslint config in dir
      await parser.parse(["fmt", "*.ts"]);
      expect(logs.join("\n")).to.contain("ERROR");
    });
  });
});
