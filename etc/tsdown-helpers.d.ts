/**
 * Type declarations for tsdown-helpers.js
 */

/**
 * Reorganizes tsdown output into cjs/ and esm/ subdirectories with package.json markers.
 * Use this for simple packages with flat file structure (single entry point).
 */
export function createSimpleOnSuccess(): () => Promise<void>

/**
 * Reorganizes tsdown output including nested directories (e.g., test-utils/, client/gql/).
 * Use this for packages with multiple entry points or nested directory structures.
 */
export function createNestedOnSuccess(): () => Promise<void>

