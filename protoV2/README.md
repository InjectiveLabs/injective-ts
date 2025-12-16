# ProtoV2 - Modern Protobuf Generation

This directory contains the v2 setup for generating TypeScript code from Protocol Buffer definitions using `@protobuf-ts`.

## Quick Start

### Generate Proto Files

```bash
# Generate all packages
./run-all-gen.sh

# Generate specific package
cd core && npm run generate
cd indexer && npm run generate
cd abacus && npm run generate
cd mito && npm run generate
cd olp && npm run generate
```

### Quick Regeneration (Skip Cloning)

When you've only changed templates or configs:

```bash
cd <package> && npm run generate:skip-clone
```

## Packages

| Package     | Description                             | Proto Source                       |
| ----------- | --------------------------------------- | ---------------------------------- |
| **core**    | Injective, Cosmos, IBC, CometBFT protos | injective-core, cosmos-sdk, ibc-go |
| **indexer** | Indexer gRPC API definitions            | injective-indexer                  |
| **abacus**  | Abacus points service                   | injective-abacus                   |
| **mito**    | Mito finance API                        | mito-indexer                       |
| **olp**     | OLP/DMM API                             | injective-dmm-be                   |

## Key Features

- ✅ **Modern tooling** - Uses `@protobuf-ts` and `tsup`
- ✅ **Template-based** - Version controlled `index.template.ts` files
- ✅ **Tree-shakeable** - Individual file exports for optimal bundling
- ✅ **TypeScript enums** - Standard TypeScript enum generation
- ✅ **Fast builds** - Single-pass build with `tsup`

## Workflow

### 1. Add/Update Proto Definitions

```bash
cd core
npm run generate  # Clones repos and generates TypeScript
```

### 2. Update Index Template (if needed)

When proto files are added or removed:

```bash
# For simple packages (indexer, abacus, mito, olp)
./protoV2/_scripts/update-index-template.sh indexer

# For core - edit manually
vim protoV2/core/src/index.template.ts
```

### 3. Regenerate from Template

```bash
cd indexer
npm run generate:skip-clone  # Quick regeneration
```

### 4. Build

```bash
npm run build  # Builds to proto-ts/esm/
```

## Directory Structure

```
protoV2/
├── _scripts/
│   ├── update-index-template.sh  # Auto-generate index templates
│   └── README.md                 # Script documentation
├── core/
│   ├── src/
│   │   ├── index.template.ts     # Template for exports (manual)
│   │   └── generated/            # Generated proto files
│   ├── proto-ts/esm/             # Built output
│   ├── gen.sh                    # Generation script
│   └── tsup.config.ts            # Build configuration
├── indexer/
│   ├── src/
│   │   ├── index.template.ts     # Template for exports (auto-gen)
│   │   └── generated/            # Generated proto files
│   └── ...
├── abacus/...
├── mito/...
├── olp/...
├── MIGRATION_NOTES.md            # v1 vs v2 comparison
├── FIX_IMPORTS_RESOLUTION.md     # Import resolution fix
├── BUILD_OPTIMIZATION.md         # Build optimization guide
├── MEMORY_OPTIMIZATION.md        # Memory optimization guide
├── TSUP_CONFIG_STANDARDIZATION.md # tsup config guide
├── TESTING_GUIDE.md              # Testing guide
└── README.md                     # This file
```

## Common Tasks

### Add New Proto File

1. Add the `.proto` file to the source repository
2. Run generation: `cd <package> && npm run generate`
3. Update template: `./protoV2/_scripts/update-index-template.sh <package>`
4. Verify exports: `cat <package>/src/index.template.ts`
5. Regenerate: `cd <package> && npm run generate:skip-clone`

### Remove Proto File

1. Remove the `.proto` file from the source repository
2. Run generation: `cd <package> && npm run generate`
3. Update template: `./protoV2/_scripts/update-index-template.sh <package>`
4. Regenerate: `cd <package> && npm run generate:skip-clone`

### Exclude an Export

1. Edit `src/index.template.ts` and comment out the export:
   ```typescript
   // export * as UnwantedPb from "./generated/unwanted_pb";
   ```
2. Regenerate: `npm run generate:skip-clone`

### Update Core Exports

Core has a manually curated template (371 lines). To update:

1. Edit `protoV2/core/src/index.template.ts` manually
2. Follow the existing organization pattern
3. Add comments for new sections
4. Test: `cd core && npm run generate:skip-clone`

## Scripts

| Script                                | Description                              |
| ------------------------------------- | ---------------------------------------- |
| `npm run generate`                    | Full generation (clone repos + generate) |
| `npm run generate:skip-clone`         | Quick regeneration (skip cloning)        |
| `npm run generate:persist`            | Generate and keep temp directories       |
| `npm run build`                       | Build TypeScript to ESM                  |
| `./run-all-gen.sh`                    | Generate all packages                    |
| `./test-all-gen.sh`                   | Test all generations                     |
| `./_scripts/update-index-template.sh` | Update index templates                   |

## Differences from v1 (proto)

See `MIGRATION_NOTES.md` for detailed comparison.

**Key differences:**

- Uses `@protobuf-ts` instead of `ts-proto`
- Generates TypeScript enums instead of const objects
- Uses `tsup` instead of `tsc` for building
- Template-based exports instead of dynamic generation
- ESM-only by default (CJS can be added)

## Troubleshooting

### Generation fails?

```bash
# Clean and retry
rm -rf proto/gen proto/proto src/generated
npm run generate
```

### Template out of sync?

```bash
# Regenerate template from generated files
./protoV2/_scripts/update-index-template.sh <package>
```

### Build errors?

```bash
# Clean build
rm -rf proto-ts
npm run build
```

### Missing exports?

1. Check if proto file was generated: `ls src/generated/`
2. Update template: `./_scripts/update-index-template.sh <package>`
3. Regenerate: `npm run generate:skip-clone`

## Documentation

- `MIGRATION_NOTES.md` - v1 vs v2 comparison and enum differences
- `FIX_IMPORTS_RESOLUTION.md` - Import resolution fix documentation
- `BUILD_OPTIMIZATION.md` - Build optimization strategies
- `MEMORY_OPTIMIZATION.md` - Memory optimization techniques
- `TSUP_CONFIG_STANDARDIZATION.md` - tsup configuration guide
- `TESTING_GUIDE.md` - Testing and validation guide
- `_scripts/README.md` - Script documentation
- Individual package `README.md` files (if present)

## Contributing

When adding new proto packages:

1. Create package directory: `mkdir protoV2/new-package`
2. Copy structure from existing package (e.g., `indexer`)
3. Update `gen.sh` with correct repository and branch
4. Create initial `src/index.template.ts`
5. Run generation: `npm run generate`
6. Add to `run-all-gen.sh` and `test-all-gen.sh`

## Support

For questions or issues:

1. Check `MIGRATION_NOTES.md` for common questions
2. Review `_scripts/README.md` for script usage
3. Compare with working package (e.g., `indexer`)
