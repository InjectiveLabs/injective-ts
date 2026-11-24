import { getAddress } from 'viem'
import { vi, it, expect, describe } from 'vitest'
import { ChainId } from '@injectivelabs/ts-types'
import { Wallet } from '@injectivelabs/wallet-base'
import { EvmWallet } from './strategy.js'
import type { BrowserEip1193Provider } from '@injectivelabs/wallet-base'

const signer = '0x000000000000000000000000000000000000dead'

const setup = (wallet: Wallet = Wallet.Metamask) => {
  const request = vi.fn().mockResolvedValue('0xsigned')
  const provider = { request } as unknown as BrowserEip1193Provider
  const strategy = new EvmWallet({
    chainId: ChainId.Devnet,
    wallet,
  })

  vi.spyOn(
    strategy as unknown as {
      getEthereum(): Promise<BrowserEip1193Provider>
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
    { wallet: Wallet.Phantom, domain: { chainId: '0x1' }, expected: 1 },
    { wallet: Wallet.Metamask, domain: { chainId: '0x1' }, expected: '0x1' },
    { wallet: Wallet.Phantom, domain: { name: 'x' }, expected: undefined },
  ])(
    'sends $domain from $wallet with chainId $expected',
    async ({ wallet, domain, expected }) => {
      const { request, strategy } = setup(wallet)

      await strategy.signEip712TypedData(JSON.stringify({ domain }), signer)

      const sent = JSON.parse(request.mock.calls[0][0].params[1])
      expect(sent.domain.chainId).toBe(expected)
    },
  )

  it('rejects a Phantom chainId above Number.MAX_SAFE_INTEGER', async () => {
    const { request, strategy } = setup(Wallet.Phantom)
    const typedData = JSON.stringify({
      domain: { chainId: '0x20000000000001' },
    })

    await expect(
      strategy.signEip712TypedData(typedData, signer),
    ).rejects.toThrow('9007199254740993')
    expect(request).not.toHaveBeenCalled()
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
