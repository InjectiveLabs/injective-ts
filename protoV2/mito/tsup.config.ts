import { globSync } from "glob";
import { defineConfig } from "tsup";
import path from "path";

// Dynamically discover all TypeScript files in src/
const sourceFiles = globSync("src/**/*.ts", {
	ignore: ["**/*.d.ts"],
});

// Create entry points preserving directory structure
const entries = sourceFiles.reduce((acc, file) => {
	// Convert: src/generated/points_svc_pb.ts -> generated/points_svc_pb
	const relativePath = path.relative("src", file).replace(/\.ts$/, "");
	acc[relativePath] = file;
	return acc;
}, {} as Record<string, string>);

export default defineConfig({
	entry: entries,
	outDir: "proto-ts/esm",
	format: ["esm"],
	dts: true,
	sourcemap: false,
	clean: true,
	splitting: false,
	treeshake: true,
	minify: false,
	bundle: false,
	external: [
		"@protobuf-ts/runtime",
		"@protobuf-ts/runtime-rpc",
		"@protobuf-ts/grpcweb-transport",
	],
});
