import inquirer from 'inquirer';
import fs from 'fs';
const supportList = ['tdesign-vue', 'tdesign-vue-next'];

export const getFramework = async (type: string) => {
  const files = fs
    .readdirSync('./')
    .filter((fileName) => fileName.indexOf('.') === -1)
    .filter((fileName) => {
      if (fs.existsSync(`./${fileName}/package.json`)) {
        const res = fs.readFileSync(`./${fileName}/package.json`);
        return JSON.parse(res.toString()).name;
      }
    })
    .filter((pkg) => supportList.indexOf(pkg) > -1);

  if (files.length < 2) {
    throw 'there are at least two repo';
  }

  const question = {
    type: 'list',
    name: 'framework',
    scroll: false,
    message: `please select ${type == 'from' ? 'code source' : 'transfer target'} framework that ${
      type == 'from' ? 'provide the source code' : 'accept the product'
    }.`,
    choices: files.map((pkg) => ({
      value: pkg,
      name: pkg.name
    }))
  };
  const { framework } = await inquirer.prompt(question);
  return framework;
};

export const getComponents = async (framework: string) => {
  const componentList = fs.readdirSync(`./${framework}/examples`);
  const question = {
    type: 'checkbox',
    name: 'component',
    scroll: true,
    message: 'Select build repo',
    choices: ['all', ...componentList]
  };
  const { component } = await inquirer.prompt(question);
  if (!component.length) {
    throw 'please select at least one component';
  }
  if (component.includes('all')) return componentList;
  return component;
};
