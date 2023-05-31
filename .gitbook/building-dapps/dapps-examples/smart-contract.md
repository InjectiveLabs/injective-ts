# Smart Contract

Within these short series we are going to showcase how easy it is to build a dApp on top of Injective. There is an open-sourced [dApp](https://github.com/InjectiveLabs/injective-simple-sc-counter-ui) which everyone can reference and use to build on top of Injective.There are examples for Next, Nuxt and Vanilla Js. For those who want to start from scratch, this is the right place to start.

In this example we will implement the connection and interact with an example Smart Contract deployed on the Injective Chain using the injective-ts module.

The series will include:

* Setting up the API clients and environment,
* Connecting to the Chain and the Indexer API,
* Connect to a user wallet and get their address,
* Querying the smart contract ( in this case fetching the current count of the smart contract ),
* Modifying the state of the contract ( in this case incrementing the count by 1, or setting it to a speciffic value),

### Setup

First, configure your desired UI framework. You can find more details on the configuration here.

To get started with the dex, we need to setup the API clients and the environment. To build our DEX we are going to query data from both the Injective Chain and the Indexer API. In this example, we are going to use the existing **testnet** environment.

Let's first setup some of the classes we need to query the data.

For interacting with the smart contract, we are going to use `ChainGrpcWasmApi` from `@injectivelabs/sdk-ts`. Also we will need the Network Endpoints we are going to use (Mainnet or Testnet), which we can find in `@injectivelabs/networks`

Example:

```js
//filename: services.ts
import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

export const NETWORK = Network.TestnetK8s;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);

export const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
```

Then, we also need to setup a wallet connection to allow the user to connect to our DEX and start signing transactions. To make this happen we are going to use our `@injectivelabs/wallet-ts` package which allows users to connect with a various of different wallet providers and use them to sign transactions on Injective.

The main purpose of the `@injectivelabs/wallet-ts` is to offer developers a way to have different wallet implementations on Injective. All of these wallets implementations are exposing the same `ConcreteStrategy` interface which means that users can just use these methods without the need to know the underlying implementation for specific wallets as they are abstracted away.

To start, you have to make an instance of the WalletStrategy class which gives you the ability to use different wallets out of the box. You can switch the current wallet that is used by using the `setWallet` method on the walletStrategy instance. The default is `Metamask`.

```ts
// filename: wallet.ts
import { WalletStrategy } from "@injectivelabs/wallet-ts";
import { Web3Exception } from "@injectivelabs/exceptions";

// These imports are from .env
import {
  CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  IS_TESTNET,
  alchemyRpcEndpoint,
  alchemyWsRpcEndpoint,
} from "/constants";

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    wsRpcUrl: alchemyWsRpcEndpoint,
    rpcUrl: alchemyRpcEndpoint,
  },
});
```

If we don't want to use Ethereum native wallets, just omit the `ethereumOptions` within the `WalletStrategy` constructor.

Finally, to do the whole transaction flow (prepare + sign + broadcast) on Injective we are going to use the MsgBroadcaster class.

```js
import { Network } from "@injectivelabs/networks";
export const NETWORK = Network.TestnetK8s;

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});
```

### Connect to the user's wallet

Since we are using the `WalletStrategy` to handle the connection with the user's wallet, we can use its methods to handle some use cases like getting the user's addresses, sign/broadcast a transaction, etc. To find out more about the wallet strategy, you can explore the documentation interface and the method the `WalletStrategy` offers.

Note: We can switch between the "active" wallet within the `WalletStrategy` using the `setWallet` method.

```ts
// filename: WalletConnection.ts
import {
  WalletException,
  UnspecifiedErrorCode,
  ErrorType,
} from "@injectivelabs/exceptions";
import { Wallet } from "@injectivelabs/wallet-ts";
import { walletStrategy } from "./Wallet.ts";

export const getAddresses = async (wallet: Wallet): Promise<string[]> => {
  walletStrategy.setWallet(wallet);

  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new WalletException(
      new Error("There are no addresses linked in this wallet."),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
      }
    );
  }

  if (!addresses.every((address) => !!address)) {
    throw new WalletException(
      new Error("There are no addresses linked in this wallet."),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
      }
    );
  }

  // If we are using Ethereum native wallets the 'addresses' are the hex addresses
  // If we are using Cosmos native wallets the 'addresses' are bech32 injective addresses,
  return addresses;
};
```

### Querying

After the initial setup is done, let's see how to query the smart contract to get the current count using the chainGrpcWasmApi service we created earlier, and calling get\_count on the Smart Contract.

```ts
function getCount() {
  const response = (await chainGrpcWasmApi.fetchSmartContractState(
    COUNTER_CONTRACT_ADDRESS, // The address of the contract
    toBase64({ get_count: {} }) // We need to convert our query to Base64
  )) as { data: string };

  const { count } = fromBase64(response.data) as { count: number }; // we need to convert the response from Base64

  return count; // return the current counter value.
}
```

Once we have these functions (`getCount` or others we create) we can call them anywhere in our application (usually the centralized state management services like Pinia in Nuxt, or Context providers in React, etc).

### Modifying the State

Next we will modify the `count` state. We can do that by sending messages to the chain using the `Broadcast Client` we created earlier and `MsgExecuteContractCompat` from `@injectivelabs/sdk-ts`

The Smart Contract we use for this example has 2 methods for altering the state:

* `increment`
* `reset`

`increment` increment the count by 1, and `reset` sets the count to a given value. Note that `reset` can only be called if you are the creator of the smart contract.

When we call these functions, our wallet opens up to sign the message/transaction and broadcasts it.

Lets first see how to increment the count.

```js
// Preparing the message

const msg = MsgExecuteContractCompat.fromJSON({
  contractAddress: COUNTER_CONTRACT_ADDRESS,
  sender: injectiveAddress,
  msg: {
    increment: {}, // we pass an empty object if the method doesnt have parameters
  },
});

// Signing and broadcasting the message

const response = await msgBroadcastClient.broadcast({
  msgs: msg, // we can pass multiple messages here using an array. ex: [msg1,msg2]
  injectiveAddress: injectiveAddress,
});

console.log(response);
```

Now, lets see an example of how to se the counter to a specific value. Note that in this Smart Contract the count can be set to specific value only by the creator of the Smart Contract.

```js
// Preparing the message

const msg = MsgExecuteContractCompat.fromJSON({
  contractAddress: COUNTER_CONTRACT_ADDRESS,
  sender: injectiveAddress,
  msg: {
    reset: {
      count: parseInt(number, 10), // we are parseing the number variable here because usualy it comes from an input which always gives a string, and we need to pass a number instead.
    },
  },
});

// Signing and broadcasting the message

const response = await msgBroadcastClient.broadcast({
  msgs: msg,
  injectiveAddress: injectiveAddress,
});

console.log(response);
```

### Full example

Now lets see a full example of this in Vanilla JS (You can find examples for specific frameworks like Nuxt And Next [HERE](https://github.com/InjectiveLabs/injective-simple-sc-counter-ui))

```js
import { ChainGrpcWasmApi, getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { WalletStrategy } from "@injectivelabs/wallet-ts";
import { Web3Exception } from "@injectivelabs/exceptions";

// These imports are from .env
import {
  CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  IS_TESTNET,
  alchemyRpcEndpoint,
  alchemyWsRpcEndpoint,
} from "/constants";

const NETWORK = Network.TestnetK8s;
const ENDPOINTS = getNetworkEndpoints(NETWORK);

const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);

const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    wsRpcUrl: alchemyWsRpcEndpoint,
    rpcUrl: alchemyRpcEndpoint,
  },
});

export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new Web3Exception(
      new Error("There are no addresses linked in this wallet.")
    );
  }

  return addresses;
};

const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});

const [address] = await getAddresses();
const injectiveAddress = getInjectiveAddress(getInjectiveAddress);

async function fetchCount() {
  const response = (await chainGrpcWasmApi.fetchSmartContractState(
    COUNTER_CONTRACT_ADDRESS, // The address of the contract
      toBase64({ get_count: {} }) // We need to convert our query to Base64
    )) as { data: string };

  const { count } = fromBase64(response.data) as { count: number }; // we need to convert the response from Base64

  console.log(count)
}

async function increment(){
    const msg = MsgExecuteContractCompat.fromJSON({
    contractAddress: COUNTER_CONTRACT_ADDRESS,
    sender: injectiveAddress,
    msg: {
        increment: {},
        },
    });

    // Signing and broadcasting the message

    await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: injectiveAddress,
    });
}

async function main() {
    await fetchCount() // this will log: {count: 5}
    await increment() // this opens up your wallet to sign the transaction and broadcast it
    await fetchCount() // the count now is 6. log: {count: 6}
}

main()

```

### Final Thoughts

What's left for you is to build a nice UI around the business logic explained above :)
