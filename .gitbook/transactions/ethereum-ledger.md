# Ethereum Ledger

## Signing Transactions on Injective using Ledger

The goal of this document is to explain how to use Ledger to sign transactions on Injective and broadcast them to the chain. The implementation differs from the default approach that Cosmos SDK native chains have because Injective defines its custom Account type that uses Ethereum's ECDSA secp256k1 curve for keys.

## Implementation

To understand how we should do the implementation, let’s go through some concepts so it's easier to understand the approach we are going to take.

### Background

A derivation path is a piece of data that tells a Hierarchical Deterministic (HD) wallet how to derive a specific key within a tree of keys. Derivation paths are used as a standard and were introduced with HD wallets as a part of BIP32. A Hierarchical Deterministic Wallet is a term used to describe a wallet that uses a seed to derive many public and private keys.

This is what a derivation path looks like

`m/purpose'/coin_type'/account'/change/address_index`

Each of the parts in the sequence plays a part and each changes what the private key, public key, and address would be. We are not going to deep dive into the exact details about what every part of the HD path means, instead, we are just going to briefly explain the `coin_type`. Each blockchain has a number that represents it i.e the `coin_type`. Bitcoin is `0`, Ethereum is `60`, Cosmos is `118`.

### Injective specific context

Injective uses the same `coin_type` as Ethereum, i.e `60`. This means for Ledger to be used to sign transactions on Injective, **we have to use the Ethereum app on Ledger**.

Ledger is limited to having one installed application for one `coin_type`. As we have to use the Ethereum app to sign transactions on Injective, we have to explore available options to us to get a valid signature. One of the available options is the `EIP712` procedure for hashing and signing typed structured data. Ledger exposes the `signEIP712HashedMessage` which we are going to use.

Once we sign the `EIP712` typed data, we are going to pack the transaction using the normal Cosmos-SDK approach of packing and broadcasting the transaction. There are some minor differences, one of them being using the `SIGN_MODE_LEGACY_AMINO_JSON` mode and appending a `Web3Exension` to the Cosmos transaction and we are going to explain them in this document.

### EIP712 Typed Data

EIP 712 is a standard for hashing and signing of typed structured data. For every EIP712 typed data, each of the values the user passes (that need to be signed) has a type representative which explains the exact type of that particular value. In addition to the value the user wants to sign and its type (the `PrimaryType` of the EIP712 typedData), every EIP712 typed data should contain an `EIP712Domain` which provides context about the source of the transaction.

## Transaction Flow

The implementation itself consists of a few steps, namely:

1. Preparing the transaction to be signed using the Ethereum app on Ledger,
2. Preparing and signing the transaction on Ledger,
3. Preparing the transaction to be broadcasted,
4. Broadcast the transaction.

We are going deep dive into each step and elaborate on the actions we need to take to get the transaction signed and broadcasted to the chain.

#### Preparing the transaction (for signing)

As we’ve said above, the transaction needs to be signed using the Ethereum app on Ledger. This means that the user has to be prompted to switch (or open) the Ethereum app on Ledger once they reach the signing stage.

We know that each Cosmos transaction consists of messages which signify the instructions the user wants to execute on the chain. If we want to send funds from one address to another, we are going to pack the `MsgSend` message into a transaction and broadcast it to the chain.

Knowing this, the Injective team made [abstraction](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/sdk-ts/src/core/modules/MsgBase.ts) of these Messages to simplify the way they are packed into a transaction. Each of these Messages accepts a specific set of parameters that are needed to instantiate the message. Once this is done, the abstraction exposes a couple of convenient methods which we can use based on the signing/broadcasting method we chose to use. As an example, the Message exposes the `toDirectSign` method which returns the type and the proto representation of the message which can be then used to pack the transaction using the default Cosmos approach, sign it using a privateKey and broadcast it to the chain.

What is of importance for us for this particular implementation are the `toEip712Types` and `toEip712` methods. Calling the first one on an instance of the Message gives out the types of the Message for the EIP712 typed data and the second one gives the values of the Message for the EIP712 data. When we combine these two methods we can generate valid EIP712 typed data which can be passed down to the signing process.

