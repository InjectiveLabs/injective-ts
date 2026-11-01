import { vi } from 'vitest'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts/utils'
import {
  toHex,
  hexToBytes,
  bytesToHex,
  verifyMessage,
  hashTypedData,
  recoverAddress,
} from 'viem'
import type { Hex } from 'viem'
import type { WalletMetadata } from '@injectivelabs/wallet-base'

// Hardhat/Anvil public test account #1, never funded
const account = privateKeyToAccount(
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
)
const evmOptions = {
  evmChainId: EvmChainId.TestnetEvm,
  rpcUrl: 'http://127.0.0.1:1',
}

const eip712 = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'chainId', type: 'uint256' },
    ],
    Msg: [{ name: 'text', type: 'string' }],
  } as const,
  primaryType: 'Msg',
  domain: { name: 'Injective Web3', chainId: '0x59f' },
  message: { text: 'hello' },
}

const createProvider = () => ({
  request: vi.fn(
    async ({
      method,
      params,
    }: {
      method: string
      params?: unknown[]
    }): Promise<unknown> => {
      const [first] = params ?? []

      if (method === 'secp256k1_sign') {
        return account.sign({ hash: first as Hex })
      }

      if (method === 'personal_sign') {
        return account.signMessage({ message: first as string })
      }

      throw new Error(`Unexpected method: ${method}`)
    },
  ),
})

const mockPublicClient = (prepared: Record<string, unknown>) => {
  const publicClient = {
    prepareTransactionRequest: vi.fn().mockResolvedValue(prepared),
    sendRawTransaction: vi.fn().mockResolvedValue('0xhash'),
  }

  vi.doMock('@injectivelabs/wallet-base', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@injectivelabs/wallet-base')>()),
    getViemPublicClient: vi.fn(() => publicClient),
  }))

  return publicClient
}

const createStrategy = async (
  provider = createProvider(),
  address: string = account.address,
) => {
  const { PrivyWalletStrategy } = await import('./strategy.js')

  return new PrivyWalletStrategy({
    chainId: ChainId.Testnet,
    evmOptions,
    metadata: { privy: { address, getProvider: async () => provider } },
  })
}

