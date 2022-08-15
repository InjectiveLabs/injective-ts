import { BaseWasmQuery } from './BaseWasmQuery'
import { RegisteredVault, RegisteredVaultResponse } from '../types'

export class GetRegisteredVaultsQuery extends BaseWasmQuery {
  toPayload() {
    return this.encodeToBase64({ get_registered_vaults: {} })
  }

  toData({ data }: { data: string }): RegisteredVault[] {
    const response = this.decodeFromBase64(data) as RegisteredVaultResponse

    return response.registered_vaults.map((payload) => ({
      masterSubaccountId: payload.master_subaccount_id,
      vaultAddress: payload.vault_address,
    }))
  }
}
