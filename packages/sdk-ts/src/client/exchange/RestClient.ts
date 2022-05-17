import { DerivativesChronosApi } from './rest/DerivativesChronosApi'
import { SpotChronosApi } from './rest/SpotChronosApi'

export class RestClient {
  derivativesChronos: DerivativesChronosApi

  spotChronos: SpotChronosApi

  constructor(endpoints: { exchangeApi: string; chronosApi?: string }) {
    const chronosBase = `${
      endpoints.chronosApi
        ? `${endpoints.chronosApi}/api/v1`
        : `${endpoints.exchangeApi}/api/chronos/v1`
    }`

    this.derivativesChronos = new DerivativesChronosApi(
      chronosBase + '/derivative',
    )
    this.spotChronos = new SpotChronosApi(chronosBase + '/spot')
  }
}
