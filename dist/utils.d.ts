import * as asc from "assemblyscript/cli/asc";
/**
 * @note Only for use by testing mechanism
 */
export declare function setGlobalAscOptions(ascOptions?: asc.APIOptions): void;
export declare function getGlobalAscOptions(): asc.APIOptions;
/**
 * @note Only for use by testing mechanism
 */
export declare function setGlobalCliCallback(callback?: (a: any) => number): void;
export declare function getGlobalCliCallback(): (a: any) => number;
export declare function ensureDirExists(filePath: string): void;
export declare function askYesNo(ques: string): Promise<boolean>;
