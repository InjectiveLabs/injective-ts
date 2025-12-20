/**
 * Global type augmentation for Cosmostation wallet.
 * This ensures window.cosmostation is properly typed.
 */

import type { CosmostationProvider } from './types.js'

declare global {
  interface Window {
    cosmostation?: CosmostationProvider
  }
}

export {}
