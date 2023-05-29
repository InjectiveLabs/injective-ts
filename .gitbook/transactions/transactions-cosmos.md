# Cosmos

Every transaction on Injective follows the same flow. The flow consists of three steps: preparing, signing and broadcasting the transaction. Let's dive into each step separately and explain the process in-depth (including examples) so we can understand the whole transaction flow.

### Preparing a transaction

First of, we need to prepare the transaction for signing.

At this point you **can't** use some online abstractions that provide a quick way to prepare the transaction for you based on the provided Message and the signer (ex. using the `@cosmjs/stargate` package). The reason why is that these packages don't support Injective's publicKey typeUrl, so we have to do the preparation of the address on the client side.

To resolve this, we have provided functions which can prepare the `txRaw` transaction within out `@injectivelabs/sdk-ts` package. `txRaw` is the transaction interface used in Cosmos that contains details about the transaction and the signer itself.

```ts
import { 
  MsgSend,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  createTransaction,
} from '@injectivelabs/sdk-ts'
import { DEFAULT_STD_FEE, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const injectiveAddress = 'inj1'
const chainId = 'injective-1' /* ChainId.Mainnet */
const restEndpoint = 'https://lcd.injective.network' /* getNetworkEndpoints(Network.Mainnet).rest */
const amount = {
  amount: new BigNumberInBase(0.01).toWei().toFixed(),
  denom: "inj",
};

/** Account Details **/
const chainRestAuthApi = new ChainRestAuthApi(
  restEndpoint,
)
const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
  injectiveAddress,
)
const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
const accountDetails = baseAccount.toAccountDetails()

/** Block Details */
const chainRestTendermintApi = new ChainRestTendermintApi(
  restEndpoint,
)
const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
const latestHeight = latestBlock.header.height
const timeoutHeight = new BigNumberInBase(latestHeight).plus(
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
)

/** Preparing the transaction */
const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

/** Get the PubKey of the Signer from the Wallet/Private Key */
const pubKey = await getPubKey()

/** Prepare the Transaction **/
const { txRaw, signDoc } = createTransaction({
  pubKey,
  chainId,
  fee: DEFAULT_STD_FEE,
  message: msgs,
  sequence: baseAccount.sequence,
  timeoutHeight: timeoutHeight.toNumber(),
  accountNumber: baseAccount.accountNumber,
})
```

### Signing a transaction

Once we have prepared the transaction, we proceed to signing. Once you get the `txRaw` transaction from the previous step use any Cosmos native wallet to sign (ex: Keplr),

```ts
import { ChainId } from '@injectivelabs/ts-types'

const getKeplr = async (chainId) => {
  await window.keplr.enable(chainId);
    
  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key }
}

const { offlineSigner, accounts, key } = await getKeplr(ChainId.Mainnet)

/* Sign the Transaction */
const address = 'inj1'
const signDoc = /* From the previous step */
const directSignResponse = await offlineSigner.signDirect(address, signDoc)
```

You can also use our `@injectivelabs/wallet-ts` package to get out-of-the-box wallet provides that will give you abstracted methods which you can use to sign transaction. Refer to the documentation of the package, its really simple to setup and use. **This is the recommended way as you have access to more than one wallet to use in your dApp. The `WalletStrategy` provides more than just signing transaction abstractions.**

### Broadcasting a transaction

Once we have the signature ready, we need to broadcast the transaction to the Injective chain itself. After getting the signature from the second step, we need to include that signature in the signed transaction and broadcast it to the chain.

