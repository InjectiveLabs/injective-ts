#!/usr/bin/env node
import { readdirSync, statSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';

console.log('Generating .d.ts files...');

// Simply copy the .ts files as .d.ts files
// Since protobuf-ts generates type-safe code, the .ts files ARE the type definitions
function copyAsDts(srcDir, outDir) {
  function traverse(currentSrcDir, currentOutDir) {
    const files = readdirSync(currentSrcDir);

    for (const file of files) {
      const srcPath = join(currentSrcDir, file);
      const stat = statSync(srcPath);

      if (stat.isDirectory()) {
        const newOutDir = join(currentOutDir, file);
        mkdirSync(newOutDir, { recursive: true });
        traverse(srcPath, newOutDir);
      } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        const dtsFile = file.replace(/\.ts$/, '.d.ts');
        const outPath = join(currentOutDir, dtsFile);
        
        console.log(`Copying ${relative('src', srcPath)} -> ${relative('proto-ts/esm', outPath)}`);
        copyFileSync(srcPath, outPath);
      }
    }
  }

  traverse(srcDir, outDir);
}

// Copy src files as .d.ts
copyAsDts('src/generated', 'proto-ts/esm/generated');
copyFileSync('src/index.ts', 'proto-ts/esm/index.d.ts');

console.log('✅ .d.ts files generated successfully!');
