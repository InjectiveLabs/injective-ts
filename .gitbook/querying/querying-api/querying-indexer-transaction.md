# Web3Gw Transactions

Example code snippets to query the indexer for transaction module related data. Used only when interacting with the [Web3Gateway](../../transactions/web3-gateway.md)

### Using gRPC

#### Fetch response for preparing a transaction

```ts
import { Msgs, IndexerGrpcTransactionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { EthereumChainId } from '@injectivelabs/ts-types'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)

const address = '0x...' // ethereum address
const chainId = EthereumChainId.Goerli
const message = { ... } as Msgs
const memo = '...'

const prepareTxResponse = await indexerGrpcTransactionApi.prepareTxRequest({
  address,
  chainId,
  message,
  memo
})

console.log(prepareTxResponse)
```

#### Fetch response for preparing a cosmos transaction

```ts
import { IndexerGrpcTransactionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)

const address = 'inj...'
const message = { ... }

const prepareCosmosTxResponse = await indexerGrpcTransactionApi.prepareCosmosTxRequest({
  address,
  message
})

console.log(prepareCosmosTxResponse)
```

#### Fetch response for broadcasting transactions using the Web3Gateway&#x20;

Use `MsgBroadcasterWithPk` to broadcast transactions within a node/CLI environment, which can be found in `@injectivelabs/sdk-ts`.&#x20;

Use `@injectivelabs/wallet-core`'s `MsgBroadcaster` class for more details on broadcasting a transactions in a browser environment.

```ts
import { Msgs, IndexerGrpcTransactionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { WalletStrategy, CosmosWalletStrategy } from '@injectivelabs/wallet-strategy'
import { Wallet } from '@injectivelabs/wallet-base'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)

const chainId = ChainId.Testnet // The Injective Chain chainId
const ethereumChainId = EthereumChainId.Goerli // The Ethereum Chain ID

export const alchemyRpcEndpoint = `https://eth-goerli.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`

const rpcUrl = `https://eth-goerli.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`

const wsRpcUrl = `wss://eth-goerli.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`

const alchemyKey =  process.env.APP_ALCHEMY_GOERLI_KEY as string

const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    rpcUrl,
    wsRpcUrl,
    ethereumChainId: ETHEREUM_CHAIN_ID,
    disabledWallets: [Wallet.WalletConnect]
  }
})

const address = '0x...' // ethereum address
const message = { ... } as Msgs
const memo = '...'
const response = { ... } // response from  prepareTxRequest
const signature = await walletStrategy.signEip712TypedData(
      response.getData(),
      address,
    ) /* see injective-ts/wallet-ts implementation of WalletStrategy. Essentially, you use the signEip712TypedData method of the wallet, if the wallet supports signing ethereum transactions */

const broadcastTxResponse = await indexerGrpcTransactionApi.broadcastTxRequest({
  signature,
  chainId,
  message,
  txResponse: response
})

console.log(broadcastTxResponse)
```

#### Fetch response for broadcasting a cosmos transactions.&#x20;

```ts
import { IndexerGrpcTransactionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { TxRaw } from '@injectivelabs/chain-api'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(endpoints.indexer)

const address = 'inj...' // ethereum address
const signature = '...' // base64
const txRaw = { ... } as TxRaw
const pubKey = {
  type: string,
  value: string // base64
}

const broadcastCosmosTxResponse = await indexerGrpcTransactionApi.broadcastCosmosTxRequest({
  address,
  signature,
  txRaw,
  pubKey
})

console.log(broadcastCosmosTxResponse)
```

#### Fetch Web3Gateway Fee Payer

```ts
import { IndexerGrpcTransactionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(
  endpoints.indexer,
)

const feePayer = await indexerGrpcTransactionApi.fetchFeePayer()

console.log(feePayer)
```
