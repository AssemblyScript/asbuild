import { InitFile } from "../interfaces";
import { version as aspectVersion } from "@as-pect/cli/lib";

import { version as compilerVersion } from "assemblyscript/cli/asc";

const npmDefaultTest = 'echo "Error: no test specified" && exit 1';

enum PackageManager {
  NPM = "npm",
  Yarn = "yarn",
  PNPM = "pnpm",
}

interface PMCommand {
  test: string;
  install: string;
  pkgInstall: string;
  run: string;
}

export function getPm(): PackageManager {
  let pm = "npm";
  if (typeof process.env.npm_config_user_agent === "string") {
    if (/\byarn\//.test(process.env.npm_config_user_agent)) {
      pm = "yarn";
    } else if (/\bpnpm\//.test(process.env.npm_config_user_agent)) {
      pm = "pnpm";
    }
  }
  return pm as PackageManager;
}

export function getPmCommands(): PMCommand {
  switch (getPm()) {
    case PackageManager.PNPM:
      return {
        install: "pnpm install",
        pkgInstall: "pnpm add",
        run: "pnpm run",
        test: "pnpm test",
      };

    case PackageManager.Yarn:
      return {
        install: "yarn install",
        pkgInstall: "yarn add",
        run: "yarn",
        test: "yarn test",
      };

    default:
      return {
        install: "npm install",
        pkgInstall: "npm install",
        run: "npm run",
        test: "npm test",
      };
  }
}

export class PackageJsonFile extends InitFile {
  path = "package.json";
  description =
    "Package info containing the necessary commands to compile to WebAssembly";
  pm = "npm";
  pkgObj = {
    scripts: {
      "lint:fix": 'asb fmt "assembly/**/*.ts"',
      test: "asb test -- --verbose",
      "test:ci": "asb test -- --summary",
      "build:untouched": "asb assembly/index.ts --target debug",
      "build:optimized": "asb assembly/index.ts --target release",
      build: `${getPmCommands().run} build:untouched && ${
        getPmCommands().run
      } build:optimized`,
    },
    devDependencies: {
      "@as-pect/cli": "^" + aspectVersion,
      "@typescript-eslint/eslint-plugin": "^4.22.0",
      "@typescript-eslint/parser": "^4.22.0",
      assemblyscript: "^" + compilerVersion,
      eslint: "^7.17.0",
    },
    dependencies: {
      "@assemblyscript/loader": "^" + compilerVersion,
      typescript: "^4.2.4",
    },
  };
  getContent(): string {
    return JSON.stringify(this.pkgObj, null, 2);
  }
  updateOldContent = (old: string): string => {
    let pkgOldObj = JSON.parse(old);
    let scripts = pkgOldObj.scripts || {};
    if (!scripts["build"]) {
      scripts["build:untouched"] = this.pkgObj.scripts["build:untouched"];
      scripts["build:optimized"] = this.pkgObj.scripts["build:optimized"];
      scripts["build"] = this.pkgObj.scripts.build;
      pkgOldObj["scripts"] = scripts;
    }
    if (!scripts["test"] || scripts["test"] == npmDefaultTest) {
      scripts["test"] = this.pkgObj.scripts.test;
      scripts["test:ci"] = this.pkgObj.scripts["test:ci"];
      pkgOldObj["scripts"] = scripts;
    }

    let dependencies = pkgOldObj["dependencies"] || {};
    if (!dependencies["@assemblyscript/loader"]) {
      dependencies["@assemblyscript/loader"] = "^" + compilerVersion;
      pkgOldObj["dependencies"] = dependencies;
    }

    let devDependencies = pkgOldObj["devDependencies"] || {};
    if (!devDependencies["assemblyscript"]) {
      devDependencies["assemblyscript"] = "^" + compilerVersion;
      pkgOldObj["devDependencies"] = devDependencies;
    }

    return JSON.stringify(pkgOldObj, null, 2);
  };
}
