if (!ASC_NO_ASSERT) {
  assert(false, "noAssert should be true");
}

const arr1: StaticArray<u8> = [1,2,3];


let arr2 = Uint8Array.wrap(changetype<ArrayBuffer>(arr1));

assert(arr2[0] == arr1[0])