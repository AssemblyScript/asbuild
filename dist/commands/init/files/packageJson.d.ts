import { InitFile } from "../interfaces";
declare enum PackageManager {
    NPM = "npm",
    Yarn = "yarn",
    PNPM = "pnpm"
}
interface PMCommand {
    test: string;
    install: string;
    pkgInstall: string;
    run: string;
}
export declare function getPm(): PackageManager;
export declare function getPmCommands(): PMCommand;
export declare class PackageJsonFile extends InitFile {
    path: string;
    description: string;
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
            "@typescript-eslint/eslint-plugin": string;
            "@typescript-eslint/parser": string;
            assemblyscript: string;
            eslint: string;
        };
        dependencies: {
            "@assemblyscript/loader": string;
            typescript: string;
        };
    };
    getContent(): string;
    updateOldContent: (old: string) => string;
}
export {};
