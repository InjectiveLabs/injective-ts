import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { sha256 } from '../../../utils/crypto.js'
import { fromUtf8 } from '../../../utils/encoding.js'
import { ChainGrpcIbcApi } from './ChainGrpcIbcApi.js'
import type * as IbcApplicationsTransferV1TransferPb from '@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/transfer_pb'

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
        expect.objectContaining<
          IbcApplicationsTransferV1TransferPb.DenomTrace[]
        >(response),
      )
    } catch (e) {
      console.error('chainGrpcIbcApi.fetchDenomsTrace => ' + (e as any).message)
    }
  })

  test('fetchDenomTrace', async () => {
    try {
      const [trace] = await chainGrpcIbcApi.fetchDenomsTrace()
      const ibcHash = Buffer.from(
        sha256(fromUtf8(`${trace.path}/${trace.baseDenom}`)),
      ).toString('hex')
      const response = await chainGrpcIbcApi.fetchDenomTrace(ibcHash)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<IbcApplicationsTransferV1TransferPb.DenomTrace>(
          response,
        ),
      )
    } catch (e) {
      console.error('chainGrpcIbcApi.fetchDenomTrace => ' + (e as any).message)
    }
  })
})
