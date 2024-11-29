# NeptuneService

`NeptuneService` is a straightforward tool that interacts with the Neptune CosmWasm smart contracts on Injective. It allows you to fetch asset prices, calculate exchange ratios, create deposit and withdraw messages, and retrieve lending rates.

## Example Code Snippets

Below are examples of how to use each method in the `NeptuneService` class.

### Initialize NeptuneService

Before using the service, create an instance of `NeptuneService`.

```ts
import { NeptuneService } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'

// Create a NeptuneService instance using the mainnet
const neptuneService = new NeptuneService(Network.MainnetSentry)
```

### Fetch Prices

- Get the prices of specific assets from the Neptune Price Oracle contract. Use native_token for bank denoms and token with contract_addr for CW20 tokens.

```ts
const assets = [
  {
    native_token: {
      denom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7', // peggy USDT bank denom
    },
  },
  {
    token: {
      contract_addr: 'inj1cy9hes20vww2yr6crvs75gxy5hpycya2hmjg9s', // nUSDT contract address
    },
  },
]

const prices = await neptuneService.fetchPrices(assets)

console.log(prices)
```

### Fetch Redemption Ratio

- Calculate the redemption ratio between nUSDT (CW20 token) and USDT (bank token).

```ts
const cw20Asset = {
  token: {
    contract_addr: 'inj1cy9hes20vww2yr6crvs75gxy5hpycya2hmjg9s', // nUSDT
  },
}

const nativeAsset = {
  native_token: {
    denom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  },
}

const redemptionRatio = await neptuneService.fetchRedemptionRatio({
  cw20Asset,
  nativeAsset,
})

console.log(`Redemption Ratio: ${redemptionRatio}`)
```

### Convert CW20 nUSDT to Bank USDT

- Calculate the amount in bank USDT from a given amount of CW20 nUSDT using the redemption ratio.

```ts
const amountCW20 = 1000 // Amount in nUSDT
const redemptionRatio = 0.95 // Obtained from fetchRedemptionRatio

const bankAmount = neptuneService.calculateBankAmount(
  amountCW20,
  redemptionRatio,
)

console.log(`Bank USDT Amount: ${bankAmount}`)
```

### Convert Bank USDT to CW20 nUSDT

- Calculate the amount in CW20 nUSDT from a given amount of bank USDT using the redemption ratio.

```ts
const amountBank = 950 // Amount in USDT
const redemptionRatio = 0.95 // Obtained from fetchRedemptionRatio

const cw20Amount = neptuneService.calculateCw20Amount(
  amountBank,
  redemptionRatio,
)

console.log(`CW20 nUSDT Amount: ${cw20Amount}`)
```

### Fetch Lending Rates

- Retrieve lending rates for the different lending markets in neptune's lending market smart contract

```ts
const lendingRates = await neptuneService.getLendingRates({
  limit: 10, // Optional: number of rates to fetch
})

console.log(lendingRates)
```

### Fetch Lending Rate by Denomination

- Get the lending rate for USDT for example

```ts
const denom = 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT denom

const lendingRate = await neptuneService.getLendingRateByDenom({ denom })

if (lendingRate) {
  console.log(`Lending Rate for USDT: ${lendingRate}`)
} else {
  console.log('Lending Rate for USDT not found')
}
```

### Calculate Annual Percentage Yield (APY)

- Convert the annual percentage rate (APR) to the continuously compounded annual percentage yield (APY). Make sure to use the lending rate retried from neptuneService.getLendingRateByDenom to use as the apr.

```ts
const apr = 0.1 // 10% APR

const apy = neptuneService.calculateAPY(apr)

console.log(`APY (continuously compounded): ${(apy * 100).toFixed(2)}%`)
```

### Create and Broadcast a Deposit Message

- Create a message to deposit USDT into the Neptune USDT lending market and broadcast it to the network.

```ts
import {
  MsgBroadcasterWithPk,
  MsgExecuteContractCompat,
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const denom = 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT denom

const amountInUsdt = '100'

// Convert the amount to the smallest unit (USDT has 6 decimals)
const amount = new BigNumberInBase(amountInUsdt).toWei(6).toFixed()

const depositMsg = neptuneService.createDepositMsg({
  denom,
  amount,
  sender: injectiveAddress,
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.MainnetSentry,
}).broadcast({
  msgs: depositMsg,
})

console.log(txHash)
```

### Create and Broadcast a Withdraw Message

- Create a message to withdraw USDT from the Neptune USDT lending market and broadcast it to the network

```ts
import {
  Network,
  MsgBroadcasterWithPk,
  MsgExecuteContractCompat,
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

const privateKey = '0x...' // Your private key
const injectiveAddress = 'inj1...' // Your Injective address

// Define the amount to withdraw (e.g., 100 nUSDT)
const amountInNusdt = '100'

// Convert the amount to the smallest unit (nUSDT has 6 decimals)
const amount = new BigNumberInBase(amountInNusdt).toWei(6).toFixed()

const withdrawMsg = neptuneService.createWithdrawMsg({
  amount,
  sender: injectiveAddress,
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.MainnetSentry,
}).broadcast({
  msgs: withdrawMsg,
})

console.log(`Transaction Hash: ${txHash}`)
```
