# Wallet Strategy

The main purpose of the `@injectivelabs/wallet-ts` is to offer developers a way to have different wallet implementations on Injective. All of these wallets implementations are exposing the same `ConcreteStrategy` interface which means that users can just use these methods without the need to know the underlying implementation for specific wallets as they are abstracted away.

To start, you have to make an instance of the `WalletStrategy` class which gives you the ability to use different wallets out of the box. You can switch the current wallet that is used by using the `setWallet` method on the `walletStrategy` instance.

Lets have a look at the methods that `WalletStrategy` strategy exposes and what do they mean:

**Both Ethereum and Cosmos native wallets:**

* `getAddresses` gets the addresses from the connected wallet strategy. This method returns the Ethereum addresses for Ethereum native wallets (strategies) and Injective addresses for Cosmos native wallets (strategies).
* `signTransaction` signs a transaction using the corresponding wallet type method (`signCosmosTransaction` for Cosmos native wallets, `signEip712TypedData` for Ethereum native wallets)
* `sendTransaction` signs a transaction using the corresponding wallet type method (needs a `sentryEndpoint` passed to the options if we wanna use it on Ethereum native wallets - explanation can be found below)
* `getWalletDeviceType` returns the wallet connection type (mobile, browser, hardware),

**Cosmos native wallets:**

* `signCosmosTransaction` signs an Injective transaction using the connected wallet strategy,
* `getPublicKey` get the public key for the Cosmos native wallet strategies,

**Ethereum native wallets:**

* `getEthereumChainId` get the chain id for the Ethereum native wallet strategies,
* `signEip712TypedData` signs an EIP712 typed data using the connected wallet strategy,
* `sendEthereumTransaction` sends an Ethereum Web3 transaction using the connected wallet strategy,
* `signEthereumTransaction` signs an Ethereum Web3 transaction using the connected wallet strategy,
* `getEthereumTransactionReceipt` get the transaction receipt for Ethereum native transactions for the wallet strategy,

#### Arguments

The arguments passed to the WalletStrategy have the following interface:

```ts
export interface WalletStrategyEthereumOptions {
  rpcUrl: string // rpc url needed **ONLY** the Ethereum native methods on the strategies
  ethereumChainId: EthereumChainId // needed if you are signing EIP712 typed data using the Wallet Strategies
}

export interface EthereumWalletStrategyArgs {
  chainId: ChainId // the Injective chain id 
  ethereumOptions?: WalletStrategyEthereumOptions // optional, needed only if you are using Ethereum native wallets
  disabledWallets?: Wallet[] // optional, needed if you wanna disable some wallets for being instantiated
  wallet?: Wallet // optional, the initial wallet selected (defaults to Metamask if `ethereumOptions` are passed and Keplr if they are not)
}
```

_Note:_ When we wanna use the `sendTransaction` on Ethereum native wallets alongside the other options (chainId and address) we also need to pass a gRPC endpoint to a sentry to broadcast the transaction. This is needed because from Ethereum native wallets we don't have access to a `broadcastTx` method like we have on Keplr or Leap to broadcast the transaction using the wallet's abstraction so we have to broadcast it on the client side directly to the chain.

#### Example usage

```ts
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import { CHAIN_ID, ETHEREUM_CHAIN_ID, IS_TESTNET } from '~/app/utils/constants'

export const alchemyRpcEndpoint = `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  ethereumOptions: {
    ethereumChainId: EthereumChainId.Mainnet,
    rpcUrl: alchemyRpcEndpoint
  }
})

// Get wallet's addresses
export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses()

  if (addresses.length === 0) {
    throw new Web3Exception('There are no addresses linked in this wallet.')
  }

  return addresses
}

// Sign an Injective transaction
export const signTransaction = async (tx: TxRaw): Promise<string[]> => {
  const response = await walletStrategy.signCosmosTransaction(
    transaction: { txRaw: tx; accountNumber: /* */; chainId: 'injective-1' },
    address: 'inj1...',
  )

  return response
}

// Send an Injective transaction
export const signTransaction = async (tx: TxRaw): Promise<string[]> => {
  const response = await walletStrategy.sendTransaction(
    txRaw,
    // `sentryEndpoint` needed if Ethereum wallets are used
    {address: 'inj1...', chainId: 'injective-1', sentryEndpoint: 'https://grpc.injective.network' }
  )

  return response
}
```
