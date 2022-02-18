import fs from 'fs';
import sfcCompiler from 'vue-template-compiler';

const generateTargetScript = (framework: string, sfcTargetScript: string | null | undefined): string => {
  if (sfcTargetScript === undefined) {
    return '';
  }
  const defaultScript = framework === 'tdesign-vue' ? 'export default {};' : "import { ref } from 'vue';";

  return `<script ${framework === 'tdesign-vue-next' ? 'setup' : ''}>${sfcTargetScript || defaultScript}</script>`;
};

const emptyDirCheck = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const getExistScript = (path: string) => {
  if (fs.existsSync(path)) {
    const { script } = sfcCompiler.parseComponent(fs.readFileSync(path, 'utf8'));
    return script?.content;
  }
  return null;
};

const getStyleAttrs = (attrs: any) => {
  return Object.keys(attrs)
    .map((key: any) => (attrs[key] === true ? key : `${key}="${attrs[key]}"`))
    .join(' ');
};

export const transDemos = async (components: string[], fromFramework: string, targetFramework: string) => {
  components.forEach((component) => {
    const demoDirPath = `./${fromFramework}/examples/${component}/demos`;
    const demos = fs.readdirSync(demoDirPath);

    demos.forEach((demo) => {
      const targetFileName = `./${targetFramework}/examples/${component}/demos/${demo}`;

      emptyDirCheck(`./${targetFramework}/examples/${component}/demos`);

      const { template, styles } = sfcCompiler.parseComponent(fs.readFileSync(`${demoDirPath}/${demo}`, 'utf8'));

      const sfcTargetContent = `<template>${template?.content}</template>\n${generateTargetScript(
        targetFramework,
        getExistScript(targetFileName)
      )}\n${styles.map((style) => `<style ${getStyleAttrs(style.attrs)}>${style.content}</style>`).join('\n')}`;

      fs.writeFileSync(targetFileName, sfcTargetContent);
    });
  });
};

const fileCompile = (content: string) => {
  return content.replace("'vue'", "'@vue/composition-api'").replace("'tdesign-icons-vue-next'", "'tdesign-icons-vue'");
};

export const transComponents = async (components: string[], fromFramework: string, targetFramework: string) => {
  const detailWith = (dirPath: string) => {
    const files = fs.readdirSync(`./${fromFramework}/${dirPath}`);
    files.forEach((filename) => {
      const targetFileName = `./${fromFramework}/${dirPath}/${filename}`;

      if (fs.lstatSync(targetFileName).isDirectory()) {
        emptyDirCheck(`./${targetFramework}/${dirPath}/${filename}`);
        detailWith(`${dirPath}/${filename}`);
        return;
      }

      const content = fs.readFileSync(`./${fromFramework}/${dirPath}/${filename}`, 'utf8');

      fs.writeFileSync(`./${targetFramework}/${dirPath}/${filename}`, fileCompile(content));
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
