# ProtoV2 Scripts

This directory contains shared scripts for managing protoV2 packages.

## Scripts

### `update-index-template.sh`

Automatically generates or updates `index.template.ts` files based on the generated proto files in `src/generated/`.

#### Usage

**Update all packages:**
```bash
cd protoV2/_scripts
./update-index-template.sh
```

**Update a specific package:**
```bash
cd protoV2/_scripts
./update-index-template.sh core
./update-index-template.sh indexer
./update-index-template.sh abacus
./update-index-template.sh mito
./update-index-template.sh olp
```

#### When to Use

Run this script when:
1. **New proto files are added** - After adding new `.proto` files and regenerating
2. **Proto files are removed** - After removing `.proto` files
3. **Client classes change** - When client class names are updated
4. **Initial setup** - When setting up a new proto package

#### Workflow

```bash
# 1. Generate proto files (this creates src/generated/)
cd protoV2/indexer
npm run generate

# 2. Update the index.template.ts based on generated files
cd ../..
./protoV2/_scripts/update-index-template.sh indexer

# 3. Regenerate index.ts from the updated template
cd protoV2/indexer
npm run generate:skip-clone
```

#### What It Does

The script:
1. Scans `src/generated/` for all `*_pb.ts` and `*_pb.client.ts` files
2. Extracts client class names from `.client.ts` files
3. Generates namespace exports for all proto type files
4. Creates a properly formatted `index.template.ts` file

**Example output:**
```typescript
// Auto-generated index file

// Export all client classes
export { EventProviderAPIClient } from "./generated/event_provider_api_pb.client";
export { HealthClient } from "./generated/health_pb.client";

// Export all types as namespaces for easy import
export * as EventProviderApiPb from "./generated/event_provider_api_pb";
export * as HealthPb from "./generated/health_pb";
```

### `generate-exports.sh` (Legacy)

⚠️ **Deprecated** - This script is no longer used. We now use `index.template.ts` files instead of dynamically generating exports.

This script was previously sourced by `gen.sh` scripts to dynamically generate index files. It has been replaced by the template approach for better version control and maintainability.

## Template vs Dynamic Generation

### Old Approach (Dynamic)
```bash
# In gen.sh
source ../_scripts/generate-exports.sh
generate_optimized_exports  # Generates index.ts on the fly
```

**Problems:**
- ❌ Not version controlled
- ❌ Hard to customize
- ❌ Difficult to review changes
- ❌ Can't manually exclude exports

### New Approach (Template)
```bash
# In gen.sh
cp ./src/index.template.ts ./src/index.ts
```

**Benefits:**
- ✅ Version controlled
- ✅ Easy to customize
- ✅ Clear git diffs
- ✅ Can manually exclude exports
- ✅ Can add comments and documentation

## For Core Package

The core package has a **manually curated** `index.template.ts` with 371 lines of organized exports. This file should be maintained manually, not auto-generated, because:

1. **Complex organization** - Exports are grouped by module with comments
2. **Manual exclusions** - Some exports are intentionally commented out
3. **Custom naming** - Client exports use custom aliases
4. **Documentation** - Contains TODO comments and notes

**To update core's template:**
1. Edit `protoV2/core/src/index.template.ts` manually
2. Follow the existing organization pattern
3. Add comments for new sections
4. Test with `npm run generate:skip-clone`

## For Other Packages

The other packages (indexer, abacus, mito, olp) have simpler templates that can be auto-generated:

```bash
# After generating new proto files
./protoV2/_scripts/update-index-template.sh indexer
```

## Quick Reference

| Task | Command |
|------|---------|
| Update all templates | `./protoV2/_scripts/update-index-template.sh` |
| Update one template | `./protoV2/_scripts/update-index-template.sh <package>` |
| Generate proto + update template | `cd <package> && npm run generate && cd ../.. && ./protoV2/_scripts/update-index-template.sh <package>` |
| Regenerate from template | `cd <package> && npm run generate:skip-clone` |

## Troubleshooting

### Template not updating?

Make sure you've generated the proto files first:
```bash
cd protoV2/indexer
npm run generate  # This creates src/generated/
cd ../..
./protoV2/_scripts/update-index-template.sh indexer
```

### Missing exports?

The script only includes files that exist in `src/generated/`. If a proto file isn't being exported:
1. Check if it was generated: `ls protoV2/<package>/src/generated/`
2. Verify the proto file was included in generation
3. Re-run the generation: `npm run generate`

### Want to exclude an export?

After running the script, manually edit the template and comment out the export:
```typescript
// export * as UnwantedPb from "./generated/unwanted_pb";
```

Then run `npm run generate:skip-clone` to apply the change.

