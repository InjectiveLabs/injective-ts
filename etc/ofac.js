/* eslint-disable no-console */
const { dirname } = require('node:path')
const { mkdirSync, existsSync, writeFileSync } = require('node:fs')

const storeJsonFile = (path, data) => {
  const dirPath = dirname(path)

  if (!existsSync(dirPath)) {
    try {
      mkdirSync(dirPath, { recursive: true })
    } catch (e) {
      console.log('❌❌❌ Error creating directory', e)
    }
  }

  try {
    writeFileSync(path, data)
  } catch (e) {
    console.error(`❌❌❌ Error creating JSON file: ${path}`, e)
  }
}

const fetchOfac = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/InjectiveLabs/injective-lists/master/wallets/ofacAndRestricted.json',
  )
  const wallets = await response.text()

  try {
    storeJsonFile(`src/json/ofac.ts`, `export const ofacWallets = ${wallets}`)

    console.log(`✅✅✅ OFAC list fetched`)
  } catch (e) {
    console.error(`❌❌❌ OFAC list NOT fetched`)
    throw e
  }
}

;(async () => await fetchOfac())()
