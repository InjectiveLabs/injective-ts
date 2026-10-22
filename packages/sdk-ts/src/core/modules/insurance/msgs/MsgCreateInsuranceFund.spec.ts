import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgCreateInsuranceFund from './MsgCreateInsuranceFund.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const market = mockFactory.injUsdtDerivativeMarket

const params: MsgCreateInsuranceFund['params'] = {
  fund: {
    ticker: market.ticker,
    quoteDenom: market.quoteDenom,
    oracleBase: market.oracleBase,
    oracleQuote: market.oracleQuote,
    oracleType: 9,
  },
  deposit: {
    amount: toChainFormat(1).toFixed(),
    denom: 'inj',
  },
  injectiveAddress: mockFactory.injectiveAddress,
}

const protoType = '/injective.insurance.v1beta1.MsgCreateInsuranceFund'
const protoTypeShort = 'insurance/MsgCreateInsuranceFund'
const protoParams = {
  ...params.fund,
  initialDeposit: params.deposit,
  sender: params.injectiveAddress,
  expiry: BigInt(-1),
}
const protoParamsAmino = snakecaseKeys({
  ...params.fund,
  initialDeposit: params.deposit,
  sender: params.injectiveAddress,
  expiry: '-1',
})
const message = MsgCreateInsuranceFund.fromJSON(params)

describe('MsgCreateInsuranceFund', () => {
  it.each([2, 3, 12])('rejects retired oracle %s', (oracleType) => {
    const invalid = MsgCreateInsuranceFund.fromJSON({
      ...params,
      fund: { ...params.fund, oracleType },
    })

    expect(() => invalid.toProto()).toThrow('has been removed in core v1.21')
    expect(() => invalid.toAmino()).toThrow('has been removed in core v1.21')
    expect(() => invalid.toEip712V2()).toThrow('has been removed in core v1.21')
  })

  it('preserves provider oracle support', () => {
    const supported = MsgCreateInsuranceFund.fromJSON({
      ...params,
      fund: { ...params.fund, oracleType: 11 },
    })

    expect(supported.toProto().oracleType).toBe(11)
    expect(supported.toAmino().value.oracle_type).toBe(11)
  })

  it('rejects the removed binary-options expiry flag', () => {
    const invalid = MsgCreateInsuranceFund.fromJSON({
      ...params,
      fund: { ...params.fund, expiry: -2 },
    })

    expect(() => invalid.toProto()).toThrow(
      'Binary options insurance funds have been removed',
    )
    expect(() => invalid.toAmino()).toThrow(
      'Binary options insurance funds have been removed',
    )
  })

  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
    })
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
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
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
