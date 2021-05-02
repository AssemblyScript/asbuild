import * as path from "path";
import * as fs from "fs";
import { ensureDirExists } from "../../utils";

export enum InitResult {
  CREATED = 0,
  UPDATED = 1,
  EXISTS = 2,
}

export abstract class InitFile {
  constructor() {}
  abstract path: string;
  abstract description: string;
  abstract updateOldContent: ((old: string) => string) | null;

  abstract getContent(): string;

  getRelativePath(baseDir: string): string {
    return path.join(baseDir, this.path);
  }
  /**
   * Write the InitFile to given baseDir
   * @param baseDir Base directory where file will created in relative to
   */
  write(baseDir: string): InitResult {
    const filePath = this.getRelativePath(baseDir);

    // create the required dirs if not exists
    ensureDirExists(filePath);

    // check if file already exists
    const fileExists = fs.existsSync(filePath);
    // check whether file can be updated or not
    const shouldUpdate = this.updateOldContent && fileExists;

    if (fileExists && !shouldUpdate) {
      // if file exists and cannot update return
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

    return fileExists && shouldUpdate ? InitResult.UPDATED : InitResult.CREATED;
  }
}
