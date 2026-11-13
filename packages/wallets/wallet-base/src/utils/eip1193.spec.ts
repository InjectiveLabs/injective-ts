import { vi } from 'vitest'
import { privateKeyToAccount } from 'viem/accounts'
import { parseTransaction, recoverTransactionAddress } from 'viem'
import { getViemWalletClient } from './viem.js'
import { getEip1193ProviderForAccount } from './eip1193.js'
import type { LocalAccount } from 'viem'

vi.mock('./viem.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./viem.js')>()),
  getEvmChainConfig: vi.fn(),
  getViemPublicClient: vi.fn(),
  getViemWalletClient: vi.fn(() => ({
    request: vi.fn(() => {
      throw new Error('Unexpected RPC fallback')
    }),
  })),
}))

describe('EIP-1193 provider for a viem account', () => {
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

  it('accepts event listeners without emitting events', async () => {
    const provider = await getEip1193ProviderForAccount(account, 1)
    const listener = vi.fn()

    expect(() => provider.on('chainChanged', listener)).not.toThrow()
    expect(() =>
      provider.removeListener('chainChanged', listener),
    ).not.toThrow()
    expect(listener).not.toHaveBeenCalled()
  })

  it.each(['eth_requestAccounts', 'eth_accounts'])(
    'resolves %s from the account',
    async (method) => {
      const provider = await getEip1193ProviderForAccount(account, 1, {
        rpcUrl: 'http://127.0.0.1:1',
      })

      await expect(provider.request({ method, params: [] })).resolves.toEqual([
        address,
      ])
    },
  )

  it.each(['eth_sign', 'personal_sign', 'eth_signMessage'])(
    'routes %s through the message signer',
    async (method) => {
      const signMessage = vi.fn().mockResolvedValue('0xsigned')
      const provider = await getEip1193ProviderForAccount(
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
        method === 'eth_sign'
          ? [address, '0x68656c6c6f']
          : method === 'personal_sign'
            ? ['hello', address]
            : ['hello']

      await expect(provider.request({ method, params })).resolves.toBe(
        '0xsigned',
      )
      expect(signMessage).toHaveBeenCalledTimes(1)
    },
  )

  it.each(['eth_sign', 'personal_sign'])(
    'rejects %s without a message payload',
    async (method) => {
      const signMessage = vi.fn()
      const provider = await getEip1193ProviderForAccount(
        {
          ...account,
          signMessage,
        } as unknown as LocalAccount,
        1,
        {
          rpcUrl: 'http://127.0.0.1:1',
        },
      )

      await expect(
        provider.request({ method, params: [address] }),
      ).rejects.toThrow(`Missing message parameter for ${method}`)
      expect(signMessage).not.toHaveBeenCalled()
    },
  )

  it.each([
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
  ])('routes %s through the typed data signer', async (method) => {
    const sign = vi.fn().mockResolvedValue('0xtyped')
    const provider = await getEip1193ProviderForAccount(
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

  it('rejects typed data signing without a typed-data payload', async () => {
    const sign = vi.fn()
    const provider = await getEip1193ProviderForAccount(
      {
        ...account,
        sign,
      } as unknown as LocalAccount,
      1,
      {
        rpcUrl: 'http://127.0.0.1:1',
      },
    )

    await expect(
      provider.request({ method: 'eth_signTypedData_v4', params: [address] }),
    ).rejects.toThrow('Missing typed data parameter for eth_signTypedData_v4')
    expect(sign).not.toHaveBeenCalled()
  })

  it('routes eth_signTransaction through the transaction signer', async () => {
    const signTransaction = vi.fn().mockResolvedValue('0xsignedtx')
    const provider = await getEip1193ProviderForAccount(
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
    expect(signTransaction).toHaveBeenCalledWith({ chainId: 1, to: address })
  })

  it.each(['eth_signTransaction', 'eth_sendTransaction'])(
    '%s refuses a transaction for another chain',
    async (method) => {
      const signTransaction = vi.fn()
      const provider = await getEip1193ProviderForAccount(
        { ...account, signTransaction } as unknown as LocalAccount,
        1439,
        { rpcUrl: 'http://127.0.0.1:1' },
      )

      await expect(
        provider.request({ method, params: [{ to: address, chainId: '0x1' }] }),
      ).rejects.toThrow('Transaction is for chain 1, not 1439')
      expect(signTransaction).not.toHaveBeenCalled()
    },
  )

  it('signs an RPC-shaped EIP-1559 transaction for the account', async () => {
    // Anvil's first well-known test key
    const signer = privateKeyToAccount(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    )
    const provider = await getEip1193ProviderForAccount(signer, 1439, {
      rpcUrl: 'http://127.0.0.1:1',
    })

    const signed = await provider.request({
      method: 'eth_signTransaction',
      params: [
        {
          from: signer.address,
          to: address,
          type: '0x2',
          nonce: '0x0',
          value: '0xa',
          gas: '0x5208',
          maxFeePerGas: '0x3b9aca00',
          maxPriorityFeePerGas: '0x1',
        },
      ],
    })

    expect(parseTransaction(signed)).toMatchObject({
      type: 'eip1559',
      chainId: 1439,
      nonce: 0,
      value: 10n,
    })
    expect(
      await recoverTransactionAddress({ serializedTransaction: signed }),
    ).toBe(signer.address)
  })

  it.each(['eth_sendTransaction', 'wallet_sendTransaction'])(
    'routes %s through the transaction signer',
    async (method) => {
      const transaction = {
        from: address,
        to: '0x0000000000000000000000000000000000000002',
        value: '0x0',
        data: '0x',
      }
      const preparedTransaction = {
        ...transaction,
        value: 0n,
        gas: 21_000n,
      }
      const prepareTransactionRequest = vi
        .fn()
        .mockResolvedValue(preparedTransaction)
      const sendRawTransaction = vi.fn().mockResolvedValue('0xtxhash')
      const request = vi.fn(() => {
        throw new Error('Unexpected RPC fallback')
      })

      vi.mocked(getViemWalletClient).mockReturnValue({
        prepareTransactionRequest,
        sendRawTransaction,
        request,
      } as any)

      const signTransaction = vi.fn().mockResolvedValue('0xsignedtx')
      const provider = await getEip1193ProviderForAccount(
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
        provider.request({ method, params: [transaction] }),
      ).resolves.toBe('0xtxhash')
      expect(prepareTransactionRequest).toHaveBeenCalledWith({
        to: transaction.to,
        data: transaction.data,
        value: 0n,
      })
      expect(signTransaction).toHaveBeenCalledWith(preparedTransaction)
      expect(sendRawTransaction).toHaveBeenCalledWith({
        serializedTransaction: '0xsignedtx',
      })
      expect(request).not.toHaveBeenCalled()
    },
  )
})
