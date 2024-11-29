import { WasmContractQueryResponse } from '../types.js'
import { binaryToBase64, fromBase64 } from '../../../utils/index.js'

export class InjNameServiceQueryTransformer {
  static resolverAddressResponseToResolverAddress(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(binaryToBase64(response.data))

    return data.resolver || ''
  }

  static injectiveAddressResponseToInjectiveAddress(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(binaryToBase64(response.data))

    return data.address || ''
  }

  static injectiveNameResponseToInjectiveName(
    response: WasmContractQueryResponse,
  ) {
    const data = fromBase64(binaryToBase64(response.data))

    return data.name || ''
  }
}
