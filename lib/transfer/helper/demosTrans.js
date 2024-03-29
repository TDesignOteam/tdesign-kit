const fs = require("fs");
const compiler = require("vue-template-compiler");
const { emptyDirCheck } = require("./utils");

const getStyleAttrs = (attrs) => {
  return Object.keys(attrs)
    .map((key) => (attrs[key] === true ? key : `${key}="${attrs[key]}"`))
    .join(" ");
};

const getScriptAttrs = (attrs) => {
  if (!attrs) return '';
  return Object.keys(attrs)
    .filter((key) => key !== "setup")
    .map((key) => (attrs[key] === true ? key : `${key}="${attrs[key]}"`))
    .join(" ");
};

const generateTargetScript = (framework, sfcTargetScript, script) => {
  if (sfcTargetScript === undefined) {
    return "";
  }
  const defaultScript =
    framework === "tdesign-vue"
      ? "export default {};"
      : "import { ref } from 'vue';";

  return `<script ${
    framework === "tdesign-vue-next" ? "setup" : ""
  } ${getScriptAttrs(script?.attrs)}>${
    sfcTargetScript || defaultScript
  }</script>`;
};

const generateStyle = (styles) => {
  return styles.map(
    (style) => `<style ${getStyleAttrs(style.attrs)}>${style.content}</style>`
  );
};

const getExistScript = (path) => {
  if (fs.existsSync(path)) {
    const { script } = compiler.parseComponent(fs.readFileSync(path, "utf8"));
    return script?.content;
  }
  return null;
};

module.exports = async (components, fromFramework, targetFramework) => {
  components.forEach((component) => {
    const demoDirPath = `./${fromFramework}/src/${component}/_example`;
    const demos = fs.readdirSync(demoDirPath);

    demos.forEach((demo) => {
      const targetFileName = `./${targetFramework}/src/${component}/_example/${demo}`;

      emptyDirCheck(`./${targetFramework}/src/${component}/_example`);

      const { template, script, styles } = compiler.parseComponent(
        fs.readFileSync(`${demoDirPath}/${demo}`, "utf8")
      );

      const sfcTargetContent = `
        <template>
          ${template.content}
        </template>
        ${generateTargetScript(
          targetFramework,
          getExistScript(targetFileName),
          script
        )}
        ${generateStyle(styles)}
      `;

      fs.writeFileSync(targetFileName, sfcTargetContent);
    });
  });
};
