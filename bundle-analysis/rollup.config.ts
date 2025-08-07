import typescript from '@rollup/plugin-typescript'
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  input: 'bundle-analysis/test-import.ts', // Use the test import file
  output: {
    file: 'bundle-analysis/dist/bundle.js',
    format: 'esm',
  },
  external: [
    '@bangjelkoski/store2',
    'axios',
    'bignumber.js',
    '@injectivelabs/exceptions',
    'http-status-codes',
  ],
  plugins: [
    typescript({
      tsconfig: './packages/utils/tsconfig.build.esm.json',
      rootDir: 'src',
      outDir: 'bundle-analysis/dist',
      declaration: false,
    }),
    visualizer({
      filename: 'bundle-analysis/report.html',
    }),
  ],
} as any
