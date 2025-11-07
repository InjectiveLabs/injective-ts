import baseConfig from '../../jest.config.js'

export default {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
}
