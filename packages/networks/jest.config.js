import baseConfig from '../../jest.config.js'

export default {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.build.esm.json',
    },
  },
}
