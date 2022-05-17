import { DerivativesChronosApi } from './rest/DerivativesChronosApi'
import { ExplorerRestApi } from './rest/ExplorerRestApi'
import { SpotChronosApi } from './rest/SpotChronosApi'

export class RestClient {
  derivativesChronos: DerivativesChronosApi

  spotChronos: SpotChronosApi

  explorer: ExplorerRestApi

  constructor(endpoints: { exchangeApi: string; chronosApi?: string }) {
    const chronosBase = `${
      endpoints.chronosApi
        ? `${endpoints.chronosApi}/api/v1`
        : `${endpoints.exchangeApi}/api/chronos/v1`
    }`

    this.explorer = new ExplorerRestApi(`${chronosBase}/api/explorer/v1`)
    this.derivativesChronos = new DerivativesChronosApi(
      `${chronosBase}/derivative`,
    )
    this.spotChronos = new SpotChronosApi(`${chronosBase}/spot`)
  }
}
