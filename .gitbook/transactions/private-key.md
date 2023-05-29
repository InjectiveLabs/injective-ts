# Private Key

Every transaction on Injective follows the same flow. The flow consists of three steps: preparing, signing and broadcasting the transaction. Let's dive into each step separately and explain the process in-depth (including examples) so we can understand the whole transaction flow.

### Preparing a transaction

First of, we need to prepare the transaction for signing.

```ts
import { 
  MsgSend,
  PrivateKey,
  BaseAccount,
  DEFAULT_STD_FEE,
  ChainRestAuthApi,
  createTransaction,
  ChainRestTendermintApi,
} from '@injectivelabs/sdk-ts'
import { DEFAULT_STD_FEE, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKeyHash = ''
const privateKey = PrivateKey.fromHex(privateKeyHash);
const injectiveAddress = privateKey.toBech32();
const address = privateKey.toAddress();
const pubKey = privateKey.toPublicKey().toBase64();
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

/** Prepare the Transaction **/
const { txRaw, signBytes } = createTransaction({
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

/* Sign the Transaction */
const privateKeyHash = ''
const privateKey = PrivateKey.fromHex(privateKeyHash);
const signBytes = /* From the previous step */

/** Sign transaction */
const signature = await privateKey.sign(Buffer.from(signBytes));
```

### Broadcasting a transaction

Once we have the signature ready, we need to broadcast the transaction to the Injective chain itself. After getting the signature from the second step, we need to include that signature in the signed transaction and broadcast it to the chain.

```ts
import { ChainId } from '@injectivelabs/ts-types'
import { TxRestClient } from '@injectivelabs/sdk-ts'
import { Network, getNetworkInfo } from '@injectivelabs/networks'

/** Append Signatures */
const network = getNetworkInfo(Network.TestnetK8s);
const txRaw = /* from the first step */
const signature = /* from the second step */
txRaw.signatures = [signature];

/** Calculate hash of the transaction */
console.log(`Transaction Hash: ${TxClient.hash(txRaw)}`);

const txService = new TxGrpcClient(network.grpc);

/** Simulate transaction */
const simulationResponse = await txService.simulate(txRaw);

console.log(
  `Transaction simulation response: ${JSON.stringify(
    simulationResponse.gasInfo
  )}`
);

/** Broadcast transaction */
const txResponse = await txService.broadcast(txRaw);

console.log(txResponse);

if (txResponse.code !== 0) {
  console.log(`Transaction failed: ${txResponse.rawLog}`);
} else {
  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txHash)}`
  );
}
```

### Example (Prepare + Sign + Broadcast)

Let's have a look at the whole flow (using Keplr as a signing wallet)

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import {
  TxClient,
  PrivateKey,
  TxGrpcClient,
  ChainRestAuthApi,
  createTransaction,
} from "@injectivelabs/sdk-ts";
import { MsgSend } from "@injectivelabs/sdk-ts";
import { BigNumberInBase, DEFAULT_STD_FEE } from "@injectivelabs/utils";

/** MsgSend Example */
(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);
  const privateKeyHash =
    "f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3";
  const privateKey = PrivateKey.fromHex(privateKeyHash);
  const injectiveAddress = privateKey.toBech32();
  const publicKey = privateKey.toPublicKey().toBase64();

  /** Account Details **/
  const accountDetails = await new ChainRestAuthApi(network.rest).fetchAccount(
    injectiveAddress
  );

  /** Prepare the Message */
  const amount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };

  const msg = MsgSend.fromJSON({
    amount,
    srcInjectiveAddress: injectiveAddress,
    dstInjectiveAddress: injectiveAddress,
  });

  /** Prepare the Transaction **/
  const { signBytes, txRaw } = createTransaction({
    message: msg,
    memo: "",
    fee: DEFAULT_STD_FEE,
    pubKey: publicKey,
    sequence: parseInt(accountDetails.account.base_account.sequence, 10),
    accountNumber: parseInt(
      accountDetails.account.base_account.account_number,
      10
    ),
    chainId: network.chainId,
  });

  /** Sign transaction */
  const signature = await privateKey.sign(Buffer.from(signBytes));

  /** Append Signatures */
  txRaw.signatures = [signature];

  /** Calculate hash of the transaction */
  console.log(`Transaction Hash: ${TxClient.hash(txRaw)}`);

  const txService = new TxGrpcClient(network.grpc);

  /** Simulate transaction */
  const simulationResponse = await txService.simulate(txRaw);
  console.log(
    `Transaction simulation response: ${JSON.stringify(
      simulationResponse.gasInfo
    )}`
  );

  /** Broadcast transaction */
  const txResponse = await txService.broadcast(txRaw);

  if (txResponse.code !== 0) {
    console.log(`Transaction failed: ${txResponse.rawLog}`);
  } else {
    console.log(
      `Broadcasted transaction hash: ${JSON.stringify(txResponse.txHash)}`
    );
  }
})();

```

### Example with MsgBroadcasterWithPk

You can use the `MsgBroadcasterWithPk` class from the `@injectivelabs/sdk-ts` package which abstracts away most of the logic written above into a single class.

```ts
import { MsgSend, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const amount = {
  denom: 'inj',
  amount: new BigNumberInBase(1).toWei()
}
const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```
