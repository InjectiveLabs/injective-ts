# Querying Chain: CosmWasm

### Querying CosmWasm smart contracts

We can retrieve data from the smart contract using it's query function with the ChainGrpcWasmApi `fetchSmartContractState` grpc function.

```ts
import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";

const contractAddress = "inj...";
const injectiveAddress = "inj...";

// update the payload based on the contract's query function and arguments
const payload = {
  address: injectiveAddress,
};
const query = Buffer.from(JSON.stringify(payload)).toString("base64");

const response = await chainGrpcWasmApi.fetchSmartContractState(
  contractAddress,
  query
);

const data = JSON.parse(Buffer.from(response.data).toString());

console.log(data);
```
