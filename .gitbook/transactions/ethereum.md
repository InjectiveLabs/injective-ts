# Ethereum

Every transaction on Injective follows the same flow. The flow consists of three steps: preparing, signing and broadcasting the transaction. Let's dive into each step separately and explain the process in-depth (including examples) so we can understand the whole transaction flow.

### Preparing a transaction

First of, we need to prepare the transaction for signing. To use Ethereum native wallets, we have to convert the transaction to EIP712 typed data and use the wallet to sign this typed data.

Using our custom abstraction for the Messages which allows the developer to get EIP712 TypedData straight from the proto file of the particular message.

```ts
import { 
  MsgSend,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  getEip712TypedData,
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

/** EIP712 for signing on Ethereum wallets */
const eip712TypedData = getEip712TypedData({
  msgs: [msg],
  tx: {
    accountNumber: accountDetails.accountNumber.toString(),
    sequence: accountDetails.sequence.toString(),
    timeoutHeight: timeoutHeight.toFixed(),
    chainId: chainId,
  },
  ethereumChainId: ethereumChainId,
})
```

### Signing a transaction

Once we have prepared the EIP712 typed data, we proceed to signing.

```ts
/** Use your preferred approach to sign EIP712 TypedData, example with Metamask */
const signature = await window.ethereum.request({
  method: 'eth_signTypedData_v4',
  params: [ethereumAddress, JSON.stringify(eip712TypedData /* from previous step */)],
})

/** Get Public Key of the signer */
const publicKeyHex = recoverTypedSignaturePubKey(
  eip712TypedData,
  signature,
)
const publicKeyBase64 = hexToBase64(publicKeyHex)
```

You can also use our `@injectivelabs/wallet-ts` package to get out-of-the-box wallet provides that will give you abstracted methods which you can use to sign transaction. Refer to the documentation of the package, its really simple to setup and use. **This is the recommended way as you have access to more than one wallet to use in your dApp. The `WalletStrategy` provides more than just signing transaction abstractions.**

### Broadcasting a transaction

Once we have the signature ready, we need to broadcast the transaction to the Injective chain itself. After getting the signature from the second step, we need to include that signature in the signed transaction and broadcast it to the chain.

```ts
import { ChainId } from '@injectivelabs/ts-types'
import { createTransaction, TxRestClient } from '@injectivelabs/sdk-ts'
import { SIGN_AMINO, Network, getNetworkEndpoints } from '@injectivelabs/networks'

const { txRaw } = createTransaction({
  message: msgs,
  memo: memo,
  signMode: SIGN_AMINO,
  fee: DEFAULT_STD_FEE,
  pubKey: publicKeyBase64 /* From previous step */,
  sequence: baseAccount.sequence,
  timeoutHeight: timeoutHeight.toNumber(),
  accountNumber: baseAccount.accountNumber,
  chainId: chainId,
})
const web3Extension = createWeb3Extension({
  ethereumChainId,
})
const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

/** Append Signatures */
txRawEip712.signatures = [signatureBuff /* From previous step */]

/** Broadcast the Transaction */
const restEndpoint = 'https://lcd.injective.network' /* getNetworkEndpoints(Network.Mainnet).rest */
const txRestClient = new TxRestClient(restEndpoint)

const txHash = await txRestClient.broadcast(txRawEip712)

/** 
 * Once we get the txHash, because we use the Sync mode we 
 * are not sure that the transaction is included in the block, 
 * it can happen that it's still in the mempool so we need to query 
 * the chain to see when the transaction will be included
 */

 /** This will poll querying the transaction and await for it's inclusion in the block */
const response = await txRestClient.fetchTxPoll(txHash)
```

### Example without WalletStrategy (Prepare + Sign + Broadcast)

Let's have a look at the whole flow (using Metamask as a signing wallet)

```ts
import { 
  MsgSend,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  getEip712TypedData,
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

/** EIP712 for signing on Ethereum wallets */
const eip712TypedData = getEip712TypedData({
  msgs: [msg],
  tx: {
    accountNumber: accountDetails.accountNumber.toString(),
    sequence: accountDetails.sequence.toString(),
    timeoutHeight: timeoutHeight.toFixed(),
    chainId: chainId,
  },
  ethereumChainId: ethereumChainId,
})

/** Use your preferred approach to sign EIP712 TypedData, example with Metamask */
const signature = await window.ethereum.request({
  method: 'eth_signTypedData_v4',
  params: [ethereumAddress, JSON.stringify(eip712TypedData)],
})

/** Get Public Key of the signer */
const publicKeyHex = recoverTypedSignaturePubKey(
  eip712TypedData,
  signature,
)
const publicKeyBase64 = hexToBase64(publicKeyHex)

const { txRaw } = createTransaction({
  message: msgs,
  memo: memo,
  signMode: SIGN_AMINO,
  fee: DEFAULT_STD_FEE,
  pubKey: publicKeyBase64,
  sequence: baseAccount.sequence,
  timeoutHeight: timeoutHeight.toNumber(),
  accountNumber: baseAccount.accountNumber,
  chainId: chainId,
})
const web3Extension = createWeb3Extension({
  ethereumChainId,
})
const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

/** Append Signatures */
txRawEip712.signatures = [signatureBuff]

/** Broadcast the Transaction */
const txRestClient = new TxRestClient(restEndpoint)

const txHash = await txRestClient.broadcast(txRawEip712)
const response = await txRestClient.fetchTxPoll(txHash)
```

### Example with WalletStrategy (Prepare + Sign + Broadcast)

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

This part is currently under work in progress.

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧
