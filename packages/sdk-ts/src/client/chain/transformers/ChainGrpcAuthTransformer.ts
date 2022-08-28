import {
  QueryAccountResponse,
  QueryAccountsResponse,
  // QueryAccountsResponse,
  // QueryAccountResponse,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { uint8ArrayToString } from '../../../utils'
import { Account, AuthModuleParams, EthAccount } from '../types/auth'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuthTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): AuthModuleParams {
    const params = response.getParams()!

    return {
      maxMemoCharacters: params.getMaxMemoCharacters(),
      txSigLimit: params.getTxSigLimit(),
      txSizeCostPerByte: params.getTxSizeCostPerByte(),
      sigVerifyCostEd25519: params.getSigVerifyCostEd25519(),
      sigVerifyCostSecp256k1: params.getSigVerifyCostSecp256k1(),
    }
  }

  static grpcAccountToAccount(ethAccount: Any): Account {
    const account = EthAccount.deserializeBinary(
      ethAccount.getValue() as Uint8Array,
    )
    const baseAccount = account.getBaseAccount()!

    const pubKey = baseAccount.getPubKey()

    return {
      codeHash: uint8ArrayToString(account.getCodeHash()),
      baseAccount: {
        address: baseAccount.getAddress(),
        pubKey: pubKey
          ? {
              key: uint8ArrayToString(pubKey.getValue()),
              typeUrl: pubKey.getTypeUrl(),
            }
          : undefined,
        accountNumber: baseAccount.getAccountNumber(),
        sequence: baseAccount.getSequence(),
      },
    }
  }

  static accountResponseToAccount(response: QueryAccountResponse): Account {
    return ChainGrpcAuthTransformer.grpcAccountToAccount(response.getAccount()!)
  }

  static accountsResponseToAccounts(response: QueryAccountsResponse) {
    return {
      pagination: grpcPaginationToPagination(response.getPagination()!),
      accounts: response
        .getAccountsList()
        .map(ChainGrpcAuthTransformer.grpcAccountToAccount),
    }
  }
}
