#!/bin/bash

# Script to update index.template.ts files based on generated proto files
# Usage: ./update-index-template.sh [package_name]
# If no package name is provided, updates all packages

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

update_package_template() {
    local package_dir=$1
    local package_name=$(basename "$package_dir")
    
    echo -e "${BLUE}Updating index.template.ts for ${package_name}...${NC}"
    
    # Check if src/generated directory exists
    if [ ! -d "$package_dir/src/generated" ]; then
        echo -e "${YELLOW}⚠️  No src/generated directory found in ${package_name}. Skipping.${NC}"
        return
    fi
    
    # Create temporary file
    temp_file=$(mktemp)
    
    # Write header
    cat > "$temp_file" << 'EOF'
// Auto-generated index file

// Export all client classes
EOF
    
    # Add client class exports
    {
        find "$package_dir/src/generated" -name "*_pb.client.ts" -not -name "*.d.ts" | sort | while read -r file; do
            # Get relative path from src/ directory
            relative_path=${file#$package_dir/src/}
            # Remove .ts extension 
            module_path=${relative_path%.*}
            
            # Extract the client class name from the file
            client_class=$(grep -o "export class [A-Za-z0-9_]*Client" "$file" | sed 's/export class //' || true)
            
            if [ -n "$client_class" ]; then
                echo "export { $client_class } from \"./$module_path\";"
            fi
        done
    } >> "$temp_file"
    
    # Add namespace type exports
    echo "" >> "$temp_file"
    echo "// Export all types as namespaces for easy import" >> "$temp_file"
    
    {
        find "$package_dir/src/generated" -name "*_pb.ts" -not -name "*.d.ts" -not -name "*_pb.client.ts" | sort | while read -r file; do
            # Get relative path from src/ directory
            relative_path=${file#$package_dir/src/}
            # Remove .ts extension 
            module_path=${relative_path%.*}
            # Get base filename for namespace
            base_name=$(basename "$module_path")
            # Convert filename to PascalCase namespace (e.g., event_provider_api_pb -> EventProviderApiPb)
            namespace_name=$(echo "$base_name" | awk -F'_' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); print}' OFS='')
            
            echo "export * as $namespace_name from \"./$module_path\";"
        done
    } >> "$temp_file"
    
    # Move temp file to index.template.ts
    mv "$temp_file" "$package_dir/src/index.template.ts"
    
    echo -e "${GREEN}✅ Updated $package_name/src/index.template.ts${NC}"
}

# Main script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROTOV2_DIR="$(dirname "$SCRIPT_DIR")"

if [ $# -eq 0 ]; then
    # No arguments - update all packages
    echo -e "${BLUE}Updating index.template.ts for all packages...${NC}"
    echo ""
    
    for package_dir in "$PROTOV2_DIR"/*/; do
        # Skip _scripts directory
        if [ "$(basename "$package_dir")" = "_scripts" ]; then
            continue
        fi
        
        # Skip if not a directory or doesn't have src/generated
        if [ ! -d "$package_dir" ] || [ ! -d "$package_dir/src" ]; then
            continue
        fi
        
        update_package_template "$package_dir"
        echo ""
    done
    
    echo -e "${GREEN}✅ All index.template.ts files updated!${NC}"
else
    # Update specific package
    package_name=$1
    package_dir="$PROTOV2_DIR/$package_name"
    
    if [ ! -d "$package_dir" ]; then
        echo -e "${YELLOW}❌ Package directory not found: $package_dir${NC}"
        exit 1
    fi
    
    update_package_template "$package_dir"
fi

echo ""
echo -e "${BLUE}💡 Tip: Run 'npm run generate:skip-clone' in each package to regenerate index.ts from the template${NC}"

