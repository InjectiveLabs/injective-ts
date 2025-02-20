/* eslint-disable no-console */
const { copyFileSync, mkdirSync } = require('node:fs')
const path = require('node:path')

const storePatches = async () => {
  const dirPath = path.resolve(__dirname, '../../patches')
  const outDirPath = path.resolve(
    __dirname,
    '../../packages/wallets/wallet-ledger/patches',
  )
  const patches = [
    '@ledgerhq+hw-app-cosmos+6.30.4.patch',
    '@ledgerhq+hw-app-eth+6.42.0.patch',
    '@ledgerhq+hw-transport-webhid+6.29.4.patch',
    '@ledgerhq+hw-transport-webusb+6.29.4.patch',
    '@ledgerhq+hw-transport+6.31.4.patch',
  ]

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
