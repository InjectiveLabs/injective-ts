"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const tsup_1 = require("tsup");
const fs_1 = require("fs");
function findFiles(dir) {
    const result = [];
    function traverse(currentDir) {
        const files = (0, fs_1.readdirSync)(currentDir);
        for (const file of files) {
            const fullPath = path_1.default.join(currentDir, file);
            const stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                traverse(fullPath);
            }
            else if (file.endsWith('.ts') &&
                !file.endsWith('.d.ts') &&
                !file.endsWith('.spec.ts')) {
                result.push(fullPath);
            }
        }
    }
    traverse(dir);
    return result;
}
exports.default = (0, tsup_1.defineConfig)(() => {
    // Automatically find all generated files
    const generatedFiles = findFiles('src/generated');
    const entries = {
        index: 'src/index.ts',
    };
    // Add all generated files as entry points
    generatedFiles.forEach((file) => {
        const key = path_1.default.relative('src', file).replace(/\.ts$/, '');
        entries[key] = file;
    });
    return [
        {
            entry: entries,
            outDir: 'proto-ts/esm',
            format: ['esm'],
            dts: false, // Disable DTS generation in tsup (use generate-dts.mjs instead)
            sourcemap: false,
            clean: true,
            splitting: false,
            treeshake: false,
            minify: false,
            bundle: false,
            outExtension: () => ({ js: '.mjs' }),
            external: [
                '@protobuf-ts/runtime',
                '@protobuf-ts/runtime-rpc',
                '@protobuf-ts/grpcweb-transport',
            ],
        },
    ];
});
