import { fromBase64 } from '../../../utils'
import {
  WasmContractQueryResponse,
  QueryMastContractConfigResponse,
  QueryRegisteredVaultResponse,
  QueryVaultMarketIdResponse,
  QueryVaultTotalLpSupplyResponse,
  QueryVaultUserLpBalanceResponse,
} from './types'

export class SupernovaQueryTransformer {
  static contractConfigResponseToContractConfig(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryMastContractConfigResponse

    return {
      distributionContract: data.distribution_contract,
      ninjaToken: data.ninja_token,
      owner: data.owner,
    }
  }

  static vaultMarketIdResponseToVaultMarketId(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultMarketIdResponse

    return { marketId: data.market_id }
  }

  static vaultTotalLpSupplyResponseToVaultTotalLpSupply(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultTotalLpSupplyResponse

    return { totalSupply: data.total_supply }
  }

  static vaultUserLpBalanceResponseToVaultUserLpBalance(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryVaultUserLpBalanceResponse

    return { balance: data.balance }
  }

  static registeredVaultsResponseToRegisteredVaults(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(response.data) as QueryRegisteredVaultResponse

    return data.registered_vaults.map((payload) => ({
      masterSubaccountId: payload.master_subaccount_id,
      vaultAddress: payload.vault_address,
    }))
  }
}
