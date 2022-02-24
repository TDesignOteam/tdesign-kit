const fs = require("fs");
const { emptyDirCheck } = require("./utils");
const { jsxCompiler } = require("../compiler/index");

module.exports = async (components, fromFramework, targetFramework) => {
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
        jsxCompiler(content)
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
