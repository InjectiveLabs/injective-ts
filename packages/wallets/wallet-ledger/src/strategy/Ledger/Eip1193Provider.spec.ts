import { vi } from 'vitest'
import { LedgerEip1193Provider } from './Eip1193Provider.js'
import type LedgerHW from './hw/index.js'

vi.mock('@injectivelabs/wallet-base', () => ({
  getEvmChainConfig: vi.fn(),
  getViemPublicClient: vi.fn(),
  getViemWalletClient: vi.fn(() => ({
    request: vi.fn(() => {
      throw new Error('Unexpected RPC fallback')
    }),
  })),
}))

describe('Ledger EIP-1193 provider', () => {
  const address = '0x0000000000000000000000000000000000000001'
  const typedData = {
    domain: { name: 'Injective', version: '1', chainId: 1 },
    types: {
      Message: [{ name: 'contents', type: 'string' }],
    },
    primaryType: 'Message',
    message: {
      contents: 'hello',
    },
  }

  const getProvider = () => {
    const ledger = {
      getInstance: vi.fn().mockResolvedValue({
        getAddress: vi.fn().mockResolvedValue({ address }),
      }),
    } as unknown as LedgerHW

    return new LedgerEip1193Provider(ledger, {
      rpcUrl: 'http://127.0.0.1:1',
    })
  }

  it.each(['eth_requestAccounts', 'eth_accounts'])(
    'resolves %s from the Ledger account',
    async (method) => {
      const provider = getProvider()

      await expect(provider.request({ method, params: [] })).resolves.toEqual([
        address,
      ])
    },
  )

  it.each(['eth_sign', 'personal_sign'])(
    'routes %s through the Ledger message signer',
    async (method) => {
      const provider = getProvider()
      const signMessage = vi
        .spyOn(provider, 'signMessage')
        .mockResolvedValue('0xsigned')

      const params =
        method === 'eth_sign' ? [address, '0x68656c6c6f'] : ['hello', address]

      await expect(provider.request({ method, params })).resolves.toBe(
        '0xsigned',
      )
      expect(signMessage).toHaveBeenCalledWith('68656c6c6f')
    },
  )

  it.each(['eth_sign', 'personal_sign'])(
    'rejects %s without a message payload',
    async (method) => {
      const provider = getProvider()

      await expect(
        provider.request({ method, params: [address] }),
      ).rejects.toThrow(`Missing message parameter for ${method}`)
    },
  )

  it.each([
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
  ])('routes %s through the Ledger typed data signer', async (method) => {
    const provider = getProvider()
    const signTypedData = vi
      .spyOn(provider, 'signTypedData')
      .mockResolvedValue('0xtyped')

    const params =
      method === 'eth_signTypedData'
        ? [typedData]
        : [address, JSON.stringify(typedData)]

    await expect(provider.request({ method, params })).resolves.toBe('0xtyped')
    expect(signTypedData).toHaveBeenCalledWith(JSON.stringify(typedData))
  })

  it('rejects typed data signing without a typed-data payload', async () => {
    const provider = getProvider()

    await expect(
      provider.request({ method: 'eth_signTypedData_v4', params: [address] }),
    ).rejects.toThrow('Missing typed data parameter for eth_signTypedData_v4')
  })
})
