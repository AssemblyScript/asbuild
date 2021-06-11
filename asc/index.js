const path = require("path");

function findAsc() {
  try {
    // Try to find an assemblyscript not in local node_modules
    return require(require.resolve("assemblyscript/cli/asc", { paths : [path.join(__dirname, "..", "..", "..")]}));
  } catch (e) {
    // default to local node_modules
    return require("assemblyscript/cli/asc");
  }
}

module.exports = findAsc();