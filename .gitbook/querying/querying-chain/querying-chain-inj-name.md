# Querying Chain: .inj Name Service

Example code snippets to resolve .inj domain name

### Domain Resolution

- Get address for .inj domain name.

```ts
import {getNetworkEndpoints, Network} from '@injectivelabs/networks'
import {ChainId} from "@injectivelabs/ts-types";
import {ChainGrpcInjNameApi} from "./ChainGrpcInjNameApi";

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcInjNameApi = new ChainGrpcInjNameApi(endpoints.grpc, ChainId.Testnet)

const address = await chainGrpcInjNameApi.fetchInjAddress('allen.inj')
console.log(address)

```

### Reverse Resolution

- Get primary name for address.

```ts
import {getNetworkEndpoints, Network} from '@injectivelabs/networks'
import {ChainId} from "@injectivelabs/ts-types";
import {ChainGrpcInjNameApi} from "./ChainGrpcInjNameApi";

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcInjNameApi = new ChainGrpcInjNameApi(endpoints.grpc, ChainId.Testnet)

const name = await chainGrpcInjNameApi.fetchInjName('inj1qnsgpmzlatjczerg8mspzqzl3cwwufp0lupsmj')
console.log(name)
```







