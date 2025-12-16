import type * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb'
import type {
  EvmParams,
  EvmBlobConfig,
  EvmChainConfig,
  GrpcEvmBlobConfig,
  GrpcEvmChainConfig,
  EvmBlobScheduleConfig,
  GrpcEvmBlobScheduleConfig,
} from '../types/evm.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcEvmTransformer {
  static grpcBlobConfigToBlobConfig(config: GrpcEvmBlobConfig): EvmBlobConfig {
    return {
      max: config.max.toString(),
      target: config.target.toString(),
      baseFeeUpdateFraction: config.baseFeeUpdateFraction.toString(),
    }
  }

  static grpcBlockScheduleConfigToBlockScheduleConfig(
    config: GrpcEvmBlobScheduleConfig,
  ): EvmBlobScheduleConfig {
    return {
      cancun: config.cancun
        ? this.grpcBlobConfigToBlobConfig(config.cancun)
        : undefined,
      prague: config.prague
        ? this.grpcBlobConfigToBlobConfig(config.prague)
        : undefined,
      osaka: config.osaka
        ? this.grpcBlobConfigToBlobConfig(config.osaka)
        : undefined,
      verkle: config.verkle
        ? this.grpcBlobConfigToBlobConfig(config.verkle)
        : undefined,
    }
  }

  static grpcChainConfigToChainConfig(
    config: GrpcEvmChainConfig,
  ): EvmChainConfig {
    return {
      homesteadBlock: config.homesteadBlock,
      daoForkBlock: config.daoForkBlock,
      daoForkSupport: config.daoForkSupport,
      eip150Block: config.eip150Block,
      eip150Hash: config.eip150Hash,
      eip155Block: config.eip155Block,
      eip158Block: config.eip158Block,
      byzantiumBlock: config.byzantiumBlock,
      constantinopleBlock: config.constantinopleBlock,
      petersburgBlock: config.petersburgBlock,
      istanbulBlock: config.istanbulBlock,
      muirGlacierBlock: config.muirGlacierBlock,
      berlinBlock: config.berlinBlock,
      londonBlock: config.londonBlock,
      arrowGlacierBlock: config.arrowGlacierBlock,
      grayGlacierBlock: config.grayGlacierBlock,
      mergeNetsplitBlock: config.mergeNetsplitBlock,
      shanghaiTime: config.shanghaiTime,
      cancunTime: config.cancunTime,
      pragueTime: config.pragueTime,
      eip155ChainId: config.eip155ChainId,
      blobScheduleConfig: config.blobScheduleConfig
        ? this.grpcBlockScheduleConfigToBlockScheduleConfig(
            config.blobScheduleConfig,
          )
        : undefined,
    }
  }

  /**
   * response transformers
   * */

  static accountResponseToAccount(
    response: InjectiveEvmV1QueryPb.QueryAccountResponse,
  ) {
    return {
      balance: response.balance,
      codeHash: response.codeHash,
      nonce: response.nonce.toString(),
    }
  }

  static cosmosAccountResponseToCosmosAccount(
    response: InjectiveEvmV1QueryPb.QueryCosmosAccountResponse,
  ) {
    return {
      sequence: response.sequence.toString(),
      cosmosAddress: response.cosmosAddress,
      accountNumber: response.accountNumber.toString(),
    }
  }

  static validatorAccountResponseToValidatorAccount(
    response: InjectiveEvmV1QueryPb.QueryValidatorAccountResponse,
  ) {
    return {
      sequence: response.sequence.toString(),
      accountNumber: response.accountNumber.toString(),
      accountAddress: response.accountAddress,
    }
  }

  static paramsResponseToParams(
    response: InjectiveEvmV1QueryPb.QueryParamsResponse,
  ): EvmParams | undefined {
    const { params } = response

    if (!params) {
      return
    }

    return {
      evmDenom: params.evmDenom,
      enableCreate: params.enableCreate,
      enableCall: params.enableCall,
      extraEips: params.extraEips.map((eip: bigint) => eip.toString()),
      chainConfig: params.chainConfig
        ? this.grpcChainConfigToChainConfig(params.chainConfig)
        : undefined,
      allowUnprotectedTxs: params.allowUnprotectedTxs,
      authorizedDeployers: params.authorizedDeployers,
      permissioned: params.permissioned,
    }
  }
}
