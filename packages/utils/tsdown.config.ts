import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    http: './src/http.ts',
    index: './src/index.ts',
    light: './src/light.ts',
    time: './src/time.ts',
    status: './src/status.ts',
    helpers: './src/helpers.ts',
    numbers: './src/numbers.ts',
    storage: './src/storage.ts',
    constants: './src/constants.ts',
    formatters: './src/formatters.ts',
    'big-number': './src/big-number.ts',
    'test-utils/index': './src/test-utils/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true, // Enable tree-shaking
  platform: 'neutral', // Works in Node, browser, React Native
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    'bignumber.js',
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/ts-types',
  ],
  onSuccess: createNestedOnSuccess(),
})
