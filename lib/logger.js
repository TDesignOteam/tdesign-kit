const chalk = require("chalk");
const gradient = require("gradient-string");

exports.logScreen = (content) => {
  return (
    console.log(`${chalk.bold(
      gradient(["cyan","#3DBAA2", "#19C580"]).multiline(
        content + "\n"
      )
    )}`)
  );
}

exports.log = (content) => {
  return (
    console.log(`${chalk.bold(
      gradient(["#3DBAA2", "#19C580"])("siskin-cli：")
    )}${chalk.grey(content)}`)
  );
}

exports.logError = (content) => {
  return (
    console.log(`${chalk.redBright(
      content
    )}`)
  );
}


exports.gradientString = (content) => {
  return `${chalk.bold(
    gradient(["#3DBAA2", "#19C580"])(content)
  )}`
}
