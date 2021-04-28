import { InitFile } from "../interfaces";
export declare class AssemblyIndexFile extends InitFile {
    path: string;
    getContent(): string;
    updateOldContent: null;
}
export declare class TsConfigFile extends InitFile {
    path: string;
    getContent(): string;
    updateOldContent: null;
}
