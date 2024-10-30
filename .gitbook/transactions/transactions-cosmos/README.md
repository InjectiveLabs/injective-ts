# Cosmos

Every transaction on Injective follows the same flow. The flow consists of three steps: preparing, signing and broadcasting the transaction. Let's dive into each step separately and explain the process in-depth (including examples) so we can understand the whole transaction flow.

### Preparing a transaction

First of, we need to prepare the transaction for signing.

At this point you **can't** use some online abstractions that provide a quick way to prepare the transaction for you based on the provided Message and the signer (ex. using the `@cosmjs/stargate` package). The reason why is that these packages don't support Injective's publicKey typeUrl, so we have to do the preparation of the address on the client side.

To resolve this, we have provided functions which can prepare the `txRaw` transaction within out `@injectivelabs/sdk-ts` package. `txRaw` is the transaction interface used in Cosmos that contains details about the transaction and the signer itself.

Getting a private key from cosmos wallets is usually done by taking the current key for the chainId and accessing the pubKey from there (ex: `const key = await window.keplr.getKey(chainId)` => `const pubKey = key.publicKey`).

```ts
import {
  MsgSend,
  BaseAccount,
  ChainRestAuthApi,
  createTransaction,
  ChainRestTendermintApi,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getStdFee, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from "@injectivelabs/utils";

(async () => {
  const injectiveAddress = "inj1";
  const chainId = "injective-1"; /* ChainId.Mainnet */
  const restEndpoint =
    "https://sentry.lcd.injective.network"; /* getNetworkEndpoints(Network.MainnetSentry).rest */
  const amount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };

  /** Account Details **/
  const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
    injectiveAddress
  );
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

  /** Block Details */
  const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  const latestHeight = latestBlock.header.height;
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(
    DEFAULT_BLOCK_TIMEOUT_HEIGHT
  );

  /** Preparing the transaction */
  const msg = MsgSend.fromJSON({
    amount,
    srcInjectiveAddress: injectiveAddress,
    dstInjectiveAddress: injectiveAddress,
  });

  /** Get the PubKey of the Signer from the Wallet/Private Key */
  const pubKey = await getPubKey();

  /** Prepare the Transaction **/
  const { txRaw, signDoc } = createTransaction({
    pubKey,
    chainId,
    fee: getStdFee({}),
    message: msg,
    sequence: baseAccount.sequence,
    timeoutHeight: timeoutHeight.toNumber(),
    accountNumber: baseAccount.accountNumber,
  });
})();

```

### Signing a transaction

Once we have prepared the transaction, we proceed to signing. Once you get the `txRaw` transaction from the previous step use any Cosmos native wallet to sign (ex: Keplr),

```ts
import { ChainId } from '@injectivelabs/ts-types'
import { SignDoc } from '@keplr-wallet/types'

const getKeplr = async (chainId: string) => {
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key }
}

const { offlineSigner } = await getKeplr(ChainId.Mainnet)

/* Sign the Transaction */
const address = 'inj1...'
const signDoc = /* From the previous step */
const directSignResponse = await offlineSigner.signDirect(address, signDoc as SignDoc)
```

You can also use our `@injectivelabs/wallet-ts` package to get out-of-the-box wallet provides that will give you abstracted methods that you can use to sign transactions. Refer to the documentation of the package, its straightforward to setup and use. **This is the recommended way as you have access to more than one wallet to use in your dApp. The `WalletStrategy` provides more than just signing transaction abstractions.**

### Broadcasting a transaction

Once we have the signature ready, we need to broadcast the transaction to the Injective chain itself. After getting the signature from the second step, we need to include it in the signed transaction and broadcast it to the chain.

