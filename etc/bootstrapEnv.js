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

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  })
}

main()
