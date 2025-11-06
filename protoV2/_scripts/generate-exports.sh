#!/bin/bash

# Shared function to generate optimized index.ts and tsup.config.ts files
# This function should be sourced by individual gen.sh scripts
generate_optimized_exports() {
    # Create index.ts file with exports for tree-shaking optimization
    echo "Creating optimized index.ts file with exports..."

    # Create the index file with proper header
    cat > ./src/index.ts << 'EOF'
// Auto-generated index file

// Export all client classes
EOF

    # Add client class exports
    {
      find ./src/generated -name "*_pb.client.ts" -not -name "*.d.ts" | sort | while read -r file; do
        # Get relative path from src/ directory
        relative_path=${file#./src/}
        # Remove .ts extension 
        module_path=${relative_path%.*}
        
        # Extract the client class name from the file
        client_class=$(grep -o "export class [A-Za-z0-9_]*Client" "$file" | sed 's/export class //' || true)
        
        if [ -n "$client_class" ]; then
          echo "export { $client_class } from \"./$module_path\";"
        fi
      done
    } >> ./src/index.ts

    # Add namespace type exports
    echo "" >> ./src/index.ts
    echo "// Export all types as namespaces for easy import" >> ./src/index.ts

    {
      find ./src/generated -name "*_pb.ts" -not -name "*.d.ts" -not -name "*_pb.client.ts" | sort | while read -r file; do
        # Get relative path from src/ directory
        relative_path=${file#./src/}
        # Remove .ts extension 
        module_path=${relative_path%.*}
        # Get base filename for namespace
        base_name=$(basename "$module_path")
        # Convert filename to PascalCase namespace (e.g., event_provider_api_pb.ts -> EventProviderApiPb)
        namespace_name=$(echo "$base_name" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); print}' OFS='')
        
        echo "export * as $namespace_name from \"./$module_path\";"
      done
    } >> ./src/index.ts

    echo "Optimized index file created successfully!"

    # Update tsup.config.ts with optimized entries for tree-shaking
    echo "Updating optimized tsup.config.ts entries..."

    # Create the updated tsup config
    cat > ./tsup.config.ts << 'EOF'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // Main index file
    'index': 'src/index.ts',
    // Generated type files
EOF

    # Add individual type entries for all generated pb files
    {
      find ./src/generated -name "*_pb.ts" -not -name "*.d.ts" -not -name "*_pb.client.ts" | sort | while read -r file; do
        # Get relative path from src/ directory
        relative_path=${file#./src/}
        # Remove .ts extension
        module_path=${relative_path%.*}
        # Get the base filename without extension for the entry key
        base_name=$(basename "$module_path")
        
        echo "    'generated/$base_name': 'src/$relative_path',"
      done
    } >> ./tsup.config.ts

    # Add client files
    {
      find ./src/generated -name "*_pb.client.ts" -not -name "*.d.ts" | sort | while read -r file; do
        # Get relative path from src/ directory
        relative_path=${file#./src/}
        # Remove .ts extension
        module_path=${relative_path%.*}
        # Get the base filename without extension for the entry key
        base_name=$(basename "$module_path")
        
        echo "    'generated/$base_name': 'src/$relative_path',"
      done
    } >> ./tsup.config.ts

    # Add the closing part of the config with tree-shaking optimizations
    cat >> ./tsup.config.ts << 'EOF'
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,  // Disable splitting to prevent name mangling
  minify: false,     // Disable minification to preserve na
  external: ['shared'],
  bundle: false,     // Disable bundling to preserve original exports
})
EOF

    echo "Optimized tsup.config.ts updated successfully!"
}
