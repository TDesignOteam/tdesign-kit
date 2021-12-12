const scanner = require("./scanHelper/index");
const path = require("path");
const { logError } = require("./logger")

module.exports = async (cmd) => {
  if (cmd.p) {
    scanner.run(cmd.p);
    return;
  }
  if (cmd.vue && cmd.js) {
    scanner.run(path.resolve("."), ".{vue,js}");
    return;
  }

  if (cmd.vue) {
    scanner.run(path.resolve("."), ".vue");
    return;
  }

  if (cmd.js) {
    scanner.run(path.resolve("."), ".js");
    return;
  }

  logError('🙅 please use arg --vue or --js or -p; command siskin vnc -h for detail')
}