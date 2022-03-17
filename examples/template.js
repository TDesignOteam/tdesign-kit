const fs = require("fs");
const compiler = require("vue-template-compiler");

const templateCompiler = require("../lib/transfer/compiler/template");

const { template } = compiler.parseComponent(
  fs.readFileSync('./examples/demo.vue', "utf8")
);

const res = templateCompiler(template.content);

console.log(res);
