const chalk = require("chalk");
const gradient = require("gradient-string");

exports.logScreen = (content) => {
  return (
    console.log(`${chalk.bold(
      gradient(["#699ef5", "#0052d9"]).multiline(
        content + "\n"
      )
    )}`)
  );
}

exports.log = (content) => {
  return (
    console.log(`${chalk.bold(
      gradient(["#699ef5", "#0052d9"])("tdesign-kit：")
    )}${chalk.grey(content)}`)
  );
}

exports.logError = (content) => {
  return (
    console.log(`🐞 ${chalk.redBright(
      content
    )}`)
  );
}


exports.gradientString = (content) => {
  return `${chalk.bold(
    gradient(["#699ef5", "#0052d9"])(content)
  )}`
}
