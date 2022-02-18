import { log, logError } from '../utils/logger'
import { transDemos, transComponents } from './helper/file'
import { getFramework, getComponents } from './helper/index'
import child_process from 'child_process'

const spawn = async (...args: any[]): Promise<void> => {
  
  return new Promise((resolve) => {
    const proc = child_process.spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = async () => {
  // check template
  try {
    const fromFramework = await getFramework('from');
    const targetFramework = fromFramework === 'tdesign-vue' ? 'tdesign-vue-next' : 'tdesign-vue'
    const components = await getComponents(fromFramework);

    log(`🧱 transfer demos`);

    // await transDemos(components, fromFramework, targetFramework);

    // log(`🧱 transfer components`);

    await transComponents(components, fromFramework, targetFramework);

    // log(`🚀 formate file start`);

    await spawn("npx", ['pretty-quick'], { cwd: `./${targetFramework}` });

    log(`👌 finish`);
  } catch (e) {
    logError(e);
  }
};
