export declare enum InitResult {
    UPDATED = 0,
    CREATED = 1,
    EXISTS = 2,
    OVERWRITE = 3
}
export declare abstract class InitFile {
    constructor();
    abstract path: string;
    abstract updateOldContent: ((old: string) => string) | null;
    abstract getContent(): string;
    /**
     * Write the InitFile to given baseDir
     * @param baseDir Base directory where file will created in relative to
     * @param overwrite Whether to overwrite file if current InitFile does not
     *                  support updating old file content.
     */
    write(baseDir: string, overwrite?: boolean): InitResult;
}
