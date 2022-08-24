import { ExchangeRestDerivativesChronosApi } from './rest/ExchangeRestDerivativesChronosApi'
import { ExchangeRestExplorerApi } from './rest/ExchangeRestExplorerApi'
import { ExchangeRestSpotChronosApi } from './rest/ExchangeRestSpotChronosApi'

/**
 * @category Exchange Rest API
 * @hidden
 */
export class ExchangeRestClient {
  derivativesChronos: ExchangeRestDerivativesChronosApi

  spotChronos: ExchangeRestSpotChronosApi

  explorer: ExchangeRestExplorerApi

  constructor(endpoints: { exchangeApi: string; chronosApi?: string }) {
    const chronosBase = `${
      endpoints.chronosApi
        ? `${endpoints.chronosApi}/api/v1`
        : `${endpoints.exchangeApi}/api/chronos/v1`
    }`

    this.explorer = new ExchangeRestExplorerApi(
      `${chronosBase}/api/explorer/v1`,
    )
    this.derivativesChronos = new ExchangeRestDerivativesChronosApi(
      `${chronosBase}/derivative`,
    )
    this.spotChronos = new ExchangeRestSpotChronosApi(`${chronosBase}/spot`)
  }
}
