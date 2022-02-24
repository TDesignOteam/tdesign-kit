const { log, logError } = require("../utils/logger");
const { getFramework, getComponents, getType } = require("./helper/inquirer");
const demosTrans = require("./helper/demosTrans");
const componentsTrans = require("./helper/componentsTrans");

const spawn = async (...args) => {
  const { spawn } = require("child_process");
  return new Promise((resolve) => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = async (name) => {
  try {
    const fromFramework = await getFramework("from");
    const targetFramework =
      fromFramework === "tdesign-vue" ? "tdesign-vue-next" : "tdesign-vue";
    const components = await getComponents(fromFramework);
    const type = await getType();

    if (["all", "demos"].includes(type)) {
      log(`🧱 transfer demos`);
      await demosTrans(components, fromFramework, targetFramework);
    }

    if (["all", "component"].includes(type)) {
      log(`🧱 transfer components`);
      await componentsTrans(components, fromFramework, targetFramework);
    }

    log(`🚀 formate file start`);
    await spawn("npx", ["pretty-quick"], { cwd: `./${targetFramework}` });

    log(`👌 finish`);
  } catch (e) {
    logError(e);
  }
};