```ts
import { ChainId } from '@injectivelabs/ts-types'
import {
  TxRestApi,
  CosmosTxV1Beta1Tx,
  BroadcastModeKeplr,
  getTxRawFromTxRawOrDirectSignResponse,
  TxRaw,
} from '@injectivelabs/sdk-ts'
import { TransactionException } from '@injectivelabs/exceptions'

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
const directSignResponse = /* From the second step above */;
const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse)

const broadcastTx = async (chainId: String, txRaw: TxRaw) => {
  const getKeplr = async (chainId: string) => {
    await window.keplr.enable(chainId);

    return window.keplr
  }

  const keplr = await getKeplr(ChainId.Mainnet)
  const result = await keplr.sendTx(
    chainId,
    CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
    BroadcastModeKeplr.Sync,
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
const restEndpoint = 'https://sentry.lcd.injective.network' /* getNetworkEndpoints(Network.MainnetSentry).rest */
const txRestApi = new TxRestApi(restEndpoint)

 /** This will poll querying the transaction and await for it's inclusion in the block */
const response = await txRestApi.fetchTxPoll(txHash)
```

### Example (Prepare + Sign + Broadcast)

Let's have a look at the whole flow (using Keplr as a signing wallet)

```ts
import {
  TxRaw,
  MsgSend,
  BaseAccount,
  TxRestApi,
  ChainRestAuthApi,
  createTransaction,
  CosmosTxV1Beta1Tx,
  BroadcastModeKeplr,
  ChainRestTendermintApi,
  getTxRawFromTxRawOrDirectSignResponse,
} from "@injectivelabs/sdk-ts";
import { getStdFee, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { BigNumberInBase } from "@injectivelabs/utils";
import { TransactionException } from "@injectivelabs/exceptions";
import { SignDoc } from "@keplr-wallet/types";

const getKeplr = async (chainId: string) => {
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key };
};

const broadcastTx = async (chainId: string, txRaw: TxRaw) => {
  const keplr = await getKeplr(ChainId.Mainnet);
  const result = await keplr.sendTx(
    chainId,
    CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
    BroadcastModeKeplr.Sync
  );

  if (!result || result.length === 0) {
    throw new TransactionException(
      new Error("Transaction failed to be broadcasted"),
      { contextModule: "Keplr" }
    );
  }

  return Buffer.from(result).toString("hex");
};

(async () => {
  const chainId = "injective-1"; /* ChainId.Mainnet */
  const { key, offlineSigner } = await getKeplr(chainId);
  const pubKey = Buffer.from(key.pubKey).toString("base64");
  const injectiveAddress = key.bech32Address;
  const restEndpoint =
    "https://sentry.lcd.injective.network"; /* getNetworkEndpoints(Network.MainnetSentry).rest */
  const amount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };

  /** Account Details **/
  const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
    injectiveAddress
  );
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

  /** Block Details */
  const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
  const latestHeight = latestBlock.header.height;
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(
    DEFAULT_BLOCK_TIMEOUT_HEIGHT
  );

  /** Preparing the transaction */
  const msg = MsgSend.fromJSON({
    amount,
    srcInjectiveAddress: injectiveAddress,
    dstInjectiveAddress: injectiveAddress,
  });

  /** Prepare the Transaction **/
  const { signDoc } = createTransaction({
    pubKey,
    chainId,
    fee: getStdFee({}),
    message: msg,
    sequence: baseAccount.sequence,
    timeoutHeight: timeoutHeight.toNumber(),
    accountNumber: baseAccount.accountNumber,
  });

  const directSignResponse = await offlineSigner.signDirect(
    injectiveAddress,
    signDoc as SignDoc
  );
  const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
  const txHash = await broadcastTx(ChainId.Mainnet, txRaw);
  const response = await new TxRestApi(restEndpoint).fetchTxPoll(txHash);

  console.log(response);
})();
```

### Example with WalletStrategy (Prepare + Sign + Broadcast)

Example can be found [here](https://github.com/InjectiveLabs/injective-ts/blob/862e7c30d96120947b056abffbd01b4f378984a1/packages/wallet-ts/src/broadcaster/MsgBroadcaster.ts#L301-L365).
