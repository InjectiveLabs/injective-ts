import { AssetInfo } from './types.js'

export function getDenom(assetInfo: AssetInfo): string | undefined {
  if ('native_token' in assetInfo) {
    return assetInfo.native_token.denom
  }

  return assetInfo.token.contract_addr
}
