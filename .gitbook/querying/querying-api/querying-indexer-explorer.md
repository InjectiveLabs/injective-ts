# Explorer

Example code snippets to query the indexer for explorer module related data.

### Using gRPC

#### Fetch transaction by hash

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const txsHash = '...'

const transaction = await indexerGrpcExplorerApi.fetchTxByHash(txsHash)

console.log(transaction)
```

#### Fetch an account transaction by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const injectiveAddress = 'inj...'

const account = await indexerGrpcExplorerApi.fetchAccountTx({
  injectiveAddress,
})

console.log(account)
```

#### Fetch a validator by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validator = await indexerGrpcExplorerApi.fetchValidator(validatorAddress)

console.log(validator)
```

#### Fetch a validator's uptime by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validatorUptime = await indexerGrpcExplorerApi.fetchValidatorUptime(
  validatorAddress,
)

console.log(validatorUptime)
```

#### Fetch a validator's uptime by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validatorUptime = await indexerGrpcExplorerApi.fetchValidatorUptime(
  validatorAddress,
)

console.log(validatorUptime)
```

#### Fetch Peggy deposit transactions from Ethereum

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const sender = '0x...' /* optional parameter */
const receiver = 'inj...' /* optional parameter */
const limit = 100 /* optional pagination parameter */
const skip = 20 /* optional pagination parameter */

const peggyDeposits = await indexerGrpcExplorerApi.fetchPeggyDepositTxs({
  sender,
  receiver,
  limit,
  skip,
})

console.log(peggyDeposits)
```

#### Fetch Peggy withdrawal transactions to Ethereum

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const receiver = '0x...' /* optional parameter */
const sender = 'inj...' /* optional parameter */
const limit = 100 /* optional pagination parameter */
const skip = 20 /* optional pagination parameter */

const peggyWithdrawals = await indexerGrpcExplorerApi.fetchPeggyWithdrawalTxs({
  sender,
  receiver,
  limit,
  skip,
})

console.log(peggyWithdrawals)
```

#### Fetch blocks

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const after = 30 /* optional pagination parameter */
const limit = 100 /* optional pagination parameter */

const blocks = await indexerGrpcExplorerApi.fetchBlocks({
  after,
  limit,
})

console.log(blocks)
```

#### Fetch block by height

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const height = 123456
const block = await indexerGrpcExplorerApi.fetchBlock(height)

console.log(block)
```

#### Fetch transactions

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const after = 20 /* optional pagination parameter */
const limit = 100 /* optional pagination parameter */

const transactions = await indexerGrpcExplorerApi.fetchTxs({
  after,
  limit,
})

console.log(transactions)
```

#### Fetch IBC transfer transactions

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const sender = 'osmo...'
const receiver = 'inj...'

const ibcTransactions = await indexerGrpcExplorerApi.fetchIBCTransferTxs({
  sender,
  receiver,
})

console.log(ibcTransactions)
```

### Using HTTP REST

#### Fetch a block and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const blockHashHeight = 1

const block = await indexerRestExplorerApi.fetchBlock(blockHashHeight)

console.log(block)
```

#### Fetch blocks and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const before = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */

const blocks = await indexerRestExplorerApi.fetchBlocks({
  before,
  limit,
})

console.log(blocks)
```

#### Fetch blocks with transaction details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const before = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */

const blocks = await indexerRestExplorerApi.fetchBlocksWithTx({
  before,
  limit,
})

console.log(blocks)
```

#### Fetch transactions

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const after = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */
const fromNumber = 1 /* optional param */
const toNumber = 100 /* optional param */

const transactions = await indexerRestExplorerApi.fetchTransactions({
  after,
  limit,
  fromNumber,
  toNumber,
})

console.log(transactions)
```

#### Fetch transactions for an address

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const account = 'inj...'
const after = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */
const fromNumber = 1 /* optional param */
const toNumber = 100 /* optional param */

const accountTransactions =
  await indexerRestExplorerApi.fetchAccountTransactions({
    account,
    params: {
      account,
      after,
      limit,
      fromNumber,
      toNumber,
    },
  })

console.log(accountTransactions)
```

#### Fetch transaction using transaction hash

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const txsHash = '...'

const transaction = await indexerRestExplorerApi.fetchTransaction(txsHash)

console.log(transaction)
```

#### Fetch validators

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const validators = await indexerRestExplorerApi.fetchValidators()

console.log(validators)
```

#### Fetch validator uptime

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const validatorAddress = 'injvalcons'

const validatorUptime = await indexerRestExplorerApi.fetchValidatorUptime(
  validatorAddress,
)

console.log(validatorUptime)
```

#### Fetch a contract by contract address

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const contractAddress = 'inj...'

const contract = await indexerRestExplorerApi.fetchContract(contractAddress)

console.log(contract)
```

#### Fetch contracts

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const limit = 100 /* optional pagination param */
const skip = 50 /* optional pagination param */

const contracts = await indexerRestExplorerApi.fetchContracts({
  limit,
  skip,
})

console.log(contracts)
```

#### Fetch contract transactions

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const contractAddress = 'inj...'
const limit = 100 /* optional pagination param */
const skip = 50 /* optional pagination param */

const transactions = await indexerRestExplorerApi.fetchContractTransactions({
  contractAddress,
  params: {
    limit,
    skip,
  },
})

console.log(transactions)
```

#### Fetch cosmwasm code details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const codeId = 1

const codeDetails = await indexerRestExplorerApi.fetchWasmCode(codeId)

console.log(codeDetails)
```

#### Fetch wasm codes and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const limit = 100 /* optional pagination param */
const fromNumber = 50 /* optional pagination param */
const toNumber = 150 /* optional pagination param */

const codes = await indexerRestExplorerApi.fetchWasmCodes({
  limit,
  fromNumber,
  toNumber,
})

console.log(codes)
```

#### Fetch cw20 balances

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestExplorerApi = new IndexerRestExplorerApi(
  `${endpoints.explorer}/api/explorer/v1`,
)

const address = 'inj...'

const cw20Balances = await indexerRestExplorerApi.fetchCW20BalancesNoThrow(
  address,
)

console.log(cw20Balances)
```
