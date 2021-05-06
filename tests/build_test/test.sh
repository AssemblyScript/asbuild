#!/bin/bash
set -e

# export NODE_OPTIONS='--experimental-wasi-unstable-preview1 --no-warnings'

for repo in */; do
  printf "\e[1;34m%s\e[0m \n" "Testing: $repo"
  (cd "$repo"; yarn test)
done

if test -d "../../build"; then
  rm -rf ../../build;
fi

yarn test;

wasmFiles=(../../build/release/*.wasm)
num=${#wasmFiles[@]}
echo "Testing workspaces.."
if (( "$num" != 4)); then
  echo "Failed to compile worksapce"
  exit 1;
fi
echo "Passed"
