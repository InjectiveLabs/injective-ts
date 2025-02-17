# Networks

{% hint style="warning" %}
Up-to-date public Endpoints can be found [here](https://docs.injective.network/develop/public-endpoints/#mainnet). We <mark style="color:red;">**do not recommend**</mark> using them in production for applications having high usage/traffic. There are thousands of developers using the public infrastructure and we cannot promise 100% uptime and reliability. \
\
If you still opt to use the **public** networks, you can use the `Network.{Mainnet|Testnet}Sentry` from the `@injectivelabs/networks` package.&#x20;
{% endhint %}

Building dApps on Injective requires tapping into different environments and networks where you can easily test your dApp. As part of the `injective-ts` monorepo, we have the `@injectivelabs/networks` package allows developers to easily access pre-defined environments to connect to different pieces of Injective.

There are two key functions exported from this package:

* `export function getNetworkEndpoints(network: Network): NetworkEndpoints`
* `export function getEndpointsForNetwork(network: Network): OldNetworkEndpoints`
* `export function getNetworkInfo(network: Network): ChainInfo`

The first one, `getNetworkEndpoints` returns a pre-defined set of endpoints that can be used by the developers - depending on their needs. Here is the interface that gets returned from this function:

```ts
export type NetworkEndpoints = {
  indexer: string // the grpc-web port of the indexer API service
  grpc: string // the grpc-web port of the sentry node
  rest: string // the REST endpoint of the sentry node
  rpc?: string // the REST endpoint of the Tendermint RPC
}

/** @deprecated */
export type OldNetworkEndpoints = {
  exchangeApi: string // @deprecated - the grpc-web port of the exchange API service
  indexerApi: string // the grpc-web port of the indexer API service
  sentryGrpcApi: string // the grpc-web port of the sentry node
  sentryHttpApi: string // the REST endpoint of the sentry node
  tendermintApi?: string // the REST endpoint of the Tendermint RPC
  chronosApi?: string // the REST endpoint of the chronos API service
  exchangeWeb3GatewayApi?: string // the grpc-web port of the web3-gateway service API
}
```

Let's explain these endpoints, and what they mean:

* `indexer` is the [**grpc-web**](https://github.com/grpc/grpc-web) endpoint that we can use to connect to the `exchange/indexer` service which listens for events from the chain, processes the events, and stores the data into a MongoDB so it's easier and much more performant to serve that data than querying it straight from the chain itself,
* `grpc` is the [**grpc-web**](https://github.com/grpc/grpc-web) endpoint that we can use to connect to a sentry node. A Sentry node is a read (and light) only version of the chain that we can use to query data directly from the chain.
* `rest` is the REST endpoint that we can use to connect to a sentry node.
* `rpc` is the REST endpoint that we can use to connect to the Tendermint RPC,

The `getNetworkInfo` exports these endpoints plus the `chainId` and the default `fee` for the `Network` we want.

{% hint style="info" %}
Using the TypeScript SDK with your infrastructure (endpoints) means you have to set up a `grpc-web` proxy in your server. To learn more about it, please reference [this documentation](https://github.com/grpc/grpc-web?tab=readme-ov-file#2-run-the-server-and-proxy).
{% endhint %}
