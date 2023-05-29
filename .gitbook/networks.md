# Networks

Building dApps on Injective requires being able to tap into different environments and networks where you can test your dApp with ease. As part of the `injective-ts` monorepo, we have the `@injectivelabs/networks` package which allows developers to easily access pre-defined environments to connect to different pieces of Injective.

There are two key functions exported from this package:

* `export function getNetworkEndpoints(network: Network): NetworkEndpoints`
* `export function getEndpointsForNetwork(network: Network): OldNetworkEndpoints`
* `export function getNetworkInfo(network: Network): ChainInfo`

The first one, `getNetworkEndpoints` returns a pre-defined set of endpoints that can be used by the developers - depending on their need. Here is the interface that gets returned from this function:

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

Lets explain these endpoints, and what do they mean:

* `indexer` is the grpc-web endpoint that we can use to connect to the `exchange/indexer` service which listens for events from the chain, processes the events and stores the data into a mongoDB so its easier and much more performant to serve that data than querying it straight from the chain itself,
* `grpc` is the grpc-web endpoint that we can use to connect to a sentry node. A Sentry node is basically a read (and light) only version of the chain that we can use to query data directly from the chain.
* `rest` is the REST endpoint that we can use to connect to a sentry node.
* `rpc` is the REST endpoint that we can use to connect to the Tendermint RPC,

The `getNetworkInfo` exports these endpoints plus the `chainId` and the default `fee` for the `Network` we want.
