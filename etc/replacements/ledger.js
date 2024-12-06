const { readFile, writeFile } = require('fs')

const isCJS = process.env.BUILD_MODE.includes('cjs')
const isESM = process.env.BUILD_MODE.includes('esm')

const REPLACEMENT_PAIRS = [
  {
    path: './src/strategy/Ledger/Base.ts',
    cjs: '@ledgerhq/hw-app-eth/lib/services/ledger/index.js',
    esm: '@ledgerhq/hw-app-eth/lib-es/services/ledger/index.js',
  },
]

for (const pair of REPLACEMENT_PAIRS) {
  readFile(pair.path, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err)
      return
    }

    if (isCJS) {
      const updatedData = data.replace(new RegExp(pair.esm, 'g'), pair.cjs)

      writeFile(pair.path, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err)
          return
        }

        console.log(`Replaced in ${pair.path} for CJS`)
      })
    }

    if (isESM) {
      const updatedData = data.replace(new RegExp(pair.cjs, 'g'), pair.esm)

      writeFile(pair.path, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err)
          return
        }

        console.log(`Replaced in ${pair.path} for ESM`)
      })
    }
  })
}
