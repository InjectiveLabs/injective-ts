import {
    Namespace,
    PermissionsModuleParams,
    AddressRoles,
    Voucher,
    GrpcPermissionsAddressRoles,
    GrpcPermissionsNamespace,
    GrpcPermissionVoucher,
} from '../types/permissions';
import { InjectivePermissionsV1Beta1Query } from '@injectivelabs/core-proto-ts';

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPermissionsTransformer {
    static moduleParamsResponseToModuleParams(
        response: InjectivePermissionsV1Beta1Query.QueryParamsResponse,
    ): PermissionsModuleParams {
        const params = response.params!

        return {
            wasmHookQueryMaxGas: params.wasmHookQueryMaxGas,
        }
    }
}
