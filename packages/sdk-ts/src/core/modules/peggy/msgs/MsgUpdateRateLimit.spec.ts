import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectivePeggyV1MsgsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/msgs_pb'
import * as InjectiveOracleV1Beta1OraclePb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/oracle_pb'
import MsgUpdateRateLimit from './MsgUpdateRateLimit.js'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateRateLimit['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  tokenAddress: 'inj',
  newTokenPriceId: '1234567890',
  newTokenOracleType: InjectiveOracleV1Beta1OraclePb.OracleType.Pyth,
  newRateLimitInUsd: '1000000000000000000',
  newRateLimitWindow: '100',
}

const message = MsgUpdateRateLimit.fromJSON(params)
const protoType = '/injective.peggy.v1.MsgUpdateRateLimit'
const protoTypeAmino = 'peggy/MsgUpdateRateLimit'
const protoParams = {
  authority: params.injectiveAddress,
  tokenAddress: params.tokenAddress,
  newTokenPriceId: params.newTokenPriceId,
  newTokenOracleType: params.newTokenOracleType,
  newRateLimitUsd: '1000000000000000000000000000000000000',
  newRateLimitWindow: BigInt(params.newRateLimitWindow),
}
const aminoParams = {
  authority: params.injectiveAddress,
  token_address: params.tokenAddress,
  new_token_price_id: params.newTokenPriceId,
  new_token_oracle_type: params.newTokenOracleType,
  new_rate_limit_usd: params.newRateLimitInUsd,
  new_rate_limit_window: params.newRateLimitWindow,
}

describe('MsgUpdateRateLimit', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeAmino,
      value: aminoParams,
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...aminoParams,
    })
  })

  it('generates proper EIP712 v2 message', () => {
    const eip712 = message.toEip712V2()

    expect(eip712).toStrictEqual({
      '@type': protoType,
      ...aminoParams,
      new_token_oracle_type:
        InjectiveOracleV1Beta1OraclePb.OracleType[params.newTokenOracleType],
      new_rate_limit_usd: '1000000000000000000.000000000000000000',
    })
  })

  it('generates proper direct sign', () => {
    const directSign = message.toDirectSign()

    expect(directSign).toStrictEqual({
      type: protoType,
      message: protoParams,
    })
  })

  it('generates proper binary', () => {
    const binary = message.toBinary()
    const decoded = InjectivePeggyV1MsgsPb.MsgUpdateRateLimit.fromBinary(binary)

    expect(decoded).toStrictEqual(protoParams)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    test('EIP712 v1', async () => {
      expect(() => message.toEip712()).toThrow(
        'EIP712_v1 is not supported for MsgUpdateRateLimit. Please use EIP712_v2',
      )
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
