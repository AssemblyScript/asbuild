import { InitFile } from "../interfaces";
import { version as aspectVersion } from "@as-pect/cli/lib";
import { version as asVersion } from "../../../../asc";

// as-pect need ^0.18.7
const compilerVersion = asVersion >= "0.18.7" ? asVersion : "0.18.7";

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
      lint: 'asb fmt "assembly/**/*.ts" --lint',
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
      asbuild: "latest",
      eslint: "^7.17.0",
      typescript: "^4.2.4",
    },
    dependencies: {
      "@assemblyscript/loader": "^" + compilerVersion,
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

    if (!scripts["lint"] || scripts["lint"] == npmDefaultTest) {
      scripts["lint"] = this.pkgObj.scripts.lint;
      scripts["lint:fix"] = this.pkgObj.scripts["lint:fix"];
      pkgOldObj["scripts"] = scripts;
    }

    let dependencies = pkgOldObj["dependencies"] || {};
    for (const [key, value] of Object.entries(this.pkgObj.dependencies)) {
      if (!dependencies[key]) dependencies[key] = value;
    }
    pkgOldObj["dependencies"] = dependencies;

    let devDependencies = pkgOldObj["devDependencies"] || {};
    for (const [key, value] of Object.entries(this.pkgObj.devDependencies)) {
      if (!devDependencies[key]) devDependencies[key] = value;
    }
    pkgOldObj["devDependencies"] = devDependencies;

    return JSON.stringify(pkgOldObj, null, 2);
  };
}
