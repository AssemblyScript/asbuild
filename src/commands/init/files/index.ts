import { AspectConfigFile } from "./aspecConfig";
import { AsconfigJsonFile } from "./asconfigJson";
import { AssemblyIndexFile, TsConfigFile } from "./assembly_files";
import { BuildGitignoreFile, RootGitignoreFile } from "./gitignores";
import { IndexJsFile } from "./indexJs";
import { PackageJsonFile } from "./packageJson";
import { AsPectTypesFile, ExampleTestFile } from "./test_files";
import { EslintConfigFile } from "./eslintConfig";

export const initFiles = [
  // /
  new RootGitignoreFile(),
  new PackageJsonFile(),
  new IndexJsFile(),
  new AsconfigJsonFile(),
  new AspectConfigFile(),
  new EslintConfigFile(),
  // build/
  new BuildGitignoreFile(),
  // assembly/
  new AssemblyIndexFile(),
  new TsConfigFile(),
  // assembly/__tests__
  new AsPectTypesFile(),
  new ExampleTestFile(),
];
