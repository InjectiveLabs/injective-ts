const baseConfig = require('../../jest.config.js')

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.build.esm.json',
    },
  },
}
