import * as InjectiveTypesV1Beta1AccountPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/account_pb.mjs'
import * as InjectiveCryptoV1Beta1Ethsecp256k1KeysPb from '@injectivelabs/core-proto-ts-v2/generated/injective/crypto/v1beta1/ethsecp256k1/keys_pb.mjs'
import { uint8ArrayToString } from '../../../utils/index.js'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import type * as CosmosAuthV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/auth/v1beta1/query_pb.mjs'
import type { Account, AuthModuleParams } from '../types/auth.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosAuthV1Beta1QueryPb.QueryParamsResponse,
  ): AuthModuleParams {
    const params = response.params!

    return {
      maxMemoCharacters: Number(params.maxMemoCharacters),
      txSigLimit: Number(params.txSigLimit),
      txSizeCostPerByte: Number(params.txSizeCostPerByte),
      sigVerifyCostEd25519: Number(params.sigVerifyCostEd25519),
      sigVerifyCostSecp256k1: Number(params.sigVerifyCostSecp256K1),
    }
  }

  static grpcAccountToAccount(ethAccount: GoogleProtobufAnyPb.Any): Account {
    const account = InjectiveTypesV1Beta1AccountPb.EthAccount.fromBinary(
      ethAccount.value,
    )
    const baseAccount = account.baseAccount!
    const pubKey = baseAccount.pubKey

    return {
      codeHash: uint8ArrayToString(account.codeHash),
      baseAccount: {
        address: baseAccount.address,
        pubKey: pubKey
          ? {
              key: Buffer.from(
                InjectiveCryptoV1Beta1Ethsecp256k1KeysPb.PubKey.fromBinary(
                  pubKey.value,
                ).key,
              ).toString('base64'),
              typeUrl: pubKey.typeUrl,
            }
          : undefined,
        accountNumber: Number(baseAccount.accountNumber),
        sequence: Number(baseAccount.sequence),
      },
    }
  }

  static accountResponseToAccount(
    response: CosmosAuthV1Beta1QueryPb.QueryAccountResponse,
  ): Account {
    return ChainGrpcAuthTransformer.grpcAccountToAccount(response.account!)
  }

  static accountsResponseToAccounts(
    response: CosmosAuthV1Beta1QueryPb.QueryAccountsResponse,
  ) {
    return {
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination!,
      ),
      accounts: response.accounts.map(
        ChainGrpcAuthTransformer.grpcAccountToAccount,
      ),
    }
  }
}
