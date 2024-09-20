import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { isNativeDenomInjective } from '@injectivelabs/wormhole-sdk'

/**
 * Creates attestation message
 * @param tokenBridgeAddress Address of Inj token bridge contract
 * @param walletAddress Address of wallet in inj format
 * @param asset Name or address of the asset to be attested
 * For native assets the asset string is the denomination.
 * For foreign assets the asset string is the inj address of the foreign asset
 * @returns Message to be broadcast
 */
export async function attestFromInjective(
  tokenBridgeAddress: string,
  walletAddress: string,
  asset: string,
): Promise<MsgExecuteContractCompat> {
  const nonce = Math.round(Math.random() * 100000)
  const isNativeAsset = isNativeDenomInjective(asset)

  return MsgExecuteContractCompat.fromJSON({
    contractAddress: tokenBridgeAddress,
    sender: walletAddress,
    exec: {
      msg: {
        asset_info: isNativeAsset
          ? {
              native_token: { denom: asset },
            }
          : {
              token: {
                contract_addr: asset,
              },
            },
        nonce: nonce,
      },
      action: 'create_asset_meta',
    },
  })
}
