import { InitFile } from "../interfaces";

const testContent = `
import { add } from "..";

describe("test add", () => {
  it("19 + 13 should be 42", () => {
    expect<i32>(add(19, 23)).toBe(42, "19 + 23 is 42");
  });

  it("can log some values to the console", () => {
    log<string>("Hello world!"); // strings!
    log<f64>(3.1415); // floats!
    log<u8>(244); // integers!
    log<u64>(0xffffffff); // long values!
    log<ArrayBuffer>(new ArrayBuffer(50)); // bytes!
  });
});
`;

export class AsPectTypesFile extends InitFile {
  path = "assembly/__tests__/as-pect.d.ts";
  description = "Typescript types file for tests.";
  getContent(): string {
    return `/// <reference types="@as-pect/assembly/types/as-pect" />\n`;
  }
  updateOldContent = null;
}

export class ExampleTestFile extends InitFile {
  path = "assembly/__tests__/example.spec.ts";
  description = "Example test to check that your module is indeed working.";
  getContent(): string {
    return testContent;
  }
  updateOldContent = null;
}
