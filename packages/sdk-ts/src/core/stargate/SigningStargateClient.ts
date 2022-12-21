/*
import {
  HttpEndpoint,
  SigningStargateClient as CosmjsSigningStargateClient,
  SigningStargateClientOptions,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { InjectiveOfflineSigner } from '../accounts/signers/types'

export class SigningStargateClient extends CosmjsSigningStargateClient {
  private readonly offlineSigner: InjectiveOfflineSigner

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: InjectiveOfflineSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<SigningStargateClient> {
    const tmClient = await Tendermint34Client.connect(endpoint)

    return new SigningStargateClient(tmClient, signer, options)
  }

  public static async offline(
    signer: InjectiveOfflineSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<SigningStargateClient> {
    return new SigningStargateClient(undefined, signer, options)
  }
}
*/
