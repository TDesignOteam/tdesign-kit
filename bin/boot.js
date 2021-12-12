#!/usr/bin/env node
const program = require('commander')
const version = require('../package.json').version
program.version(version)
const chalk = require("chalk");

const { promisify } = require('util')
const { logScreen } = require("../lib/logger")
const figlet = promisify(require('figlet'))
const clear = require('clear')

const welcome = async () => {
  clear()
  const data = await figlet('TC-FLIGHT Siskin-Cli', {
    font: "Slant",
    horizontalLayout: "fitted",
    verticalLayoutL: "fitted",
  })
  logScreen(data)
  console.log(chalk.gray(`Siskin-Cli:${version}`))
}

welcome().then(res => {
  program
  program
    .command('init <name>')
    .description('init project')
    .action(require('../lib/init'))

  program
    .command('refresh')
    .description('monitoring vue2.0 adn vue3.0')
    .action(require('../lib/refresh'))

  program
    .command('vue-next-check')
    .alias('vnc')
    .option("--vue", "🚀  scan .vue file: default select")
    .option("--js", "🛩  scan .js file")
    .option("-p <path>", "🏎 scan file path Exp: ./**/*.{vue,js}")
    .action(require('../lib/vnc'))

  program.parse(process.argv)
})