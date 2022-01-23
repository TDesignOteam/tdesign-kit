const fs = require("fs");
const compiler = require("vue-template-compiler");

exports.trans = async (components, fromFramework, targetFramework) => {
  components.forEach((component) => {
    const demos = fs.readdirSync(
      `./${fromFramework}/examples/${component}/demos`
    );
    demos.forEach((demo) => {
      const targetFileName = `./${targetFramework}/examples/${component}/demos/${demo}`;
      
      if(fs.existsSync(`./${targetFramework}/examples/${component}/demos/${demo}`)) {
        
      }

      let sfcTargetContent = "";

      const { template, styles } = compiler.parseComponent(
        fs.readFileSync(
          `./${fromFramework}/examples//${component}/demos/${demo}`,
          "utf8"
        )
      );

      let sfcTargetScript = "";
      if (fs.existsSync(targetFileName)) {
        const { script } = compiler.parseComponent(
          fs.readFileSync(targetFileName, "utf8")
        );
        sfcTargetScript = script.content;
      }

      sfcTargetContent += `<template>${template.content}</template>\n`;
      sfcTargetContent += sfcTargetScript ? `<script>${sfcTargetScript}</script>\n` : '';
      styles.forEach((style) => {
        sfcTargetContent += `<style>${style.content}</style>`;
      });

      const writeSfc = () => {
        fs.writeFileSync(targetFileName, sfcTargetContent);
      };

      writeSfc();
    });
  });
};
