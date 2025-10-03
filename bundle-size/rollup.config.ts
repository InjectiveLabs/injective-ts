import typescript from '@rollup/plugin-typescript'
import { visualizer } from 'rollup-plugin-visualizer'

// Get package name from environment variable
const packageName = process.env.PACKAGE_NAME || 'all-packages'

export default {
  input: 'test-import-size/index.ts', // This will be overridden by --input
  output: {
    file: `bundle-analysis/dist/${packageName}-bundle.js`,
    format: 'esm',
  },
  external: [],
  plugins: [
    // @ts-ignore - TypeScript plugin has callable type issues
    typescript({
      tsconfig: false,
      declaration: false,
    }),
    visualizer({
      filename: `bundle-analysis/reports/${packageName}-report.html`,
      open: false,
    }),
  ],
} as any // eslint-disable-line @typescript-eslint/no-explicit-any
