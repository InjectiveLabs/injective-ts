import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { assertEip712V1Values } from './validate.js'
import MsgExec from '../../modules/authz/msgs/MsgExec.js'
import { PrivateKey } from '../../accounts/PrivateKey.js'
import { uint8ArrayToHex } from '../../../utils/encoding.js'
import { getEip712TypedData, getEip712TypedDataV2 } from './eip712.js'
import { recoverTypedSignaturePubKey } from '../../../utils/transaction.js'
import MsgUpdateSwapParamsV2 from '../../modules/exchange/msgs/MsgUpdateSwapParamsV2.js'
import MsgSubmitGenericProposal from '../../modules/gov/msgs/MsgSubmitGenericProposal.js'
import MsgBatchUpdateOrdersV2 from '../../modules/exchange/msgs/MsgBatchUpdateOrdersV2.js'
import MsgReclaimLockedFundsV2 from '../../modules/exchange/msgs/MsgReclaimLockedFundsV2.js'
import MsgUpdateSubaccountRiskProfileV2 from '../../modules/exchange/msgs/MsgUpdateSubaccountRiskProfileV2.js'
import MsgUpdateSubaccountMarketRiskModeV2 from '../../modules/exchange/msgs/MsgUpdateSubaccountMarketRiskModeV2.js'
import MsgSetConsolidatedInsurancePoolPause from '../../modules/insurance/msgs/MsgSetConsolidatedInsurancePoolPause.js'
import type { TypedDataDefinition } from 'viem'

const sender = mockFactory.injectiveAddress
const subaccountId = mockFactory.subaccountId
const signer = PrivateKey.fromHex('1'.padStart(64, '0'))
const swap = (enabled: boolean) =>
  MsgUpdateSwapParamsV2.fromJSON({
    sender,
    swapParams: { enabled, allowedMarkets: ['0xmarket'] },
  })
const profile = (mode: number, reservationPolicy: number) =>
  MsgUpdateSubaccountRiskProfileV2.fromJSON({
    sender,
    subaccountId,
    riskProfile: { mode, reservationPolicy, creditLineId: '' },
  })
const market = (mode: number) =>
  MsgUpdateSubaccountMarketRiskModeV2.fromJSON({
    sender,
    subaccountId,
    marketId: mockFactory.derivativeMarketId,
    mode,
  })
const pause = (paused: boolean) =>
  MsgSetConsolidatedInsurancePoolPause.fromJSON({
    authority: sender,
    depositDenom: 'usdt',
    paused,
  })

describe('EIP712 v1 compatibility', () => {
  it('accepts explicit false and zero values, and rejects null or missing values', () => {
    const types = new Map([
      [
        'MsgValue',
        [
          { name: 'enabled', type: 'bool' },
          { name: 'mode', type: 'int32' },
        ],
      ],
    ])
    expect(() =>
      assertEip712V1Values({ enabled: false, mode: 0 }, types),
    ).not.toThrow()
    expect(() =>
      assertEip712V1Values({ enabled: true, mode: null }, types),
    ).toThrow('value.mode')
    expect(() => assertEip712V1Values(undefined, types)).toThrow(
      'value.enabled',
    )
  })

  it.each([
    ['swap disabled', swap(true), swap(false), 'swap_params.enabled'],
    ['zero risk mode', profile(2, 1), profile(0, 1), 'risk_profile.mode'],
    [
      'zero policy',
      profile(2, 1),
      profile(2, 0),
      'risk_profile.reservation_policy',
    ],
    ['unpin market', market(1), market(0), 'mode'],
    ['resume insurance', pause(true), pause(false), 'paused'],
  ] as const)(
    '%s rejects incomplete v1 data and supports v2',
    async (_name, control, message, field) => {
      const controlArgs = prepareEip712({ messages: control }).eip712Args
      const typedData = getEip712TypedData(controlArgs)
      const signature = await signer.signTypedData(typedData)

      expect(
        await recoverTypedSignaturePubKey(
          typedData as unknown as TypedDataDefinition,
          `0x${uint8ArrayToHex(signature)}`,
        ),
      ).toBe(`0x${signer.toPublicKey().toHex()}`)

      const args = prepareEip712({ messages: message }).eip712Args
      const amino = message.toAmino()
      expect(() => getEip712TypedData(args)).toThrow(
        `EIP712_v1 cannot sign an omitted field (msgs[0].value.${field}). Please use EIP712_v2`,
      )
      expect(message.toAmino()).toStrictEqual(amino)

      const v2 = getEip712TypedDataV2(args)
      const signatureV2 = await signer.signTypedData(v2)
      expect(
        await recoverTypedSignaturePubKey(
          v2 as unknown as TypedDataDefinition,
          `0x${uint8ArrayToHex(signatureV2)}`,
        ),
      ).toBe(`0x${signer.toPublicKey().toHex()}`)
    },
  )

  it('checks every transaction message, including later defaults', () => {
    const args = prepareEip712({
      messages: [swap(true), swap(false)],
    }).eip712Args
    expect(() => getEip712TypedData(args)).toThrow(
      'msgs[1].value.swap_params.enabled',
    )
  })

  it('checks every nested order, including later omitted expiration blocks', () => {
    const order = {
      orderType: 1,
      marketId: mockFactory.injUsdtSpotMarket.marketId,
      feeRecipient: sender,
      price: '1500000',
      quantity: '100',
    }
    const message = MsgBatchUpdateOrdersV2.fromJSON({
      injectiveAddress: sender,
      subaccountId,
      spotOrdersToCreate: [{ ...order, expirationBlock: '123' }, order],
    })
    const args = prepareEip712({ messages: message }).eip712Args
    expect(() => getEip712TypedData(args)).toThrow(
      'msgs[0].value.spot_orders_to_create[1].expiration_block',
    )
  })

  describe('array fields', () => {
    const types = new Map([['MsgValue', [{ name: 'bytes', type: 'uint8[]' }]]])

    it('accepts an array and rejects anything else, such as the base64 of bytes', () => {
      expect(() => assertEip712V1Values({ bytes: [1, 2] }, types)).not.toThrow()
      expect(() => assertEip712V1Values({ bytes: 'AQID' }, types)).toThrow(
        'EIP712_v1 cannot sign a non-array value for an array field (value.bytes). Please use EIP712_v2',
      )
    })

    const reclaim = MsgReclaimLockedFundsV2.fromJSON({
      sender,
      lockedAccountPubKey: 'dGVzdC1wdWJrZXk=',
      signature: new Uint8Array([1, 2, 3]),
    })

    it.each([
      [
        'MsgExec',
        'msgs[0].value.msgs[0].value.lockedAccountPubKey',
        MsgExec.fromJSON({ grantee: sender, msgs: [reclaim] }),
      ],
      [
        'a proposal',
        'msgs[0].value.messages[0].value.lockedAccountPubKey',
        MsgSubmitGenericProposal.fromJSON({
          title: 'Test Proposal',
          summary: 'Test Summary',
          expedited: true,
          proposer: sender,
          metadata: 'Test Metadata',
          messages: [reclaim],
          deposit: { amount: '1', denom: 'inj' },
        }),
      ],
    ])(
      'rejects the bytes of a message nested in %s',
      (_name, path, message) => {
        const { eip712Args } = prepareEip712({ messages: message })

        expect(() => getEip712TypedData(eip712Args)).toThrow(
          `non-array value for an array field (${path})`,
        )
      },
    )
  })
})
