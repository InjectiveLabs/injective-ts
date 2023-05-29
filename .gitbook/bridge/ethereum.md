# Ethereum

The Injective Ethereum bridge enables the Injective Chain to support a trustless, on-chain bidirectional token bridge. In this system, holders of ERC-20 tokens on Ethereum can instantaneously convert their ERC-20 tokens to Cosmos-native coins on the Injective Chain and vice-versa.

The Injective Peggy bridge consists of three main components:

1. Peggy Contract on Ethereum
2. Peggo Orchestrator
3. Peggy Module on the Injective Chain

#### Peggy Contract

The function of the Peggy contract is to facilitate efficient, bidirectional cross-chain transfers of ERC-20 tokens from Ethereum to the Injective Chain. Unlike other token bridge setups, the Injective Peggy bridge is a decentralized, non-custodial bridge operated solely by the validators on Injective. The bridge is secured by the proof of stake security of the Injective Chain, as deposits and withdrawals are processed in accordance with attestations made by at least two-thirds of the validators based on consensus staking power.

#### Peggo Orchestrator

The orchestrator is an off-chain relayer that every Injective Chain validator operates which serves the function of transmitting ERC-20 token transfer data from Ethereum to the Injective Chain.

#### Peggy Module

On a basic level, the Peggy module mints new tokens on the Injective Chain upon an ERC-20 deposit from Ethereum and burns tokens upon withdrawing a token from the Injective Chain back to Ethereum. The Peggy module also manages the economic incentives to ensure that validators act honestly and efficiently, through a variety of mechanisms including slashing penalties, native token rewards, and withdrawal fees.

### From Ethereum to Injective

To transfer from Ethereum to Injective you have to make a Web3 Transaction and interact with the Peggy contract on Ethereum. There are two steps required to make a transfer:

1. As we are basically locking our ERC20 assets on the Peggy Contract which lives on Ethereum, we need to set an allowance for the assets we are transferring to the Peggy Contract. We have an [example](https://github.com/InjectiveLabs/injective-ts/blob/1fbc2577b9278a62d1676041d6e502e12f5880a8/packages/sdk-ui-ts/src/services/web3/Web3Composer.ts#L41-L91) here about how to make this transaction and you can use any web3 provider to sign and broadcast the transaction to the Ethereum Network.
2. After the allowance is set, we need to call the `sendToInjective` function on the Peggy Contract with the desired amount and asset that we want to transfer to the Injective Chain, an example can be found [here](https://github.com/InjectiveLabs/injective-ts/blob/1fbc2577b9278a62d1676041d6e502e12f5880a8/packages/sdk-ui-ts/src/services/web3/Web3Composer.ts#L93-L156). Once we get the transaction, we can use a web3 provider to sign and broadcast the transaction to the Ethereum Network. Once the transaction is confirmed, it’ll take a couple of minutes for the assets to show on the Injective Chain.

Couple of notes about the examples above:

* The destination address (if you want to build the transaction yourself) is in the following format

```ts
  "0x000000000000000000000000{ETHEREUM_ADDRESS_HERE_WITHOUT_0X_PREFIX}"
  // example
  "0x000000000000000000000000e28b3b32b6c345a34ff64674606124dd5aceca30"
```

where the Ethereum address is the corresponding Ethereum address of the destination Injective address.

* `const web3 = walletStrategy.getWeb3()` `walletStrategy` is an abstraction that we’ve built which supports a lot of wallets which can be used to sign and broadcast transactions (both on Ethereum and on the Injective Chain), more details can be found in the documentation of the npm package [@injectivelabs/wallet-ts](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/wallet-ts). Obviously, this is just an example and you can use the web3 package directly, or any web3 provider to handle the transaction.

```ts
import { PeggyContract } from '@injectivelabs/contracts'

const contract = new PeggyContract({
  ethereumChainId,
  address: peggyContractAddress,
  web3: web3 as any,
})
```

* The snippet below instantiates a PeggyContract instance which can easily `estimateGas` and `sendTransaction` using the `web3` we provide to the contract’s constructor. It’s implementation can be found [here](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/contracts/src/contracts/Peggy.ts). Obviously, this is just an example and you can use the web3 package directly + the ABI of the contract to instantiate the contract, and then handle the logic of signing and broadcasting the transaction using some web3 provider.

### From Injective to Ethereum

Now that you have the ERC20 version of INJ transferred over to Injective, the native `inj` denom on the Injective Chain is minted and it is the canonical version of the INJ token. To withdraw `inj` from Injective to Ethereum we have to prepare, sign and then broadcast a native Cosmos transaction on the Injective Chain.

If you are not familiar with how Transactions (and Messages) work on Cosmos you can find more information here. The Message we need to pack into a transaction to instruct Injective to withdraw funds from Injective to Ethereum is `MsgSendToEth`.

When `MsgSendToEth` is called on the chain, some of the validators will pick up the transaction, batch multiple `MsgSendToEth` requests into one and: burn the assets being withdrawn on Injective, unlock these funds on the Peggy Smart Contract on Ethereum and send them to the respective address.

There is a bridgeFee included in these transactions to incentivise Validators to pick up and process your withdrawal requests faster. The bridgeFee is in the asset the user wants to withdraw to Ethereum (if you withdraw INJ you have to pay the bridgeFee in INJ as well).

Here is an example implementation that prepares the transaction, uses a privateKey to sign it and finally, broadcasts it to Injective:

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { 
  TxClient,
  PrivateKey, 
  TxRestClient, 
  MsgSendToEth, 
  DEFAULT_STD_FEE, 
  ChainRestAuthApi, 
  createTransaction } from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";

/** MsgSendToEth Example */
(async () => {
  const network = getNetworkInfo(Network.Mainnet); // Gets the rpc/lcd endpoints
  const privateKeyHash =
    "f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3";
  const privateKey = PrivateKey.fromPrivateKey(privateKeyHash);
  const injectiveAddress = privateKey.toBech32();
  const ethAddress = privateKey.toHex();
  const publicKey = privateKey.toPublicKey().toBase64();

  /** Account Details **/
  const accountDetails = await new ChainRestAuthApi(
    network.sentryHttpApi
  ).fetchAccount(injectiveAddress);

  /** Prepare the Message */
  const amount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };
  const bridgeAmount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };

  const msg = MsgSendToEth.fromJSON({
    amount,
    bridgeFee,
    injectiveAddress,
    address: ethAddress,
  })

  /** Prepare the Transaction **/
  const { signBytes, txRaw } = createTransaction({
    message: msg,
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

  const txService = new TxRestClient(network.sentryHttpApi);

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
      `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
    );
  }
})();
```
