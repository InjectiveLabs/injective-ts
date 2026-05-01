import type * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import type {
  CosmosPubKeyType,
  GrpcCosmosPubKey,
  RFQGwPrepareResponseType,
  GrpcRFQGwPrepareQuoteResult,
  RFQGwPrepareQuoteResultType,
  RFQGwPrepareEip712ResponseType,
  RFQGwPrepareAutoSignResponseType,
  RFQGwPrepareEip712AutoSignResponseType,
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

  static prepareAutoSignResponseToResponse(
    response: InjectiveRfqGwRpcPb.PrepareAutoSignResponse,
  ): RFQGwPrepareAutoSignResponseType {
    return {
      tx: response.tx,
      feePayer: response.feePayer,
      signMode: response.signMode,
      rfqId: Number(response.rfqId),
      pubKeyType: response.pubKeyType,
      feePayerSig: response.feePayerSig,
      quotesWaitMs: Number(response.quotesWaitMs),
      expiredQuotesCount: Number(response.expiredQuotesCount),
      autosignAccountNumber: Number(response.autosignAccountNumber),
      feePayerAccountNumber: Number(response.feePayerAccountNumber),
      autosignAccountSequence: Number(response.autosignAccountSequence),
      feePayerAccountSequence: Number(response.feePayerAccountSequence),
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

  static prepareResponseToResponse(
    response: InjectiveRfqGwRpcPb.PrepareResponse,
  ): RFQGwPrepareResponseType {
    return {
      tx: response.tx,
      feePayer: response.feePayer,
      signMode: response.signMode,
      rfqId: Number(response.rfqId),
      pubKeyType: response.pubKeyType,
      feePayerSig: response.feePayerSig,
      quotesWaitMs: Number(response.quotesWaitMs),
      expiredQuotesCount: Number(response.expiredQuotesCount),
      takerAccountNumber: Number(response.takerAccountNumber),
      takerAccountSequence: Number(response.takerAccountSequence),
      feePayerAccountNumber: Number(response.feePayerAccountNumber),
      feePayerAccountSequence: Number(response.feePayerAccountSequence),
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

  static prepareEip712ResponseToResponse(
    response: InjectiveRfqGwRpcPb.PrepareEip712Response,
  ): RFQGwPrepareEip712ResponseType {
    return {
      data: response.data,
      feePayer: response.feePayer,
      signMode: response.signMode,
      rfqId: Number(response.rfqId),
      pubKeyType: response.pubKeyType,
      feePayerSig: response.feePayerSig,
      quotesWaitMs: Number(response.quotesWaitMs),
      expiredQuotesCount: Number(response.expiredQuotesCount),
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

  static prepareEip712AutoSignResponseToResponse(
    response: InjectiveRfqGwRpcPb.PrepareEip712AutoSignResponse,
  ): RFQGwPrepareEip712AutoSignResponseType {
    return {
      data: response.data,
      feePayer: response.feePayer,
      signMode: response.signMode,
      rfqId: Number(response.rfqId),
      pubKeyType: response.pubKeyType,
      feePayerSig: response.feePayerSig,
      quotesWaitMs: Number(response.quotesWaitMs),
      expiredQuotesCount: Number(response.expiredQuotesCount),
      autosignAccountNumber: Number(response.autosignAccountNumber),
      autosignAccountSequence: Number(response.autosignAccountSequence),
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
