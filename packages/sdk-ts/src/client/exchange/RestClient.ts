import { DerivativesChronosApi } from './rest/DerivativesChronosApi'
import { SpotChronosApi } from './rest/SpotChronosApi'

export class GrpcClient {
  derivativesChronos: DerivativesChronosApi

  spotChronos: SpotChronosApi

  constructor(endpoint: string) {
    this.derivativesChronos = new DerivativesChronosApi(endpoint)
    this.spotChronos = new SpotChronosApi(endpoint)
  }
}
