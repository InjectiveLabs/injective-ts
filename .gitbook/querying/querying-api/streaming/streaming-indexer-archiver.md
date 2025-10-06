# Archiver

Example code snippets to stream from the archiver indexer for trading analytics data.

### Using gRPC stream

#### Stream spot average entries of account

```ts
import { IndexerGrpcArchiverStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoint = 'https://k8s.mainnet.archiver.grpc-web.injective.network'
const indexerGrpcArchiverStream = new IndexerGrpcArchiverStream(endpoint)

const account = '0x...'

const streamFn = indexerGrpcArchiverStream.streamSpotAverageEntries.bind(indexerGrpcArchiverStream)

const callback = (spotAverageEntries) => {
  console.log(spotAverageEntries)
}

const streamFnArgs = {
  account,
  callback,
}

streamFn(streamFnArgs)
```
