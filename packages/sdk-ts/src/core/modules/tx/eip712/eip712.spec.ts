import { mockFactory } from '@injectivelabs/test-utils'
import { BigNumberInBase, DEFAULT_STD_FEE } from '@injectivelabs/utils'
import { MsgSend } from '@injectivelabs/sdk-ts'
import { getEip712TypedDataV2 } from './eip712'

describe('EIP712V2', () => {
  test('generating proper EI712 v2', () => {
    const amount = {
      denom: 'inj',
      amount: new BigNumberInBase(0.01).toWei().toFixed(),
    }

    const msg = MsgSend.fromJSON({
      amount,
      srcInjectiveAddress: mockFactory.injectiveAddress,
      dstInjectiveAddress: mockFactory.injectiveAddress,
    })
    const ethereumChainId = 5
    const chainId = 'injective-777'
    const timeoutHeight = 1896
    const accountDetails = {
      accountNumber: 11,
      sequence: 88,
    }

    const eip712TypedData = getEip712TypedDataV2({
      msgs: [msg],
      fee: {
        ...DEFAULT_STD_FEE,
        feePayer: 'inj18j2myhaf2at75kwwaqxfstk4q28n4am45nlfg7',
      },
      tx: {
        memo: '',
        accountNumber: accountDetails.accountNumber.toString(),
        sequence: accountDetails.sequence.toString(),
        timeoutHeight: timeoutHeight.toString(),
        chainId,
      },
      ethereumChainId,
    })

    const expectedEip712 = {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
          {
            name: 'salt',
            type: 'string',
          },
        ],
        Tx: [
          {
            name: 'context',
            type: 'string',
          },
          {
            name: 'msgs',
            type: 'string',
          },
        ],
      },
      primaryType: 'Tx',
      domain: {
        name: 'Injective Web3',
        version: '1.0.0',
        chainId: '0x5',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        salt: '0',
      },
      message: {
        context:
          '{"account_number":11,"chain_id":"injective-777","fee":{"amount":[{"denom":"inj","amount":"64000000000000"}],"gas":400000,"payer":"inj18j2myhaf2at75kwwaqxfstk4q28n4am45nlfg7"},"memo":"","sequence":88,"timeout_height":1896}',
        msgs: `[{"@type":"/cosmos.bank.v1beta1.MsgSend","from_address":"${mockFactory.injectiveAddress}","to_address":"${mockFactory.injectiveAddress}","amount":[{"denom":"inj","amount":"10000000000000000"}]}]`,
      },
    }

    expect(eip712TypedData).toEqual(expectedEip712)
  })
})
