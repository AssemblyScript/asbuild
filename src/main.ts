import { main } from "./cli";

main(process.argv.slice(2), {}, (err) => {
  if (err) {
    throw err;
  }
  return 1;
})