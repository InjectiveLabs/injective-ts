import { vi } from 'vitest'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'

describe('TurnkeyWalletStrategy', () => {
  it('routes signArbitrary through personal_sign', async () => {
    vi.doMock('@injectivelabs/sdk-ts/core/tx', () => ({
      TxGrpcApi: vi.fn(),
    }))

    vi.doMock('../../../../../sdk-ts/src/core/tx/index.ts', () => ({
      TxGrpcApi: vi.fn(),
    }))

    vi.doMock('@injectivelabs/wallet-base', () => ({
      WalletAction: {
        SignArbitrary: 'sign-arbitrary',
      },
      WalletDeviceType: {
        Browser: 'browser',
      },
      BaseConcreteStrategy: class {
        protected chainId: ChainId
        public metadata?: unknown

        constructor(args: { chainId: ChainId; metadata?: unknown }) {
          this.chainId = args.chainId
          this.metadata = args.metadata
        }
      },
      getEvmChainConfig: vi.fn(),
      getViemPublicClient: vi.fn(),
      getViemWalletClient: vi.fn(),
    }))

    const { TurnkeyWalletStrategy } = await import('./strategy.js')
    const address = '0x0000000000000000000000000000000000000001'
    const signMessage = vi.fn().mockResolvedValue('0xsigned')
    const getOrCreateAndGetAccount = vi.fn().mockResolvedValue({
      address,
      sign: vi.fn(),
      signTypedData: vi.fn(),
      signMessage,
      signTransaction: vi.fn(),
    })

    const strategy = new TurnkeyWalletStrategy({
      chainId: ChainId.Devnet,
      evmOptions: {
        evmChainId: EvmChainId.Sepolia,
        rpcUrl: 'http://127.0.0.1:1',
      },
      apiServerEndpoint: 'http://127.0.0.1:1',
    })

    strategy.turnkeyWallet = {
      getOrCreateAndGetAccount,
    } as any

    await expect(strategy.signArbitrary(address, 'hello')).resolves.toBe(
      '0xsigned',
    )
    expect(getOrCreateAndGetAccount).toHaveBeenCalledWith(address)
    expect(signMessage).toHaveBeenCalledWith({ message: 'hello' })
  })
})
