import * as path from "path";
import * as fs from "fs";
import { ensureDirExists } from "../../utils";

export enum InitResult {
  UPDATED,
  CREATED,
  EXISTS,
  OVERWRITE,
}

export abstract class InitFile {
  constructor() {}
  abstract path: string;
  abstract updateOldContent: ((old: string) => string) | null;

  abstract getContent(): string;

  /**
   * Write the InitFile to given baseDir
   * @param baseDir Base directory where file will created in relative to
   * @param overwrite Whether to overwrite file if current InitFile does not
   *                  support updating old file content.
   */
  write(baseDir: string, overwrite = false): InitResult {
    const filePath = path.join(baseDir, this.path);

    // create the required dirs if not exists
    ensureDirExists(filePath);

    // check if file already exists
    const fileExists = fs.existsSync(filePath);
    // check whether file can be updated or not
    const shouldUpdate = this.updateOldContent && fileExists;

    if (fileExists && !overwrite) {
      // if file exists and overwrite is false, then return
      return InitResult.EXISTS;
    } else {
      const newContent: string =
        shouldUpdate && this.updateOldContent
          ? this.updateOldContent(
              fs.readFileSync(filePath, { encoding: "utf8" })
            )
          : this.getContent();
      fs.writeFileSync(filePath, newContent);
    }

    return fileExists
      ? shouldUpdate
        ? InitResult.UPDATED
        : overwrite
        ? InitResult.OVERWRITE
        : InitResult.CREATED
      : InitResult.CREATED;
  }
}
