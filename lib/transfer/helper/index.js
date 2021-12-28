const inquirer = require("inquirer");
const fs = require("fs");
const supportList = ["tdesign-react", "tdesign-vue", "tdesign-vue-next"];

exports.getFrameworkInquirer = async () => {
  const files = fs
    .readdirSync("./")
    .filter((fileName) => fileName.indexOf(".") === -1)
    .filter((fileName) => {
      if (fs.existsSync(`./${fileName}/package.json`)) {
        const res = fs.readFileSync(`./${fileName}/package.json`);
        return JSON.parse(res.toString()).name;
      }
    })
    .filter((package) => supportList.indexOf(package) > -1);

  if (files.length < 2) {
    throw "there are at least two repo";
  }

  const question = {
    type: "list",
    name: "template",
    scroll: false,
    message: "Select template",
    choices: files.map((package) => ({
      value: package,
      name: package.name,
    })),
  };
  let { template } = await inquirer.prompt(question);
  return template;
};

exports.getComponentsPrompt = async (framework) => {
  const componentList = fs.readdirSync(`./${framework}/examples`);
  const question = {
    type: "checkbox",
    name: "component",
    scroll: true,
    message: "Select build repo",
    choices: ["all", ...componentList],
  };
  let { component } = await inquirer.prompt(question);
  if (component.includes("all")) return componentList;
  return component;
};
