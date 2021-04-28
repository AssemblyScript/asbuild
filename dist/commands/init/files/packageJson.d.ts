import { InitFile } from "../interfaces";
export declare class PackageJsonFile extends InitFile {
    path: string;
    pm: string;
    pkgObj: {
        scripts: {
            test: string;
            "test:ci": string;
            "build:untouched": string;
            "build:optimized": string;
            build: string;
        };
        devDependencies: {
            "@as-pect/cli": string;
            assemblyscript: string;
        };
        dependencies: {
            "@assemblyscript/loader": string;
        };
    };
    getContent(): string;
    updateOldContent: (old: string) => string;
}
