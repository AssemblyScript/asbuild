# ASBuild

A simple build tool for [AssemblyScript](https://assemblyscript.org) projects, similar to `cargo`, etc.

## Usage
```
asb [entry file] [options] -- [args passed to asc]
```

### Background

AssemblyScript greater than v0.14.4 provides a `asconfig.json` configuration file that can be used to describe the options for building a project. ASBuild uses this and some defaults to create an easier CLI interface.


### Defaults

#### Project structure

```
project/
  package.json   
  asconfig.json
  assembly/
    index.ts
  build/
    release/
      project.wasm
    debug/
      project.wasm
```
 - If no entry file passed and no `entry` field is in `asconfig.json`, `project/assembly/index.ts` is assumed.
 - `asconfig.json` allows for options for different compile targets, e.g. release, debug, etc.  `asc` defaults to the release target.
 - The default build directory is `./build`, and artifacts are placed at `./build/<target>/packageName.wasm`.

### Workspaces

If a `workspace` field is added to a top level `asconfig.json` file, then each path in the array is built and placed into the top level `outDir`.

For example,

`asconfig.json`:
```json
{
  "workspaces": ["a", "b"]
}
```

Running `asb` in the directory below will use the top level build directory to place all the binaries.

```
project/
  package.json
  asconfig.json
  a/
    asconfig.json
    assembly/
      index.ts
  b/
    asconfig.json
    assembly/
      index.ts
  build/
    release/
      a.wasm
      b.wasm
    debug/
      a.wasm
      b.wasm
```

To see an example in action check out the [test workspace](./test)
