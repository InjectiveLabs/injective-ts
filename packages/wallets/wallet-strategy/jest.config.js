import baseConfig from '../../../jest.config.js'

export default {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
}
