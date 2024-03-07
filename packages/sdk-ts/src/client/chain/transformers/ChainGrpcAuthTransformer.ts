import { grpcPaginationToPagination } from '../../../utils/pagination'
import { uint8ArrayToString } from '../../../utils'
import { Account, AuthModuleParams } from '../types/auth'
import {
  GoogleProtobufAny,
  CosmosAuthV1Beta1Query,
  InjectiveTypesV1Beta1Account,
  InjectiveCryptoV1Beta1Ethsecp256k1Keys,
} from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosAuthV1Beta1Query.QueryParamsResponse,
  ): AuthModuleParams {
    const params = response.params!

    return {
      maxMemoCharacters: parseInt(params.maxMemoCharacters, 10),
      txSigLimit: parseInt(params.txSigLimit, 10),
      txSizeCostPerByte: parseInt(params.txSizeCostPerByte, 10),
      sigVerifyCostEd25519: parseInt(params.sigVerifyCostEd25519, 10),
      sigVerifyCostSecp256k1: parseInt(params.sigVerifyCostSecp256k1, 10),
    }
  }

  static grpcAccountToAccount(ethAccount: GoogleProtobufAny.Any): Account {
    const account = InjectiveTypesV1Beta1Account.EthAccount.decode(
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
                InjectiveCryptoV1Beta1Ethsecp256k1Keys.PubKey.decode(
                  pubKey.value,
                ).key,
              ).toString('base64'),
              typeUrl: pubKey.typeUrl,
            }
          : undefined,
        accountNumber: parseInt(baseAccount.accountNumber, 10),
        sequence: parseInt(baseAccount.sequence, 10),
      },
    }
  }

  static accountResponseToAccount(
    response: CosmosAuthV1Beta1Query.QueryAccountResponse,
  ): Account {
    return ChainGrpcAuthTransformer.grpcAccountToAccount(response.account!)
  }

  static accountsResponseToAccounts(
    response: CosmosAuthV1Beta1Query.QueryAccountsResponse,
  ) {
    return {
      pagination: grpcPaginationToPagination(response.pagination!),
      accounts: response.accounts.map(
        ChainGrpcAuthTransformer.grpcAccountToAccount,
      ),
    }
  }
}
