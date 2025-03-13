import { QueryRouteResponse, QueryQuantityAndFeesResponse } from './types.js'
import { WasmContractQueryResponse } from '../types.js'
import { toUtf8 } from '../../../utils/index.js'

export class SwapQueryTransformer {
  static contractRouteResponseToContractRoute(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryRouteResponse

    return {
      steps: data.steps,
      sourceDenom: data.source_denom,
      targetDenom: data.target_denom,
    }
  }

  static contractAllRoutesResponseToContractAllRoutes(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(toUtf8(response.data)) as QueryRouteResponse[]

    return data.map((route: QueryRouteResponse) => ({
      steps: route.steps,
      sourceDenom: route.source_denom,
      targetDenom: route.target_denom,
    }))
  }

  static contractQuantityResponseToContractQuantity(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryQuantityAndFeesResponse

    return {
      expectedFees: data.expected_fees,
      resultQuantity: data.result_quantity,
    }
  }
}
