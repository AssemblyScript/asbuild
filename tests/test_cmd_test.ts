import { TestCmd } from "../src/commands";
import * as yargs from "yargs";
import * as aspect from "@as-pect/cli";
import { mockModule } from "../src/utils";
import * as utils from "../src/utils";
import * as sinon from "sinon";

import * as chai from "chai";
const expect = chai.expect;

import sinonChai from "sinon-chai";
chai.use(sinonChai);

describe(`test aspect test`, () => {
  const parser = yargs.command(TestCmd);
  const mockAspect = mockModule(aspect, {
    asp: (args) => args,
  });
  const mockUtils = mockModule(utils, {
    log: (message) => message,
  });

  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("default options", () => {
    const aspSpy = sandbox.spy();
    mockAspect(sandbox, {
      asp: aspSpy,
    });
    parser.parse(["test"]);
    expect(aspSpy).to.have.been.calledOnceWithExactly(["--nologo"]);
  });
  it("--verbose option", () => {
    const logSpy = sandbox.spy();
    mockAspect(sandbox);
    mockUtils(sandbox, {
      log: logSpy,
    });
    parser.parse(["test", "--verbose", "--", "--summary", "-a", "1"]);
    expect(logSpy).to.have.been.calledOnceWithExactly([
      "--summary",
      "-a",
      "1",
      "--nologo",
    ]);
  });
  it("pass options to asp", () => {
    const aspSpy = sandbox.spy();
    mockAspect(sandbox, {
      asp: aspSpy,
    });
    parser.parse(["test", "--", "--a", "1", "hello"]);
    expect(aspSpy).to.have.been.calledOnceWithExactly([
      "--a",
      "1",
      "hello",
      "--nologo",
    ]);
  });
});
