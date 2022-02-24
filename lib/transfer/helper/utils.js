exports.emptyDirCheck = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
