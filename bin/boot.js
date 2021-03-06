#!/usr/bin/env node
const program = require('commander')
const { promisify } = require('util')
const version = require('../package.json').version
const chalk = require("chalk");

const { logScreen } = require("../lib/utils/logger.js")
const figlet = promisify(require('figlet'))
const clear = require('clear')

program.version(version);

const welcome = async () => {
  clear();
  const data = await figlet("TDesignKit", {
    font: "Slant",
    horizontalLayout: "fitted",
    verticalLayoutL: "fitted",
  });
  logScreen(data);
  console.log(chalk.gray(`tdesign-kit:${version}`));
};

welcome().then((res) => {
  program;
  program
  .command("trans")
  .description("transfer code")
  .action(require("../lib/transfer/index.js"));

  program
    .command("vue-next-check")
    .alias("vnc")
    .option("--vue", "🚀  scan .vue file: default select")
    .option("--js", "🛩  scan .js file")
    .option("-p <path>", "🏎 scan file path Exp: ./**/*.{vue,js}")
    .action(require("../lib/vnc"));

  program.parse(process.argv);
});
