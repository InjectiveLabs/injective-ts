import * as InjectivePermissionsV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/query_pb'
import * as InjectivePermissionsV1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/params_pb'
import { ChainGrpcPermissionsTransformer } from './ChainGrpcPermissionsTransformer.js'

describe('ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams', () => {
  it('maps both gas params (ownerBlacklistQueryMaxGas is new in chain v1.21)', () => {
    expect(
      ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
        InjectivePermissionsV1Beta1QueryPb.QueryParamsResponse.create({
          params: InjectivePermissionsV1Beta1ParamsPb.Params.create({
            contractHookMaxGas: 50000n,
            ownerBlacklistQueryMaxGas: 200000n,
          }),
        }),
      ),
    ).toStrictEqual({
      wasmHookQueryMaxGas: '50000',
      ownerBlacklistQueryMaxGas: '200000',
    })
  })

  it('throws when the response has no params', () => {
    expect(() =>
      ChainGrpcPermissionsTransformer.moduleParamsResponseToModuleParams(
        InjectivePermissionsV1Beta1QueryPb.QueryParamsResponse.create(),
      ),
    ).toThrow('Params not found in response')
  })
})
