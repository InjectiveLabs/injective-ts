import {getNetworkEndpoints, Network} from '@injectivelabs/networks'
import {ChainId} from "@injectivelabs/ts-types";
import {ChainGrpcInjNameApi} from "./ChainGrpcInjNameApi";

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcInjNameApi = new ChainGrpcInjNameApi(endpoints.grpc, ChainId.Testnet)

describe('ChainGrpcInjNameApi', () => {
    test('fetchInjAddress', async () => {
        try {
            const address1 = await chainGrpcInjNameApi.fetchInjAddress('allen.inj')
            expect(address1).toEqual('inj1qnsgpmzlatjczerg8mspzqzl3cwwufp0lupsmj')

            const address2 = await chainGrpcInjNameApi.fetchInjAddress('allen1.inj')
            expect(address2).toEqual('inj1h4rprmdmf9mx6rje7t3zwqsm9f4cf4gzv3ewnc')

            const address3 = await chainGrpcInjNameApi.fetchInjAddress('allen999.inj')
            expect(address3).toBeNull()

            const address4 = await chainGrpcInjNameApi.fetchInjAddress('')
            expect(address4).toBeNull()
        } catch (e) {
            console.error(
                'chainGrpcInjNameApi.fetchInjAddress => ' + (e as any).message,
            )
        }
    })

    test('fetchInjName', async () => {
        try {
            const name1 = await chainGrpcInjNameApi.fetchInjName('inj1qnsgpmzlatjczerg8mspzqzl3cwwufp0lupsmj')
            expect(name1).toEqual('allen.inj')
            const name2 = await chainGrpcInjNameApi.fetchInjName('inj1h4rprmdmf9mx6rje7t3zwqsm9f4cf4gzv3ewnc')
            expect(name2).toBeNull()
            const name3 = await chainGrpcInjNameApi.fetchInjName('inj14x5f0dzmzayh2l7lemtcy4r8utamfz5z2u3lde')
            expect(name3).toBeNull()
            const name4 = await chainGrpcInjNameApi.fetchInjName('')
            expect(name4).toBeNull()
        } catch (e) {
            console.error(
                'chainGrpcInjNameApi.fetchInjName => ' + (e as any).message,
            )
        }

    })
})
