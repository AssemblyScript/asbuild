import { InitFile } from "../interfaces";
import { version as aspectVersion } from "@as-pect/cli/package.json";

// import { version as compilerVersion } from "assemblyscript/package.json";
const compilerVersion = "0.18.7";
// NOTE:-
// Hardcoded the compilerVersion for now, hope to resolve this in future
// Tried almost everything, but importing "assemblyscript/package.json" always fail.
// code compiles fine, but during runtime, throws module not found error
// Error: Cannot find module '/home/oreki_clr/Projects/asbuild/node_modules/assemblyscript/package.json.js'

const npmDefaultTest = 'echo "Error: no test specified" && exit 1';

enum PackageManager {
  NPM = "npm",
  Yarn = "yarn",
  PNPM = "pnpm",
}

interface PMCommand {
  test: string;
  install: string;
  run: string;
}

function getPm(): PackageManager {
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

function getPmCommands(): PMCommand {
  switch (getPm()) {
    case PackageManager.PNPM:
      return {
        install: "pnpm install",
        run: "pnpm run",
        test: "pnpm test",
      };

    case PackageManager.Yarn:
      return {
        install: "yarn install",
        run: "yarn",
        test: "yarn test",
      };

    default:
      return {
        install: "npm install",
        run: "npm run",
        test: "npm test",
      };
  }
}

export class PackageJsonFile extends InitFile {
  path = "package.json";
  pm = "npm";
  pkgObj = {
    scripts: {
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
      assemblyscript: "^" + compilerVersion,
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
