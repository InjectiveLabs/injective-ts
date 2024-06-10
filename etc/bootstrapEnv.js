const fs = require('fs')

const getDirectories = () =>
  fs
    .readdirSync('packages', { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name)

const main = () => {
  const packages = getDirectories()

  packages.forEach((packageName) => {
    const path = `packages/${packageName}/dist`
    const esmPath = `packages/${packageName}/dist/esm`
    const cjsPath = `packages/${packageName}/dist/cjs`

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }

    if (!fs.existsSync(esmPath)) {
      fs.mkdirSync(esmPath)
    }

    if (!fs.existsSync(cjsPath)) {
      fs.mkdirSync(cjsPath)
    }
  })
}

main()
