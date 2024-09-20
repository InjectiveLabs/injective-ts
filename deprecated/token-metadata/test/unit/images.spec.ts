import tokensBySymbol from '../../src/tokens/tokens'
import fs from 'fs'
import path from 'path'

describe('TokenMetadataImages', () => {
  for (const symbol in tokensBySymbol) {
    const tokenMetadata = tokensBySymbol[symbol]

    if (!tokenMetadata.logo) {
      return
    }

    test(`logo exists for ${symbol}`, () => {
      const logoPath = path.resolve(
        './packages/token-metadata/src/images',
        tokenMetadata.logo,
      )

      expect(tokenMetadata.logo).toBeDefined()
      expect(fs.existsSync(logoPath)).toEqual(true)
    })
  }
})
