import { getAddress } from 'viem'
import { vi, it, expect, describe } from 'vitest'
import { ChainId } from '@injectivelabs/ts-types'
import { Wallet } from '@injectivelabs/wallet-base'
import { EvmWallet } from './strategy.js'
import type { BrowserEip1993Provider } from '@injectivelabs/wallet-base'

const signer = '0x000000000000000000000000000000000000dead'

const setup = () => {
  const request = vi.fn().mockResolvedValue('0xsigned')
  const provider = { request } as unknown as BrowserEip1993Provider
  const strategy = new EvmWallet({
    chainId: ChainId.Devnet,
    wallet: Wallet.Metamask,
  })

  vi.spyOn(
    strategy as unknown as {
      getEthereum(): Promise<BrowserEip1993Provider>
    },
    'getEthereum',
  ).mockResolvedValue(provider)

  return { request, strategy }
}

describe('EvmWallet signing payloads', () => {
  it('validates the signer for typed-data requests', async () => {
    const { request, strategy } = setup()
    const typedData = '{"primaryType":"Mail"}'

    await expect(strategy.signEip712TypedData(typedData, signer)).resolves.toBe(
      '0xsigned',
    )
    expect(request).toHaveBeenCalledWith({
      method: 'eth_signTypedData_v4',
      params: [getAddress(signer), typedData],
    })
  })

  it.each([
    {
      data: 'hello',
      expected: '0x68656c6c6f',
      name: 'UTF-8 text',
    },
    {
      data: '0x68656c6c6f',
      expected: '0x68656c6c6f',
      name: 'existing hex',
    },
    {
      data: new Uint8Array([0xff, 0x00, 0x41]),
      expected: '0xff0041',
      name: 'raw bytes',
    },
  ])('encodes $name for personal_sign', async ({ data, expected }) => {
    const { request, strategy } = setup()

    await expect(strategy.signArbitrary(signer, data)).resolves.toBe('0xsigned')
    expect(request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: [expected, getAddress(signer)],
    })
  })
})