So, let’s see a quick code snippet of the usage of these methods and how we can generate EIP712 typedData from a message:

```ts
import { MsgSend, DEFAULT_STD_FEE } from '@injectivelabs/sdk-ts'
import { 
   getEip712TypedData, 
   Eip712ConvertTxArgs,
   Eip712ConvertFeeArgs
} from '@injectivelabs/sdk-ts/dist/core/eip712'
import { EtherumChainId } from '@injectivelabs/ts-types'

/** More details on these two interfaces later on */
const txArgs: Eip712ConvertTxArgs = {
  accountNumber: accountDetails.accountNumber.toString(),
  sequence: accountDetails.sequence.toString(),
  timeoutHeight: timeoutHeight.toFixed(),
  chainId: chainId,
}
const txFeeArgs: Eip712ConvertFeeArgs = DEFAULT_STD_FEE
const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
const amount = {
  amount: new BigNumberInBase(0.01).toWei().toFixed(),
  denom: "inj",
};
const ethereumChainId = EthereumChainId.Mainnet

const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

/** The EIP712 TypedData that can be used for signing **/
const eip712TypedData = getEip712Tx({
  msgs: msg,
  tx: txArgs,
  fee: txFeeArgs
  ethereumChainId: ethereumChainId,
})

return eip712TypedData;
```

#### Preparing the signing process on Ledger

Now that we have the `eip712TypedData` we need to sign it using Ledger. First, we need to get the Ledger’s transport depending on the support that the user has on the browser and use the `@ledgerhq/hw-app-eth` to make a Ledger instance with the transport that’ll use the Ethereum app on the Ledger device for executing the user’s actions (confirming transactions). After we get the `eip712TypedData` from Step 1, we can use the `signEIP712HashedMessage` on the `EthereumApp` to sign this typedData and return the signature.

```ts
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex, addHexPrefix } from 'ethereumjs-util'
import EthereumApp from '@ledgerhq/hw-app-eth'

const domainHash = (message: any) =>
  TypedDataUtils.hashStruct('EIP712Domain', message.domain, message.types, true)

const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    true,
  )

const transport = /* Get the transport from Ledger */
const ledger = new EthereumApp(transport)
const derivationPath = /* Get the derivation path for the address */

/* eip712TypedData from Step 1 */
const object = JSON.parse(eip712TypedData)

const result = await ledger.signEIP712HashedMessage(
  derivationPath,
  bufferToHex(domainHash(object)),
  bufferToHex(messageHash(object)),
)
const combined = `${result.r}${result.s}${result.v.toString(16)}`
const signature = combined.startsWith('0x') ? combined : `0x${combined}`

return signature;
```

#### Preparing the transaction to be broadcasted

Now that we have the signature, we can prepare the transaction using the default cosmos approach.

```ts
import { 
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE,
  createTransaction,
  createTxRawEIP712,
  createWeb3Extension,
  SIGN_AMINO
} from '@injectivelabs/sdk-ts'
import { DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'

const msg: MsgSend /* from Step 1 */

/** Account Details **/
const chainRestAuthApi = new ChainRestAuthApi(
  lcdEndpoint,
)
const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
  injectiveAddress,
)
const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
const accountDetails = baseAccount.toAccountDetails()

/** Block Details */
const chainRestTendermintApi = new ChainRestTendermintApi(
  lcdEndpoint,
)
const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
const latestHeight = latestBlock.header.height
const timeoutHeight = new BigNumberInBase(latestHeight).plus(
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
)

const { txRaw } = createTransaction({
  message: msgs,
  memo: '',
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
const signatureBuff = Buffer.from(signature.replace('0x', ''), 'hex')
txRawEip712.signatures = [signatureBuff]

return txRawEip712
```

#### Broadcasting the transaction

Now that we have the transaction packed into `TxRaw` we can broadcast it to the node using the default cosmos approach.

## Codebase

Let’s see an example codebase containing all of the steps above

