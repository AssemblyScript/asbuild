# ASBuild

A simple build tool for [AssemblyScript](https://assemblyscript.org) projects, similar to `cargo`, etc.

## Usage
```
asb [entry file] [options] -- [args passed to asc]
```

### Background

AssemblyScript greater than v0.14.4 provides a `asconfig.json` configuration file that can be used to describe the options for building a project. ASBuild uses this and some adds defaults to create an easier CLI interface.

#### Defaults

 - If no entry file passed and no `main` field is in `asconfig.json`, `baseDir/assembly/index.ts` is assumed.
 - `asconfig.json` allows for options for different compile targets, e.g. release, debug, etc.  `asc` and this default to the release target
 - The default build directory is `./build`, and artifacts are placed at `./build/<target>/packageName.wasm`.

## Future

Add workspace functionality so that multiple files can be compiled at once.
