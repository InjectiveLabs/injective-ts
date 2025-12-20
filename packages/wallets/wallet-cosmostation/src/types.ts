/**
 * TypeScript interfaces for the vanilla Cosmostation browser extension API.
 * These replace the @cosmostation/extension-client package types.
 *
 * @see https://docs.cosmostation.io/extension/cosmos/integrate
 */

// ============================================================================
// Request/Response Types
// ============================================================================

export interface CosmostationAccount {
  name: string
  address: string
  publicKey: Uint8Array
  isLedger: boolean
  isEthermint?: boolean
}

export interface CosmostationSignDirectDoc {
  chain_id: string
  body_bytes: Uint8Array
  auth_info_bytes: Uint8Array
  account_number: string
}

export interface CosmostationSignDirectResponse {
  signed_doc: CosmostationSignDirectDoc
  signature: string
  pub_key: {
    type: string
    value: string
  }
}

export interface CosmostationSignAminoResponse {
  signed_doc: Record<string, unknown>
  signature: string
  pub_key: {
    type: string
    value: string
  }
}

export interface CosmostationSignMessageResponse {
  signature: string
  pub_key: {
    type: string
    value: string
  }
}

export interface CosmostationSupportedChainIdsResponse {
  official: string[]
  unofficial: string[]
}

export interface CosmostationSendTransactionResponse {
  tx_response: {
    txhash: string
    code?: number
    codespace?: string
    raw_log?: string
    height?: string | number
    gas_used?: string | number
    gas_wanted?: string | number
    [key: string]: unknown
  }
}

// ============================================================================
// Request Method Parameters
// ============================================================================

export interface CosRequestAccountParams {
  chainName: string
}

export interface CosAccountParams {
  chainName: string
}

export interface CosSignDirectParams {
  chainName: string
  doc: CosmostationSignDirectDoc
  isEditFee?: boolean
  isEditMemo?: boolean
}

export interface CosSignAminoParams {
  chainName: string
  doc: Record<string, unknown>
  isEditFee?: boolean
  isEditMemo?: boolean
}

export interface CosSignMessageParams {
  chainName: string
  signer: string
  message: string
}

export interface CosSendTransactionParams {
  chainName: string
  txBytes: string // base64 encoded
  mode: number
}

// ============================================================================
// Provider Interface
// ============================================================================

/**
 * The cosmos namespace of the Cosmostation provider.
 */
export interface CosmostationCosmos {
  /**
   * Make a request to the Cosmostation extension.
   */
  request<T>(message: { method: string; params?: unknown }): Promise<T>

  /**
   * Subscribe to wallet events.
   */
  on(eventName: string, handler: () => void): void

  /**
   * Unsubscribe from wallet events.
   */
  off(eventName: string, handler: () => void): void
}

/**
 * The Cosmostation provider interface available on window.cosmostation.
 */
export interface CosmostationProvider {
  cosmos: CosmostationCosmos
  providers?: {
    keplr?: unknown
  }
}

// ============================================================================
// Send Transaction Modes (replaces SEND_TRANSACTION_MODE from extension-client)
// ============================================================================

export const SEND_TRANSACTION_MODE = {
  UNSPECIFIED: 0,
  BLOCK: 1,
  SYNC: 2,
  ASYNC: 3,
} as const

export type SendTransactionMode =
  (typeof SEND_TRANSACTION_MODE)[keyof typeof SEND_TRANSACTION_MODE]
