const fs = require("fs");
const compiler = require("vue-template-compiler");

const generateTargetScript = (framework, sfcTargetScript) => {
  if (sfcTargetScript === undefined) {
    return "";
  }
  const defaultScript =
    framework === "tdesign-vue"
      ? "export default {};"
      : "import { ref } from 'vue';";

  return `<script ${framework === "tdesign-vue-next" ? "setup" : ""}>${
    sfcTargetScript || defaultScript
  }</script>`;
};

const emptyDirCheck = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const getExistScript = (path) => {
  if (fs.existsSync(path)) {
    const { script } = compiler.parseComponent(fs.readFileSync(path, "utf8"));
    return script?.content;
  }
  return null;
};

const getStyleAttrs = (attrs) => {
  return Object.keys(attrs)
    .map((key) => (attrs[key] === true ? key : `${key}="${attrs[key]}"`))
    .join(" ");
};

exports.transDemos = async (components, fromFramework, targetFramework) => {
  console.log(components)
  components.forEach((component) => {
    const demoDirPath = `./${fromFramework}/examples/${component}/demos`;
    const demos = fs.readdirSync(demoDirPath);

    demos.forEach((demo) => {
      const targetFileName = `./${targetFramework}/examples/${component}/demos/${demo}`;

      emptyDirCheck(`./${targetFramework}/examples/${component}/demos`);

      const { template, styles } = compiler.parseComponent(
        fs.readFileSync(`${demoDirPath}/${demo}`, "utf8")
      );

      const sfcTargetContent = `<template>${
        template.content
      }</template>\n${generateTargetScript(
        targetFramework,
        getExistScript(targetFileName)
      )}\n${styles
        .map(
          (style) =>
            `<style ${getStyleAttrs(style.attrs)}>${style.content}</style>`
        )
        .join("\n")}`;

      fs.writeFileSync(targetFileName, sfcTargetContent);
    });
  });
};

const fileCompile = (content) => {
  return content
    .replace("'vue'", "'@vue/composition-api'")
    .replace("'tdesign-icons-vue-next'", "'tdesign-icons-vue'");
};

exports.transComponents = async (
  components,
  fromFramework,
  targetFramework
) => {
  const detailWith = (dirPath) => {
    const files = fs.readdirSync(`./${fromFramework}/${dirPath}`);
    files.forEach((filename) => {
      const targetFileName = `./${fromFramework}/${dirPath}/${filename}`;

      if (fs.lstatSync(targetFileName).isDirectory()) {
        emptyDirCheck(`./${targetFramework}/${dirPath}/${filename}`);
        detailWith(`${dirPath}/${filename}`);
        return;
      }

      const content = fs.readFileSync(
        `./${fromFramework}/${dirPath}/${filename}`,
        "utf8"
      );

      fs.writeFileSync(
        `./${targetFramework}/${dirPath}/${filename}`,
        fileCompile(content)
      );
    });
  };

  try {
    components.forEach((component) => {
      emptyDirCheck(`./${targetFramework}/src/${component}`);
      const dirPath = `src/${component}`;
      detailWith(dirPath);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
