import chalk from 'chalk'
import gradient from 'gradient-string'

export const logScreen = (content: string) => {
  return (
    console.log(`${chalk.bold(
      gradient(["#699ef5", "#0052d9"]).multiline(
        content + "\n"
      )
    )}`)
  );
}

export const log = (content: string) => {
  return (
    console.log(`${chalk.bold(
      gradient(["#699ef5", "#0052d9"])("tdesign-kit：")
    )}${chalk.grey(content)}`)
  );
}

export const logError = (content: string) => {
  return (
    console.log(`🐞 ${chalk.redBright(
      content
    )}`)
  );
}


export const gradientString = (content: string) => {
  return `${chalk.bold(
    gradient(["#699ef5", "#0052d9"])(content)
  )}`
}
