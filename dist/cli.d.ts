import * as asc from "assemblyscript/cli/asc";
export interface ASBuildArgs {
    [x: string]: unknown;
    baseDir: string;
    config: string;
    wat: boolean;
    outDir: string | undefined;
    target: string;
    verbose: boolean;
}
export declare function main(cli: string[], options?: asc.APIOptions, callback?: (a: any) => number): void;
