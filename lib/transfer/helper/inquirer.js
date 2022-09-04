const inquirer = require("inquirer");
const fs = require("fs");
const supportList = ["tdesign-vue", "tdesign-vue-next"];

exports.getFramework = async (type) => {
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
    name: "framework",
    scroll: false,
    message: `please select ${
      type == "from" ? "code source" : "transfer target"
    } framework that ${
      type == "from" ? "provide the source code" : "accept the product"
    }.`,
    choices: files.map((package) => ({
      value: package,
      name: package.name,
    })),
  };
  let { framework } = await inquirer.prompt(question);
  return framework;
};

exports.getComponents = async (framework) => {
  const componentList = fs
    .readdirSync(`./${framework}/src`)
    .filter((item) => !item.startsWith("_"));
  const question = {
    type: "checkbox",
    name: "component",
    scroll: true,
    message: "Select build repo",
    choices: ["custom-input", ...componentList],
  };
  let { component } = await inquirer.prompt(question);
  if (!component.length) {
    throw "please select at least one component";
  }
  if (component.includes("custom-input")) {
    const question2 = {
      type: "input",
      name: "component",
      message: "custom input component name",
    };
    let { component } = await inquirer.prompt(question2);
    return [component];
  }
  if (component.includes("all")) return componentList;
  return component;
};

exports.getType = async () => {
  const question = {
    type: "list",
    name: "type",
    scroll: true,
    message: "Select build repo",
    choices: ["demos", "component", "all"],
  };
  let { type } = await inquirer.prompt(question);
  return type;
};
