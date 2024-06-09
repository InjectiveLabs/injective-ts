import { ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { parseSmartContractStateResponse } from './utils'
import {
  ChainId,
  ChainName,
  buildTokenId,
  coalesceChainId,
  hexToUint8Array,
  CHAIN_ID_INJECTIVE,
  WormholeWrappedInfo,
  isNativeCosmWasmDenom,
  tryNativeToHexString,
} from '@injectivelabs/wormhole-sdk'
import { fromUint8Array } from 'js-base64'

/**
 * Returns the address of the foreign asset
 * @param tokenBridgeAddress Address of token bridge contact
 * @param client Holds the wallet and signing information
 * @param originChain The chainId of the origin of the asset
 * @param originAsset The address of the origin asset
 * @returns The foreign asset address or null
 */
export async function getForeignAssetInjective(
  tokenBridgeAddress: string,
  client: ChainGrpcWasmApi,
  originChain: ChainId | ChainName,
  originAsset: Uint8Array,
): Promise<string | null> {
  try {
    const queryResult = await client.fetchSmartContractState(
      tokenBridgeAddress,
      Buffer.from(
        JSON.stringify({
          wrapped_registry: {
            chain: coalesceChainId(originChain),
            address: fromUint8Array(originAsset),
          },
        }),
      ).toString('base64'),
    )
    const parsed = parseSmartContractStateResponse(queryResult)

    return parsed.address
  } catch (e) {
    return null
  }
}

/**
 * Checks if the asset is a wrapped asset
 * @param tokenBridgeAddress The address of the Injective token bridge contract
 * @param client Connection/wallet information
 * @param assetAddress Address of the asset in Injective format
 * @returns true if asset is a wormhole wrapped asset
 */
export async function getIsWrappedAssetInjective(
  tokenBridgeAddress: string,
  client: ChainGrpcWasmApi,
  assetAddress: string,
): Promise<boolean> {
  const hexified = tryNativeToHexString(assetAddress, 'injective')
  const result = await getForeignAssetInjective(
    tokenBridgeAddress,
    client,
    CHAIN_ID_INJECTIVE,
    new Uint8Array(Buffer.from(hexified)),
  )

  if (result === null) {
    return false
  }

  return true
}

/**
 * Returns information about the asset
 * @param wrappedAddress Address of the asset in wormhole wrapped format (hex string)
 * @param client WASM api client
 * @returns Information about the asset
 */
export async function getOriginalAssetInjective(
  wrappedAddress: string,
  client: ChainGrpcWasmApi,
): Promise<WormholeWrappedInfo> {
  const chainId = CHAIN_ID_INJECTIVE

  if (isNativeCosmWasmDenom(chainId, wrappedAddress)) {
    return {
      isWrapped: false,
      chainId,
      assetAddress: hexToUint8Array(buildTokenId(chainId, wrappedAddress)),
    }
  }

  try {
    const response = await client.fetchSmartContractState(
      wrappedAddress,
      Buffer.from(
        JSON.stringify({
          wrapped_asset_info: {},
        }),
      ).toString('base64'),
    )
    const parsed = parseSmartContractStateResponse(response)

    return {
      isWrapped: true,
      chainId: parsed.asset_chain,
      assetAddress: new Uint8Array(Buffer.from(parsed.asset_address, 'base64')),
    }
  } catch {
    //
  }

  return {
    isWrapped: false,
    chainId: chainId,
    assetAddress: hexToUint8Array(buildTokenId(chainId, wrappedAddress)),
  }
}

export const queryExternalIdInjective = async (
  client: ChainGrpcWasmApi,
  tokenBridgeAddress: string,
  externalTokenId: string,
): Promise<string | null> => {
  try {
    const response = await client.fetchSmartContractState(
      tokenBridgeAddress,
      Buffer.from(
        JSON.stringify({
          external_id: {
            external_id: Buffer.from(externalTokenId, 'hex').toString('base64'),
          },
        }),
      ).toString('base64'),
    )

    const parsedResponse = parseSmartContractStateResponse(response)
    const denomOrAddress: string | undefined =
      parsedResponse.token_id.Bank?.denom ||
      parsedResponse.token_id.Contract?.NativeCW20?.contract_address ||
      parsedResponse.token_id.Contract?.ForeignToken?.foreign_address

    return denomOrAddress || null
  } catch {
    return null
  }
}
