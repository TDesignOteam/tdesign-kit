const { clone } = require("../init/download");
const { log, logError } = require("../utils/logger");
const open = require("open");
const { getFrameworkInquirer, getComponentsPrompt } = require("./helper/index")

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
    // const framework = await getFrameworkInquirer();
    const components = await getComponentsPrompt('tdesign-vue');
    console.log(components)
    // await clone(repo, name);
    // auto install
    log("安装依赖");
    // await spawn("yarn", ["install"], { cwd: `./${name}` });

    log(`
      👌安装完成：
      cd ${name}
      yarn dev
    `);

    // run
    // await spawn("yarn", ["run", "serve"], { cwd: `./${name}` });

    // open();
  } catch (e) {
    logError(e);
  }
};
