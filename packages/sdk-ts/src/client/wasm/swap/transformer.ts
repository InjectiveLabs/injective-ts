import { QueryRouteResponse, QueryExecutionQuantityResponse } from './types'
import { WasmContractQueryResponse } from '../common/types'
import { toUtf8 } from '../../../utils'

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

  static contractExecutionQuantityResponseToContractExecutionQuantity(
    response: WasmContractQueryResponse,
  ) {
    const data = JSON.parse(
      toUtf8(response.data),
    ) as QueryExecutionQuantityResponse

    return {
      fees: data.fees,
      targetQuantity: data.target_quantity,
    }
  }
}
