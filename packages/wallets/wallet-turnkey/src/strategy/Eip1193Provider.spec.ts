import { vi } from 'vitest'
import { getEip1193ProviderForTurnkey } from './Eip1193Provider.js'
import type { LocalAccount } from 'viem'

vi.mock('@injectivelabs/wallet-base', () => ({
  getEvmChainConfig: vi.fn(),
  getViemPublicClient: vi.fn(),
  getViemWalletClient: vi.fn(() => ({
    request: vi.fn(() => {
      throw new Error('Unexpected RPC fallback')
    }),
  })),
}))

describe('Turnkey EIP-1193 provider', () => {
  const address = '0x0000000000000000000000000000000000000001'
  const typedData = {
    domain: {
      name: 'Injective',
      version: '1',
      chainId: 1,
      verifyingContract: '0x0000000000000000000000000000000000000002',
    },
    types: {
      Message: [{ name: 'contents', type: 'string' }],
    },
    primaryType: 'Message',
    message: {
      contents: 'hello',
    },
  }

  const account = {
    address,
    sign: vi.fn(),
    signTypedData: vi.fn(),
    signMessage: vi.fn(),
    signTransaction: vi.fn(),
  } as unknown as LocalAccount

  it.each(['eth_requestAccounts', 'eth_accounts'])(
    'resolves %s from the Turnkey account',
    async (method) => {
      const provider = await getEip1193ProviderForTurnkey(account, 1, {
        rpcUrl: 'http://127.0.0.1:1',
      })

      await expect(provider.request({ method, params: [] })).resolves.toEqual([
        address,
      ])
    },
  )

  it.each(['eth_sign', 'personal_sign'])(
    'routes %s through the Turnkey message signer',
    async (method) => {
      const signMessage = vi.fn().mockResolvedValue('0xsigned')
      const provider = await getEip1193ProviderForTurnkey(
        {
          ...account,
          signMessage,
        } as unknown as LocalAccount,
        1,
        {
          rpcUrl: 'http://127.0.0.1:1',
        },
      )

      const params =
        method === 'eth_sign' ? [address, '0x68656c6c6f'] : ['hello', address]

      await expect(provider.request({ method, params })).resolves.toBe(
        '0xsigned',
      )
      expect(signMessage).toHaveBeenCalledTimes(1)
    },
  )

  it.each([
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
  ])('routes %s through the Turnkey typed data signer', async (method) => {
    const sign = vi.fn().mockResolvedValue('0xtyped')
    const provider = await getEip1193ProviderForTurnkey(
      {
        ...account,
        sign,
      } as unknown as LocalAccount,
      1,
      {
        rpcUrl: 'http://127.0.0.1:1',
      },
    )

    const params =
      method === 'eth_signTypedData'
        ? [typedData]
        : [address, JSON.stringify(typedData)]

    await expect(provider.request({ method, params })).resolves.toBe('0xtyped')
    expect(sign).toHaveBeenCalledTimes(1)
  })

  it('routes eth_signTransaction through the Turnkey transaction signer', async () => {
    const signTransaction = vi.fn().mockResolvedValue('0xsignedtx')
    const provider = await getEip1193ProviderForTurnkey(
      {
        ...account,
        signTransaction,
      } as unknown as LocalAccount,
      1,
      {
        rpcUrl: 'http://127.0.0.1:1',
      },
    )

    await expect(
      provider.request({
        method: 'eth_signTransaction',
        params: [{ to: address }],
      }),
    ).resolves.toBe('0xsignedtx')
    expect(signTransaction).toHaveBeenCalledWith({ to: address })
  })
})
