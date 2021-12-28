const { promisify } = require('util')

module.exports.clone = async function(repo, desc) {
  const download = promisify(require('download-git-repo'))
  const ora = require('ora')
  const process = ora(`下载...${repo}`)
  process.start()
  try {
    const res = await(download(repo, desc))
    process.succeed()
  } catch(e) {
    console.log(e)
    process.fail(`download ${repo} fial`)
    throw ''
  }
}