```ts
import { 
  ChainRestAuthApi,
  ChainRestTendermintApi,
  BaseAccount,
  DEFAULT_STD_FEE
  createTransaction,
  createTxRawEIP712,
  createWeb3Extension,
  SIGN_AMINO
} from '@injectivelabs/sdk-ts'
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex, addHexPrefix } from 'ethereumjs-util'
import EthereumApp from '@ledgerhq/hw-app-eth'
import { 
   getEip712TypedData, 
   Eip712ConvertTxArgs,
   Eip712ConvertFeeArgs
} from '@injectivelabs/sdk-ts/dist/core/eip712'
import { EtherumChainId, CosmosChainId } from '@injectivelabs/ts-types'
import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'

const domainHash = (message: any) =>
TypedDataUtils.hashStruct('EIP712Domain', message.domain, message.types, true)

const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    true,
  )

const signTransaction = async (eip712TypedData: any) => {
  const transport = /* Get the transport from Ledger */
  const ledger = new EthereumApp(transport)
  const derivationPath = /* Get the derivation path for the address */
    
  /* eip712TypedData from Step 1 */ 
  const result = await ledger.signEIP712HashedMessage(
    derivationPath,
    bufferToHex(domainHash(eip712TypedData)),
    bufferToHex(messageHash(eip712TypedData)),
  )
  const combined = `${result.r}${result.s}${result.v.toString(16)}`
  const signature = combined.startsWith('0x') ? combined : `0x${combined}`
    
  return signature;
}

const getAccountDetails = (address: string): BaseAccount => {
  const chainRestAuthApi = new ChainRestAuthApi(
    lcdEndpoint,
  )
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
    address,
  )
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
  const accountDetails = baseAccount.toAccountDetails()

  return accountDetails
}

const getTimeoutHeight = () => {
  const chainRestTendermintApi = new ChainRestTendermintApi(
    lcdEndpoint,
  )
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
  const latestHeight = latestBlock.header.height
  const timeoutHeight = latestHeight + DEFAULT_BLOCK_TIMEOUT_HEIGHT

  return timeoutHeight
}

const address = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
const chainId = CosmosChainId.Injective
const ethereumChainId = EthereumChainId.Mainnet
const accountDetails = getAccountDetails()
const timeoutHeight = getTimeoutHeight

const txArgs: Eip712ConvertTxArgs = {
  accountNumber: accountDetails.accountNumber.toString(),
  sequence: accountDetails.sequence.toString(),
  timeoutHeight: timeoutHeight.toString(),
  chainId: chainId,
}
const txFeeArgs: Eip712ConvertFeeArgs = DEFAULT_STD_FEE
const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
const amount = {
  amount: new BigNumberInBase(0.01).toWei().toFixed(),
  denom: "inj",
};

const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

/** The EIP712 TypedData that can be used for signing **/
const eip712TypedData = getEip712Tx({
  msgs: msg,
  tx: txArgs,
  fee: txFeeArgs
  ethereumChainId: ethereumChainId,
})

/** Signing on Ethereum */
const signature = await signTransaction(eip712TypedData)

/** Preparing the transaction for client broadcasting */
const { txRaw } = createTransaction({
  message: msg,
  memo: '',
  signMode: SIGN_AMINO,
  fee: DEFAULT_STD_FEE,
  pubKey: publicKeyBase64,
  sequence: accountDetails.sequence,
  timeoutHeight: timeoutHeight.toNumber(),
  accountNumber: accountDetails.accountNumber,
  chainId: chainId,
})
const web3Extension = createWeb3Extension({
  ethereumChainId,
})
const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

/** Append Signatures */
const signatureBuff = Buffer.from(signature.replace('0x', ''), 'hex')
txRawEip712.signatures = [signatureBuff]

/** Broadcast the transaction **/
const txRestClient = new TxRestClient(lcdEndpoint)
const response = await txRestClient.broadcast(txRawEip712)

if (response.code !== 0) {
  throw new Error(`Transaction failed: ${response.rawLog}`)
}

return response.txhash

```