```ts
import { ChainId } from '@injectivelabs/ts-types'
import { getTxRawFromTxRawOrDirectSignResponse, TxRestClient } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

/** 
 * IMPORTANT NOTE: 
 * If we use Keplr/Leap wallets 
 * after signing the transaction we get a `directSignResponse`, 
 * and instead of adding the signature to the `txRaw` we create
 * using the `createTransaction` function we need to append the 
 * signature from the `directSignResponse` to the transaction that 
 * got actually signed (i.e `directSignResponse.signed`) and 
 * the reason why is that the user can make some changes on the original
 * transaction (i.e change gas limit or gas prices) and the transaction 
 * that get's signed and the one that gets broadcasted are not the same.
 */
const directSignResponse = /* From the second step above */ 
const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse)

const broadcastTx = async (chainId, txRaw) => {
  const getKeplr = async (chainId) => {
    await window.keplr.enable(chainId);

    return window.keplr
  }

  const keplr = await getKeplr(ChainId.Mainnet)
  const result = await keplr.sendTx(
    chainId,
    txRaw.serializeBinary(),
    BroadcastMode.Sync,
  )

  if (!result || result.length === 0) {
    throw new TransactionException(
      new Error('Transaction failed to be broadcasted'),
      { contextModule: 'Keplr' },
    )
  }

  return Buffer.from(result).toString('hex')
}

const txHash = await broadcastTx(ChainId.Mainnet, txRaw)

/** 
 * Once we get the txHash, because we use the Sync mode we 
 * are not sure that the transaction is included in the block, 
 * it can happen that it's still in the mempool so we need to query 
 * the chain to see when the transaction will be included
 */
const restEndpoint = 'https://lcd.injective.network' /* getNetworkEndpoints(Network.Mainnet).rest */
const txRestClient = new TxRestClient(restEndpoint)

 /** This will poll querying the transaction and await for it's inclusion in the block */
const response = await txRestClient.fetchTxPoll(txHash)
```

### Example (Prepare + Sign + Broadcast)

Let's have a look at the whole flow (using Keplr as a signing wallet)

```ts
import { 
  MsgSend,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  createTransaction,
} from '@injectivelabs/sdk-ts'
import { DEFAULT_STD_FEE, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const getKeplr = async (chainId) => {
  await window.keplr.enable(chainId);
    
  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key }
}

const broadcastTx = async (chainId, txRaw) => {
  const keplr = await getKeplr(ChainId.Mainnet)
  const result = await keplr.sendTx(
    chainId,
    txRaw.serializeBinary(),
    BroadcastMode.Sync,
  )

  if (!result || result.length === 0) {
    throw new TransactionException(
      new Error('Transaction failed to be broadcasted'),
      { contextModule: 'Keplr' },
    )
  }

  return Buffer.from(result).toString('hex')
}

const injectiveAddress = 'inj1'
const chainId = 'injective-1' /* ChainId.Mainnet */
const restEndpoint = 'https://lcd.injective.network' /* getNetworkEndpoints(Network.Mainnet).rest */
const amount = {
  amount: new BigNumberInBase(0.01).toWei().toFixed(),
  denom: "inj",
};

/** Account Details **/
const chainRestAuthApi = new ChainRestAuthApi(
  restEndpoint,
)
const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
  injectiveAddress,
)
const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
const accountDetails = baseAccount.toAccountDetails()

/** Block Details */
const chainRestTendermintApi = new ChainRestTendermintApi(
  restEndpoint,
)
const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
const latestHeight = latestBlock.header.height
const timeoutHeight = new BigNumberInBase(latestHeight).plus(
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
)

/** Preparing the transaction */
const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

/** Get the PubKey of the Signer from the Wallet/Private Key */
const pubKey = await getPubKey()

/** Prepare the Transaction **/
const { txRaw, signDoc } = createTransaction({
  pubKey,
  chainId,
  fee: DEFAULT_STD_FEE,
  message: msgs,
  sequence: baseAccount.sequence,
  timeoutHeight: timeoutHeight.toNumber(),
  accountNumber: baseAccount.accountNumber,
})

const directSignResponse = await offlineSigner.signDirect(injectiveAddress, signDoc)
const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse)
const txHash = await broadcastTx(ChainId.Mainnet, txRaw)
const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash)
```

### Example with WalletStrategy (Prepare + Sign + Broadcast)

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

This part is currently under work in progress.

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧
