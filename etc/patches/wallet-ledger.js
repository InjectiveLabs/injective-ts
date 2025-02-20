/* eslint-disable no-console */
const { copyFileSync, mkdirSync } = require('node:fs')
const path = require('node:path')

const storePatches = async () => {
  const dirPath = path.resolve(__dirname, '../../patches')
  const outDirPath = path.resolve(
    __dirname,
    '../../packages/wallets/wallet-trezor/patches',
  )
  const patches = ['@trezor+connect-web+9.4.5.patch']

  mkdirSync(outDirPath, { recursive: true })

  try {
    patches.forEach((patch) => {
      copyFileSync(
        path.resolve(dirPath, patch),
        path.resolve(outDirPath, patch),
      )
    })

    console.log(`✅✅✅ Patches applied`)
  } catch (e) {
    console.error(`❌❌❌ Patches NOT applied`)
    throw e
  }
}

;(async () => await storePatches())()
