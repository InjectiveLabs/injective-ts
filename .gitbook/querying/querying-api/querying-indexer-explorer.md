# Querying Indexer: Explorer

Example code snippets to query the indexer for explorer module related data.

#### Using gRPC

* Get a tx by hash

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const txsHash = '...'

const transaction = await indexerGrpcExplorerApi.fetchTxByHash(txsHash)

console.log(transaction)
```

* Get an account tx by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const injectiveAddress = 'inj...'

const account = await indexerGrpcExplorerApi.fetchAccountTx({ injectiveAddress })

console.log(account)
```

* Get a validator by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validator = await indexerGrpcExplorerApi.fetchValidator(validatorAddress)

console.log(validator)
```

* Get a validator's uptime by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validatorUptime = await indexerGrpcExplorerApi.fetchValidatorUptime(validatorAddress)

console.log(validatorUptime)
```

* Get a validator's uptime by address

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const validatorAddress = 'injvaloper...'

const validatorUptime = await indexerGrpcExplorerApi.fetchValidatorUptime(validatorAddress)

console.log(validatorUptime)
```

* Get peggy deposit transactions from ethereum

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const sender = '0x...' /* optional parameter */
const receiver = 'inj...' /* optional parameter */
const limit = 100 /* optional pagination parameter */
const skip = 20 /* optional pagination parameter */

const peggyDeposits = await indexerGrpcExplorerApi.fetchPeggyDepositTxs({
  sender,
  receiver,
  limit,
  skip
})

console.log(peggyDeposits)
```

* Get peggy withdrawal transactions to ethereum

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const receiver = '0x...' /* optional parameter */
const sender = 'inj...' /* optional parameter */
const limit = 100 /* optional pagination parameter */
const skip = 20 /* optional pagination parameter */

const peggyWithdrawals = await indexerGrpcExplorerApi.fetchPeggyWithdrawalTxs({
  sender,
  receiver,
  limit,
  skip
})

console.log(peggyWithdrawals)
```

* Get blocks

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const after = 30 /* optional pagination parameter */
const limit = 100 /* optional pagination parameter */

const blocks = await indexerGrpcExplorerApi.fetchBlocks({
  after,
  limit
})

console.log(blocks)
```

* Get block by id

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const id = 123

const block = await indexerGrpcExplorerApi.fetchBlock(id)

console.log(block)
```

* Get transactions

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const after = 20 /* optional pagination parameter */
const limit = 100 /* optional pagination parameter */

const transactions = await indexerGrpcExplorerApi.fetchTxs({
  after,
  limit
})

console.log(transactions)
```

* Get ibc transfer transactions

```ts
import { IndexerGrpcExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.explorer)

const sender = 'osmo...'
const receiver = 'inj...'

const ibcTransactions = await indexerGrpcExplorerApi.fetchIBCTransferTxs({
  sender,
  receiver
})

console.log(ibcTransactions)
```

#### Using HTTP REST

* get a block and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const blockHashHeight = 1

const block = await indexerRestExplorerApi.fetchBlock(blockHashHeight)

console.log(block)
```

* get blocks and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const before = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */

const blocks = await indexerRestExplorerApi.fetchBlocks({
  before,
  limit
})

console.log(blocks)
```

* get blocks with tx details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const before = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */

const blocks = await indexerRestExplorerApi.fetchBlocksWithTx({
  before,
  limit
})

console.log(blocks)
```

* get transactions

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const after = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */
const fromNumber = 1 /* optional param */
const toNumber = 100 /* optional param */

const transactions = await indexerRestExplorerApi.fetchTransactions({
  after,
  limit,
  fromNumber,
  toNumber
})

console.log(transactions)
```

* get transactions for an account

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const account = 'inj...'
const after = 200 /* optional pagination param */
const limit = 100 /* optional pagination param */
const fromNumber = 1 /* optional param */
const toNumber = 100 /* optional param */

const accountTransactions = await indexerRestExplorerApi.fetchAccountTransactions({
  account,
  params: {
    account,
    after,
    limit,
    fromNumber,
    toNumber
  }
})

console.log(accountTransactions)
```

* get a tsx by hash

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const txsHash = '...'

const transaction = await indexerRestExplorerApi.fetchTransaction(txsHash)

console.log(transaction)
```

* get validators

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const validators = await indexerRestExplorerApi.fetchValidators()

console.log(validators)
```

* get validator uptime

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const validatorAddress = 'injvalcons'

const validatorUptime = await indexerRestExplorerApi.fetchValidatorUptime(validatorAddress)

console.log(validatorUptime)
```

* get a contract by contract address

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const contractAddress = 'inj...'

const contract = await indexerRestExplorerApi.fetchContract(contractAddress)

console.log(contract)
```

* get contracts

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const limit = 100 /* optional pagination param */
const skip = 50 /* optional pagination param */

const contracts = await indexerRestExplorerApi.fetchContracts({
  limit,
  skip
})

console.log(contracts)
```

* get contract transactions

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const contractAddress = 'inj...'
const limit = 100 /* optional pagination param */
const skip = 50 /* optional pagination param */

const transactions = await indexerRestExplorerApi.fetchContractTransactions({
  contractAddress,
  params: {
    limit,
    skip
  }
})

console.log(transactions)
```

* get cosmwasm code details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const codeId = 1

const codeDetails = await indexerRestExplorerApi.fetchWasmCode(codeId)

console.log(codeDetails)
```

* get wasm codes and details

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const limit = 100 /* optional pagination param */
const fromNumber = 50 /* optional pagination param */
const toNumber = 150 /* optional pagination param */

const codes = await indexerRestExplorerApi.fetchWasmCodes({
    limit,
    fromNumber,
    toNumber
})

console.log(codes)
```

* get cw20 balances

```ts
import { IndexerRestExplorerApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`)

const address = 'inj...'

const cw20Balances = await indexerRestExplorerApi.fetchCW20BalancesNoThrow(address)

console.log(cw20Balances)
```
