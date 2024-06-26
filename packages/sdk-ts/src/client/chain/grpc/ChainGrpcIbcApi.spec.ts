import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainGrpcIbcApi } from './ChainGrpcIbcApi'
import { sha256 } from '../../../utils/crypto'
import { fromUtf8 } from '../../../utils/utf8'
import { IbcApplicationsTransferV2Token } from '@injectivelabs/core-proto-ts'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)

describe('ChainGrpcIbcApi', () => {
  test('fetchDenomsTrace', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchDenomsTrace()
      if (response.length === 0) {
        console.warn('fetchDenomsTrace.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<IbcApplicationsTransferV2Token.Denom[]>(
          response,
        ),
      )
    } catch (e) {
      console.error('chainGrpcIbcApi.fetchDenomsTrace => ' + (e as any).message)
    }
  })

  test('fetchDenomTrace', async () => {
    try {
      const [trace] = await chainGrpcIbcApi.fetchDenomsTrace()
      const ibcHash = Buffer.from(
        sha256(fromUtf8(`${trace.trace}/${trace.base}`)),
      ).toString('hex')
      const response = await chainGrpcIbcApi.fetchDenomTrace(ibcHash)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<IbcApplicationsTransferV2Token.Denom>(
          response,
        ),
      )
    } catch (e) {
      console.error('chainGrpcIbcApi.fetchDenomTrace => ' + (e as any).message)
    }
  })
})
