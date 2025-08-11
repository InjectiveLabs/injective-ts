import typescript from '@rollup/plugin-typescript'
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  input: 'test-import.ts', // Use the test import file
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
  },
  external: [],
  plugins: [
    typescript({
      tsconfig: '../packages/exceptions/tsconfig.build.esm.json',
      rootDir: '../packages/exceptions/src',
      outDir: 'dist',
      declaration: false,
    }),
    visualizer({
      filename: 'report.html',
    }),
  ],
} as any
q
