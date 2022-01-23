const { log, logError } = require("../utils/logger");
const { getFramework, getComponents } = require("./helper/index");
const { trans } = require("./helper/file");

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
    // const fromFramework = await getFramework('from');
    // const targetFramework = fromFramework === 'tdesign-vue' ? 'tdesign-vue-next' : 'tdesign-vue'
    // const components = await getComponents(fromFramework);
    // await trans(components, fromFramework, targetFramework)
    const components = ["rate"];
    const fromFramework = "tdesign-vue-next";
    const targetFramework = "tdesign-vue";
    await trans(components, fromFramework, targetFramework);

    // await spawn("npx", ['prettier', '--write', 'examples/**/demos/**.vue'], { cwd: `./${targetFramework}` });

    log(`👌转换完成`);
  } catch (e) {
    logError(e);
  }
};
