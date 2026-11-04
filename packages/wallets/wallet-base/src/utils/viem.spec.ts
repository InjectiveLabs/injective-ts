import { toViemTransactionRequest } from './viem.js'

const from = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const to = '0x0000000000000000000000000000000000000002'

describe('toViemTransactionRequest', () => {
  it('reads 0x quantities as hex and other strings as decimal', () => {
    expect(
      toViemTransactionRequest(
        { to, value: '10', gas: '0x5208', gasPrice: 3, maxFeePerGas: 4n },
        from,
      ),
    ).toEqual({ to, value: 10n, gas: 21_000n, gasPrice: 3n, maxFeePerGas: 4n })
  })

  it('makes the nonce and chain ID numbers, so nonce 0 serializes canonically', () => {
    expect(
      toViemTransactionRequest({ to, nonce: '0x0', chainId: '0x59f' }, from),
    ).toEqual({ to, nonce: 0, chainId: 1439 })
  })

  it('drops null fields and maps gasLimit, input and the type', () => {
    expect(
      toViemTransactionRequest(
        {
          to,
          input: '0xabcd',
          gasLimit: '0x5208',
          type: '0x2',
          maxFeePerGas: null,
          nonce: undefined,
        },
        from,
      ),
    ).toEqual({ to, data: '0xabcd', gas: 21_000n, type: 'eip1559' })
  })

  it.each([
    [0, 'legacy'],
    ['eip7702', 'eip7702'],
    [4, 'eip7702'],
  ])('maps type %s to %s', (type, expected) => {
    expect(toViemTransactionRequest({ to, type }, from).type).toBe(expected)
  })

  it('rejects an unknown type', () => {
    expect(() => toViemTransactionRequest({ to, type: 9 }, from)).toThrow(
      'Unsupported transaction type 9',
    )
  })

  it.each(['', '  '])('rejects an empty quantity (%j)', (value) => {
    expect(() => toViemTransactionRequest({ to, value }, from)).toThrow(
      'Transaction value is empty',
    )
  })

  it('accepts its own from in any case and rejects another', () => {
    expect(
      toViemTransactionRequest({ to, from: from.toLowerCase() }, from),
    ).toEqual({ to })
    expect(() => toViemTransactionRequest({ to, from: to }, from)).toThrow(
      `Transaction is from ${to}, not ${from}`,
    )
  })
})
