// import { InitResult } from "../src/commands/init/interfaces";
import * as utils from "../src/utils";
import { mockModule } from "../src/utils";
import { InitFile, InitResult } from "../src/commands/init/interfaces";
import { initCmdBuilder } from "../src/commands/init/cmd";
import { InitCmd } from "../src/commands/init";
import { PackageJsonFile } from "../src/commands/init/files/packageJson";
import * as tmp from "tmp";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import * as yargs from "yargs";

import * as chai from "chai";
const expect = chai.expect;

import sinonChai from "sinon-chai";
chai.use(sinonChai);

class TestInitWithoutUpdate extends InitFile {
  description = "test_without_update";
  path = "a/b/c/test_without_update.file";
  getContent() {
    return "Some Content";
  }
  updateOldContent = null;
}

class TestInitWithUpdate extends InitFile {
  description = "test_with_update";
  path = "test_with_update.file";
  getContent() {
    return "OLD";
  }
  updateOldContent = (old: string) => old + " NEW";
}

describe(`test init`, () => {
  const parser = yargs.command({
    command: InitCmd.command,
    describe: InitCmd.describe,
    handler: InitCmd.handler,
    builder: initCmdBuilder,
  });
  const oldCwd = path.resolve(process.cwd());
  let workDir: tmp.DirResult;

  let sandbox: sinon.SinonSandbox;
  const mockUtils = mockModule(utils, {
    log: (m) => m,
  });

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

  describe("test InitFile class", () => {
    const withoutUpdate = new TestInitWithoutUpdate();
    const withUpdate = new TestInitWithUpdate();
    beforeEach(() => {
      workDir = tmp.dirSync({ unsafeCleanup: true });
      process.chdir(workDir.name);
    });
    afterEach(() => {
      workDir.removeCallback();
      process.chdir(oldCwd);
    });

    it(`test without updateOldContent()`, () => {
      expect(withoutUpdate.write(workDir.name)).to.be.equal(InitResult.CREATED);
      expect(
        fs.readFileSync(withoutUpdate.getRelativePath(workDir.name), {
          encoding: "utf8",
        })
      ).to.be.equal(withoutUpdate.getContent());
      // file already exists
      expect(withoutUpdate.write(workDir.name)).to.be.equal(InitResult.EXISTS);
    });

    it(`test with updateOldContent()`, () => {
      expect(withUpdate.write(workDir.name)).to.be.equal(InitResult.CREATED);
      // file already exists, so update it
      expect(withUpdate.write(workDir.name)).to.be.equal(InitResult.UPDATED);
      expect(
        fs.readFileSync(withUpdate.getRelativePath(workDir.name), {
          encoding: "utf8",
        })
      ).to.be.equal(withUpdate.updateOldContent(withUpdate.getContent()));
    });
  });

  it("should abort if users deny", async () => {
    const askStub = sandbox.stub().returns(false);
    mockUtils(sandbox, {
      askYesNo: askStub,
    });

    await parser.parse(["init"]);
    expect(askStub, "askYesNo stub should be called").to.have.been.calledOnce;
    expect(
      fs.existsSync(path.join(workDir.name, "package.json")),
      "package.json should not exist"
    ).to.be.false;
  });

  it("should continue if users confirm", async () => {
    const askStub = sandbox.stub().returns(true);
    mockUtils(sandbox, {
      askYesNo: askStub,
    });
    await parser.parse(["init"]);
    expect(askStub, "askYesNo stub should be called").to.have.been.calledOnce;
    expect(
      fs.existsSync(path.join(workDir.name, "package.json")),
      "package.json should exist"
    ).to.be.true;
  });
});

describe("test init files", () => {
  it("PackageJsonFile.updateOldContent() should works", () => {
    const pkgFile = new PackageJsonFile();
    let olgPkgObj = {};
    let newPkgObj = JSON.parse(
      pkgFile.updateOldContent(JSON.stringify(olgPkgObj))
    );

    expect(newPkgObj["scripts"]).to.eql(pkgFile.pkgObj.scripts);
    expect(newPkgObj["dependencies"]).to.eql(pkgFile.pkgObj.dependencies);
    expect(newPkgObj["devDependencies"]).to.eql(pkgFile.pkgObj.devDependencies);
  });
});
