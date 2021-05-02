// The entry file of your WebAssembly module.
/// <reference types="visitor-as/dist/examples/list" />

export function add(a: i32, b: i32): i32 {
  return a + b;
}

//@ts-ignore
@list
class Foo {
  a: string;
  b: u32;
}