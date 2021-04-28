import { InitFile } from "../interfaces";
export declare class IndexJsFile extends InitFile {
    path: string;
    getContent(): string;
    updateOldContent: (old: string) => string;
}
