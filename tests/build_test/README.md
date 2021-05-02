### Example of a workspace

asconfig.json:
```
{
  "workspaces": [
    "./complex",
    "./debug",
    "./extends",
    "./simple"
  ],
  "outDir": "../../build"
}
```

```
ts-node ../src/main.ts
```

results in:
```
../build/
  release/
    debug-test-build.wasm
    extends-test-build.wasm main.wasm
    simple-test-build.wasm
```