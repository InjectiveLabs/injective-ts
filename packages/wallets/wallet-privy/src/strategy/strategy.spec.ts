import { vi } from 'vitest'
import { privateKeyToAccount } from 'viem/accounts'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts/utils'
import {
  toHex,
  isHex,
  custom,
  hexToBytes,
  bytesToHex,
  stringToHex,
  verifyMessage,
  hashTypedData,
  recoverAddress,
  parseTransaction,
  createWalletClient,
  recoverTransactionAddress,
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

      // Like Privy and MetaMask: a 0x string is signed as bytes
      if (method === 'personal_sign') {
        return account.signMessage({
          message: isHex(first) ? { raw: first } : (first as string),
        })
      }

      throw new Error(`Unexpected method: ${method}`)
    },
  ),
})

const to = '0x0000000000000000000000000000000000000002'
const TX_HASH = `0x${'ab'.repeat(32)}`

// Our RPC: answers what viem asks while preparing, and keeps the raw transactions
const mockRpc = () => {
  const sent: Hex[] = []
  const request = async ({
    method,
    params,
  }: {
    method: string
    params?: unknown[]
  }) => {
    switch (method) {
      case 'eth_chainId':
        return toHex(EvmChainId.TestnetEvm)
      case 'eth_getTransactionCount':
        return '0x7'
      case 'eth_estimateGas':
        return toHex(30_000)
      case 'eth_gasPrice':
        return '0x5'
      case 'eth_maxPriorityFeePerGas':
        return '0x1'
      case 'eth_getBlockByNumber':
        return { number: '0x1', baseFeePerGas: '0x1', transactions: [] }
      case 'eth_sendRawTransaction':
        sent.push(params![0] as Hex)

        return TX_HASH
      default:
        throw new Error(`Unexpected RPC method: ${method}`)
    }
  }

  vi.doMock('@injectivelabs/wallet-base', async (importOriginal) => {
    const original =
      await importOriginal<typeof import('@injectivelabs/wallet-base')>()

    return {
      ...original,
      getViemWalletClient: ({ chainId, account }: any) =>
        createWalletClient({
          account,
          chain: original.getEvmChainConfig(chainId),
          transport: custom({ request }),
        }),
    }
  })

  return { sent }
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
      params: [stringToHex('hello'), account.address],
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

  it('prepares EVM transactions on our RPC and signs their hash with secp256k1_sign', async () => {
    const rpc = mockRpc()
    const provider = createProvider()
    const strategy = await createStrategy(provider)

    const hash = await strategy.sendEvmTransaction(
      { to, value: '10', gasLimit: toHex(21_000), from: account.address },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )

    expect(hash).toBe(TX_HASH)
    expect(provider.request.mock.calls.map(([{ method }]) => method)).toEqual([
      'secp256k1_sign',
    ])
    const [raw] = rpc.sent
    const tx = parseTransaction(raw)
    expect(tx).toMatchObject({
      to,
      value: 10n,
      gas: 21_000n,
      nonce: 7,
      type: 'eip1559',
      chainId: EvmChainId.TestnetEvm,
    })
    expect(
      await recoverTransactionAddress({ serializedTransaction: raw as any }),
    ).toBe(account.address)
  })

  it('signs legacy transactions and keeps the access list on typed ones', async () => {
    const accessList = [
      {
        address: '0x0000000000000000000000000000000000000003',
        storageKeys: [],
      },
    ] as const
    const rpc = mockRpc()
    const strategy = await createStrategy()

    await strategy.sendEvmTransaction(
      { to, input: '0xabcd', type: '0x0', gasPrice: '0x5', maxFeePerGas: null },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )
    await strategy.sendEvmTransaction(
      { to, accessList },
      { address: account.address, evmChainId: EvmChainId.TestnetEvm },
    )

    expect(parseTransaction(rpc.sent[0])).toMatchObject({
      type: 'legacy',
      data: '0xabcd',
      gasPrice: 5n,
    })
    expect(parseTransaction(rpc.sent[1])).toMatchObject({
      type: 'eip1559',
      accessList,
    })
    for (const raw of rpc.sent) {
      expect(
        await recoverTransactionAddress({ serializedTransaction: raw as any }),
      ).toBe(account.address)
    }
  })

  it('refuses a transaction from another address', async () => {
    const rpc = mockRpc()
    const provider = createProvider()
    const strategy = await createStrategy(provider)

    await expect(
      strategy.sendEvmTransaction(
        { to, from: to },
        { address: account.address, evmChainId: EvmChainId.TestnetEvm },
      ),
    ).rejects.toThrow(`Transaction is from ${to}, not ${account.address}`)
    expect(provider.request).not.toHaveBeenCalled()
    expect(rpc.sent).toEqual([])
  })

  it('passes a session error on even when viem wraps it', async () => {
    const { PrivyWalletSessionException } =
      await import('@injectivelabs/exceptions')
    mockRpc()
    const strategy = await createStrategy({
      request: vi.fn(async () => {
        throw new PrivyWalletSessionException(new Error('Signed out'))
      }),
    })

    await expect(
      strategy.sendEvmTransaction(
        { to },
        { address: account.address, evmChainId: EvmChainId.TestnetEvm },
      ),
    ).rejects.toMatchObject({ name: 'PrivyWalletSessionException' })
  })

  it("reports a rejected EVM send with the provider's message and code", async () => {
    mockRpc()
    const strategy = await createStrategy({
      request: vi.fn(async () => {
        throw Object.assign(new Error('User rejected the request'), {
          code: 4001,
        })
      }),
    })

    await expect(
      strategy.sendEvmTransaction(
        { to },
        { address: account.address, evmChainId: EvmChainId.TestnetEvm },
      ),
    ).rejects.toMatchObject({
      originalMessage: 'User rejected the request',
      contextCode: 4001,
    })
  })

  it('returns a provider for the Privy account on the evmOptions chain', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)

    const eip1193 = await strategy.getEip1193Provider()

    await expect(
      eip1193.request({ method: 'eth_accounts', params: [] }),
    ).resolves.toEqual([account.address])
    await expect(
      eip1193.request({ method: 'eth_chainId', params: [] }),
    ).resolves.toBe(toHex(EvmChainId.TestnetEvm))

    const signature = await eip1193.request({
      method: 'personal_sign',
      params: ['hello', account.address],
    })

    expect(provider.request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: [stringToHex('hello'), account.address],
    })
    expect(
      await verifyMessage({
        address: account.address,
        message: 'hello',
        signature,
      }),
    ).toBe(true)
  })

  it('signs arbitrary bytes as they are, not as UTF-8 text', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)
    const bytes = new Uint8Array([0xff, 0x00, 0x41])

    const signature = await strategy.signArbitrary(account.address, bytes)

    expect(provider.request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: ['0xff0041', account.address],
    })
    expect(
      await verifyMessage({
        address: account.address,
        message: { raw: bytes },
        signature: signature as Hex,
      }),
    ).toBe(true)
  })

  it('refuses to sign once the Privy wallet has changed', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)
    // Holds the account, as a transaction does while viem prepares it
    const eip1193 = await strategy.getEip1193Provider()

    strategy.setMetadata({
      privy: { address: to, getProvider: async () => provider },
    })

    await expect(
      eip1193.request({
        method: 'personal_sign',
        params: ['hello', account.address],
      }),
    ).rejects.toMatchObject({ name: 'PrivyWalletSessionException' })
    expect(provider.request).not.toHaveBeenCalled()
  })

  it('signs bytes that read as "0x41" as those four bytes', async () => {
    const provider = createProvider()
    const strategy = await createStrategy(provider)
    const bytes = new TextEncoder().encode('0x41')

    const signature = await strategy.signArbitrary(account.address, bytes)

    expect(provider.request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: ['0x30783431', account.address],
    })
    expect(
      await verifyMessage({
        address: account.address,
        message: '0x41',
        signature: signature as Hex,
      }),
    ).toBe(true)
  })

  it("reads a plain-object provider error's message and code", async () => {
    const provider = createProvider()
    provider.request.mockRejectedValueOnce({
      code: 4001,
      message: 'User rejected the request',
    })
    const strategy = await createStrategy(provider)

    await expect(
      strategy.signArbitrary(account.address, 'hello'),
    ).rejects.toMatchObject({
      name: 'WalletException',
      message: 'User rejected the request',
      contextCode: 4001,
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

  it('is an EVM wallet that is not limited to EIP-712 v2', async () => {
    const { Wallet, isEvmWallet, isEip712V2OnlyWallet } =
      await import('@injectivelabs/wallet-base')

    expect(isEvmWallet(Wallet.Privy)).toBe(true)
    expect(isEip712V2OnlyWallet(Wallet.Privy)).toBe(false)
  })
})
