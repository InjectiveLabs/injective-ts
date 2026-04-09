import type * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import type {
  CosmosPubKeyType,
  GrpcCosmosPubKey,
  RFQGwPrepareResponseType,
  RFQGwPrepareQuoteResultType,
  GrpcRFQGwPrepareQuoteResult,
} from '../types'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcRfqGwTransformer {
  static grpcCosmosPubKeyToCosmosPubKey(
    grpcPubKey: GrpcCosmosPubKey,
  ): CosmosPubKeyType {
    return {
      key: grpcPubKey.key,
      type: grpcPubKey.type,
    }
  }

  static grpcPrepareQuoteResultToPrepareQuoteResult(
    grpcQuote: GrpcRFQGwPrepareQuoteResult,
  ): RFQGwPrepareQuoteResultType {
    return {
      maker: grpcQuote.maker,
      price: grpcQuote.price,
      margin: grpcQuote.margin,
      quantity: grpcQuote.quantity,
    }
  }

  static prepareResponseToPrepareResponse(
    response: InjectiveRfqGwRpcPb.PrepareResponse,
  ): RFQGwPrepareResponseType {
    return {
      tx: response.tx,
      feePayer: response.feePayer,
      signMode: response.signMode,
      rfqId: Number(response.rfqId),
      pubKeyType: response.pubKeyType,
      feePayerSig: response.feePayerSig,
      takerAccountNumber: Number(response.takerAccountNumber),
      takerAccountSequence: Number(response.takerAccountSequence),
      feePayerPubKey: response.feePayerPubKey
        ? IndexerGrpcRfqGwTransformer.grpcCosmosPubKeyToCosmosPubKey(
            response.feePayerPubKey,
          )
        : undefined,
      quotes: response.quotes.map(
        IndexerGrpcRfqGwTransformer.grpcPrepareQuoteResultToPrepareQuoteResult,
      ),
    }
  }
}