describe('PrivyWalletStrategy', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('signs the EIP-712 digest with secp256k1_sign and the signature recovers to the wallet', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)

    const signature = await strategy.signEip712TypedData(
      JSON.stringify(eip712),
      account.address,
    )

    const hash = hashTypedData({
      types: eip712.types,
      primaryType: 'Msg',
      domain: { ...eip712.domain, chainId: 0x59fn },
      message: eip712.message,
    })

    expect(provider.request).toHaveBeenCalledWith({
      method: 'secp256k1_sign',
      params: [hash],
    })
    expect(await recoverAddress({ hash, signature: signature as Hex })).toBe(
      account.address,
    )
  })

  it('turns a 0/1 recovery id into 27/28', async () => {
    const provider = createProvider()
    provider.request.mockImplementationOnce(async ({ params }) => {
      const bytes = hexToBytes(await account.sign({ hash: params![0] as Hex }))
      bytes[64] -= 27

      return bytesToHex(bytes)
    })
    const strategy = await createStrategy(provider)

    const signature = await strategy.signEip712TypedData(
      JSON.stringify(eip712),
      account.address,
    )

    expect([27, 28]).toContain(hexToBytes(signature as Hex)[64])
  })

  it('accepts the signature shapes the Privy SDKs return', async () => {
    for (const shape of [
      (signature: Hex) => signature.slice(2),
      (signature: Hex) => ({ signature }),
    ]) {
      const provider = createProvider()
      provider.request.mockImplementationOnce(async ({ params }) =>
        shape(await account.sign({ hash: params![0] as Hex })),
      )
      const strategy = await createStrategy(provider)

      const signature = await strategy.signEip712TypedData(
        JSON.stringify(eip712),
        account.address,
      )

      expect(signature).toMatch(/^0x[0-9a-f]{130}$/)
    }
  })

  it('refuses to sign for an address that is not the Privy wallet', async () => {
    const strategy = await createStrategy()

    await expect(
      strategy.signEip712TypedData(
        JSON.stringify(eip712),
        '0x0000000000000000000000000000000000000001',
      ),
    ).rejects.toThrow('is not the connected Privy wallet')
  })

  it('rejects EIP-712 data that is not JSON', async () => {
    const strategy = await createStrategy()

    await expect(
      strategy.signEip712TypedData('not json', account.address),
    ).rejects.toThrow('Invalid JSON format')
  })

  it('signs arbitrary data with personal_sign', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)

    const signature = await strategy.signArbitrary(account.address, 'hello')

    expect(provider.request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: ['hello', account.address],
    })
    expect(
      await verifyMessage({
        address: account.address,
        message: 'hello',
        signature: signature as Hex,
      }),
    ).toBe(true)
  })

  it('wraps provider failures in a WalletException', async () => {
    const provider = createProvider()
    provider.request.mockRejectedValueOnce(new Error('user rejected'))
    const strategy = await createStrategy(provider)

    await expect(
      strategy.signArbitrary(account.address, 'hello'),
    ).rejects.toMatchObject({
      name: 'WalletException',
      contextModule: 'sign-arbitrary',
    })
  })

  it('returns the checksummed wallet address and reports when it is not set up', async () => {
    const strategy = await createStrategy(
      createProvider(),
      account.address.toLowerCase(),
    )
    await expect(strategy.getAddresses()).resolves.toEqual([account.address])

    const { PrivyWalletStrategy } = await import('./strategy.js')
    const empty = new PrivyWalletStrategy({
      chainId: ChainId.Testnet,
      evmOptions,
    })
    await expect(empty.enable()).resolves.toBe(false)
    await expect(empty.getAddresses()).rejects.toMatchObject({
      name: 'PrivyWalletSessionException',
      message: 'Privy metadata with address and getProvider is required',
    })
  })

  it('passes a session error from getProvider on unchanged', async () => {
    const { PrivyWalletSessionException } =
      await import('@injectivelabs/exceptions')
    const strategy = await createStrategy()

    strategy.setMetadata({
      privy: {
        address: account.address,
        getProvider: async () => {
          throw new PrivyWalletSessionException(new Error('Signed out'))
        },
      },
    })

    await expect(
      strategy.signArbitrary(account.address, 'hello'),
    ).rejects.toMatchObject({ name: 'PrivyWalletSessionException' })
  })

  it('prepares EVM transactions on our RPC and signs them with eth_signTransaction', async () => {
    const prepared = {
      to: '0x0000000000000000000000000000000000000002',
      data: '0x',
      value: 1n,
      gas: 21_000n,
      nonce: 7,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 1n,
    }
    const publicClient = mockPublicClient(prepared)
    const provider = createProvider()
    provider.request.mockResolvedValueOnce('0x02signed')
    const strategy = await createStrategy(provider)

    const hash = await strategy.sendEvmTransaction(
      { to: prepared.to, value: '0x1', gasLimit: toHex(21_000) },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )

    expect(hash).toBe('0xhash')
    expect(publicClient.prepareTransactionRequest).toHaveBeenCalledWith({
      to: prepared.to,
      value: 1n,
      gas: 21_000n,
      account: account.address,
    })
    expect(provider.request).toHaveBeenCalledWith({
      method: 'eth_signTransaction',
      params: [
        {
          from: account.address,
          to: prepared.to,
          chainId: Number(EvmChainId.TestnetEvm),
          nonce: 7,
          value: '0x1',
          data: '0x',
          gasLimit: '0x5208',
          type: 2,
          maxFeePerGas: '0x2',
          maxPriorityFeePerGas: '0x1',
        },
      ],
    })
    expect(publicClient.sendRawTransaction).toHaveBeenCalledWith({
      serializedTransaction: '0x02signed',
    })
  })

  it('drops null fields and sends legacy transactions as type 0', async () => {
    const publicClient = mockPublicClient({
      to: '0x0000000000000000000000000000000000000002',
      data: '0xabcd',
      value: 0n,
      gas: 50_000n,
      nonce: 1,
      type: 'legacy',
      gasPrice: 5n,
    })
    const provider = createProvider()
    provider.request.mockResolvedValueOnce('0xf8signed')
    const strategy = await createStrategy(provider)

    await strategy.sendEvmTransaction(
      {
        to: '0x0000000000000000000000000000000000000002',
        input: '0xabcd',
        type: '0x0',
        gasPrice: '0x5',
        maxFeePerGas: null,
        maxPriorityFeePerGas: null,
      },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )

    expect(publicClient.prepareTransactionRequest).toHaveBeenCalledWith({
      to: '0x0000000000000000000000000000000000000002',
      data: '0xabcd',
      type: 'legacy',
      gasPrice: 5n,
      account: account.address,
    })
    expect(provider.request.mock.calls[0][0].params![0]).toEqual({
      from: account.address,
      to: '0x0000000000000000000000000000000000000002',
      chainId: Number(EvmChainId.TestnetEvm),
      nonce: 1,
      value: '0x0',
      data: '0xabcd',
      gasLimit: '0xc350',
      type: 0,
      gasPrice: '0x5',
    })
  })

  it('keeps the access list on typed transactions', async () => {
    const accessList = [
      {
        address: '0x0000000000000000000000000000000000000003',
        storageKeys: [],
      },
    ]
    mockPublicClient({
      to: '0x0000000000000000000000000000000000000002',
      value: 0n,
      gas: 30_000n,
      nonce: 2,
      maxFeePerGas: 2n,
      maxPriorityFeePerGas: 1n,
      accessList,
    })
    const provider = createProvider()
    provider.request.mockResolvedValueOnce('0x02signed')
    const strategy = await createStrategy(provider)

    await strategy.sendEvmTransaction(
      { to: '0x0000000000000000000000000000000000000002', accessList },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )

    expect(provider.request.mock.calls[0][0].params![0]).toMatchObject({
      type: 2,
      accessList,
    })
  })

  it('accepts the signer as an inj address', async () => {
    const strategy = await createStrategy()

    await expect(
      strategy.signArbitrary(getInjectiveAddress(account.address), 'hello'),
    ).resolves.toMatch(/^0x/)
    await expect(
      strategy.signEip712TypedData(
        JSON.stringify(eip712),
        getInjectiveAddress(account.address),
      ),
    ).resolves.toMatch(/^0x/)
    await expect(
      strategy.signArbitrary('not-an-address', 'hello'),
    ).rejects.toMatchObject({ name: 'WalletException' })
  })

  it("keeps the Privy wallet when another wallet's metadata is set", async () => {
    const strategy = await createStrategy()

    strategy.setMetadata({
      privateKey: { privateKey: '0x01' },
    } as WalletMetadata)

    await expect(strategy.getAddresses()).resolves.toEqual([account.address])
    await expect(strategy.enable()).resolves.toBe(true)
  })

  it('forgets the wallet on disconnect', async () => {
    const strategy = await createStrategy()

    await strategy.disconnect()

    await expect(strategy.enable()).resolves.toBe(false)
    await expect(strategy.getAddresses()).rejects.toMatchObject({
      name: 'PrivyWalletSessionException',
    })
  })

  it("passes the provider's error code on", async () => {
    const provider = createProvider()
    provider.request.mockRejectedValueOnce(
      Object.assign(new Error('User rejected the request'), { code: 4001 }),
    )
    const strategy = await createStrategy(provider)

    await expect(
      strategy.signArbitrary(account.address, 'hello'),
    ).rejects.toMatchObject({ contextCode: 4001 })
  })

  it('returns a hex confirmation message', async () => {
    const strategy = await createStrategy()

    expect(await strategy.getSessionOrConfirm(account.address)).toMatch(
      /^0x[0-9a-f]+$/,
    )
  })

  it('reports the chain id as hex, like eth_chainId', async () => {
    const strategy = await createStrategy()
    const chainId = await strategy.getEthereumChainId()

    expect(chainId).toMatch(/^0x[0-9a-f]+$/)
    expect(parseInt(chainId, 16)).toBe(evmOptions.evmChainId)
  })

  it('wraps a bad address or bad typed data in a WalletException', async () => {
    const badAddress = await createStrategy(createProvider(), '0x1234')
    await expect(badAddress.getAddresses()).rejects.toMatchObject({
      name: 'WalletException',
    })

    const strategy = await createStrategy()
    await expect(
      strategy.signEip712TypedData(
        JSON.stringify({ ...eip712, primaryType: 'Missing' }),
        account.address,
      ),
    ).rejects.toMatchObject({ name: 'WalletException' })
  })

  it('is an EVM wallet that the broadcaster treats like Turnkey', async () => {
    const { Wallet, isEvmWallet, isEip712V2OnlyWallet } =
      await import('@injectivelabs/wallet-base')

    expect(isEvmWallet(Wallet.Privy)).toBe(true)
    expect(isEip712V2OnlyWallet(Wallet.Privy)).toBe(
      isEip712V2OnlyWallet(Wallet.Turnkey),
    )
  })
})
