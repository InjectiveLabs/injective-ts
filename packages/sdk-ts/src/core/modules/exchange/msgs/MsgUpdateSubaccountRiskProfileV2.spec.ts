import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'
import MsgUpdateSubaccountRiskProfileV2 from './MsgUpdateSubaccountRiskProfileV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateSubaccountRiskProfileV2['params'] = {
  sender: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  riskProfile: {
    mode: InjectiveExchangeV2ExchangePb.RiskMode.CROSS,
    reservationPolicy:
      InjectiveExchangeV2ExchangePb.ReservationPolicy.FULL_HOLD,
    creditLineId: '',
  },
}

const protoType = '/injective.exchange.v2.MsgUpdateSubaccountRiskProfile'
const protoTypeShort = 'exchange/MsgUpdateSubaccountRiskProfile'
const message = MsgUpdateSubaccountRiskProfileV2.fromJSON(params)

describe('MsgUpdateSubaccountRiskProfileV2', () => {
  it('generates proper proto', () => {
    expect(message.toProto()).toStrictEqual(params)
  })

  it('generates proper data', () => {
    expect(message.toData()).toStrictEqual({
      '@type': protoType,
      ...params,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toStrictEqual({
      type: protoTypeShort,
      value: {
        sender: params.sender,
        subaccount_id: params.subaccountId,
        risk_profile: {
          mode: params.riskProfile.mode,
          reservation_policy: params.riskProfile.reservationPolicy,
          credit_line_id: params.riskProfile.creditLineId,
        },
      },
    })
  })

  it('preserves credit_line_id in EIP712 v1', () => {
    expect(message.toEip712()).toStrictEqual({
      type: protoTypeShort,
      value: {
        sender: params.sender,
        subaccount_id: params.subaccountId,
        risk_profile: {
          mode: params.riskProfile.mode,
          reservation_policy: params.riskProfile.reservationPolicy,
          credit_line_id: params.riskProfile.creditLineId,
        },
      },
    })
    expect(message.toEip712Types().get('TypeRiskProfile')).toStrictEqual([
      { name: 'mode', type: 'int32' },
      { name: 'reservation_policy', type: 'int32' },
      { name: 'credit_line_id', type: 'string' },
    ])
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

      const web3GwTypedData = JSON.parse(txResponse.data)
      const normalizedEip712TypedData = JSON.parse(
        JSON.stringify(eip712TypedData),
      )
      const sdkRiskProfile =
        normalizedEip712TypedData.message.msgs[0].value.risk_profile
      const web3GwRiskProfile =
        web3GwTypedData.message.msgs[0].value.risk_profile

      expect(sdkRiskProfile).toHaveProperty('credit_line_id')
      expect(
        normalizedEip712TypedData.types.TypeRiskProfile.some(
          ({ name }: { name: string }) => name === 'credit_line_id',
        ),
      ).toBe(true)
      expect(web3GwRiskProfile).not.toHaveProperty('credit_line_id')
      expect(
        web3GwTypedData.types.TypeRiskProfile.some(
          ({ name }: { name: string }) => name === 'credit_line_id',
        ),
      ).toBe(false)

      delete sdkRiskProfile.credit_line_id
      normalizedEip712TypedData.types.TypeRiskProfile =
        normalizedEip712TypedData.types.TypeRiskProfile.filter(
          ({ name }: { name: string }) => name !== 'credit_line_id',
        )

      expect(normalizedEip712TypedData).toStrictEqual(web3GwTypedData)
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
