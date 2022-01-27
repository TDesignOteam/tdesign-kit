const { log, logError } = require("../utils/logger");
const { getFramework, getComponents } = require("./helper/index");
const { transDemos, transComponents } = require("./helper/file");
const ora = require('ora')

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
  // check template
  try {
    const fromFramework = await getFramework('from');
    const targetFramework = fromFramework === 'tdesign-vue' ? 'tdesign-vue-next' : 'tdesign-vue'
    const components = await getComponents(fromFramework);
    await trans(components, fromFramework, targetFramework)

    log(`🧱 transfer demos`);

    await transDemos(components, fromFramework, targetFramework);

    // log(`🧱 transfer components`);

    // await transComponents(components, fromFramework, targetFramework);

    // log(`🚀 formate file start`);

    await spawn("npx", ['pretty-quick'], { cwd: `./${targetFramework}` });

    log(`👌 finish`);
  } catch (e) {
    logError(e);
  }
};
