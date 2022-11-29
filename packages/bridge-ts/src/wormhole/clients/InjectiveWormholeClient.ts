import { getEndpointsForNetwork, Network } from '@injectivelabs/networks'
import {
  isBrowser,
  createTransactionAndCosmosSignDocForAddressAndMsg,
  TxGrpcClient,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToUint8Array,
  getSignedVAAWithRetry,
  getForeignAssetSolana,
  CHAINS,
  transferFromInjective,
  parseSequenceFromLogInjective,
  getEmitterAddressInjective,
  redeemOnSolana,
} from '@certusone/wormhole-sdk'
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import {
  Connection,
  PublicKey as SolanaPublicKey,
  Transaction,
} from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { ChainId } from '@injectivelabs/ts-types'
import { WORMHOLE_CHAINS } from '../constants'
import {
  InjectiveProviderArgs,
  InjectiveTransferMsgArgs,
  TransferMsgArgs,
} from '../types'
import { getSolanaContractAddresses } from '../utils'
import { WormholeClient } from '../WormholeClient'

export class InjectiveWormholeClient extends WormholeClient {
  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    wormholeRpcUrl?: string
  }) {
    super({ network, wormholeRpcUrl })
  }

  // eslint-disable-next-line class-methods-use-this
  async attestFromInjectiveToSolana(
    _args: Omit<TransferMsgArgs, 'address' | 'amount'>,
    _provider: BaseMessageSignerWalletAdapter,
  ) {
    throw new GeneralException(new Error(`Not implemented yet!`))
  }

  async transferFromInjectiveToSolana({
    args,
    provider,
    solanaOptions,
  }: {
    args: Omit<
      InjectiveTransferMsgArgs,
      'recipient'
    > /* The recipient is taken from the solanaOptions */
    provider: InjectiveProviderArgs
    solanaOptions: {
      provider: BaseMessageSignerWalletAdapter
      host: string
    }
  }) {
    const { network, wormholeRpcUrl } = this
    const { amount } = args
    const endpoints = getEndpointsForNetwork(network)
    const solanaPubKey =
      solanaOptions.provider.publicKey || new SolanaPublicKey('')

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!solanaPubKey) {
      throw new GeneralException(
        new Error(`Please provide solanaOptions.provider`),
      )
    }

    const { contractAddresses, solanaContractAddresses } =
      getSolanaContractAddresses(network)

    const connection = new Connection(solanaOptions.host, 'confirmed')
    const solanaMintKey = new SolanaPublicKey(
      (await getForeignAssetSolana(
        connection,
        solanaContractAddresses.token_bridge,
        CHAINS.injective,
        tryNativeToUint8Array(args.tokenAddress, WORMHOLE_CHAINS.injective),
      )) || '',
    )
    const recipient = await getAssociatedTokenAddress(
      solanaMintKey,
      solanaPubKey,
    )

    // create the associated token account if it doesn't exist
    const associatedAddressInfo = await connection.getAccountInfo(recipient)

    if (!associatedAddressInfo) {
      const transaction = new Transaction().add(
        await createAssociatedTokenAccountInstruction(
          solanaPubKey,
          new SolanaPublicKey(recipient),
          solanaPubKey,
          solanaMintKey,
        ),
      )

      const { blockhash } = await connection.getLatestBlockhash()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = solanaPubKey

      const signed = await solanaOptions.provider.signTransaction(transaction)
      const transactionId = await connection.sendRawTransaction(
        signed.serialize(),
      )

      await connection.confirmTransaction(transactionId)
    }

    const messages = await transferFromInjective(
      args.injectiveAddress,
      contractAddresses.token_bridge,
      args.tokenAddress,
      amount,
      WORMHOLE_CHAINS.solana,
      tryNativeToUint8Array(solanaPubKey.toString(), WORMHOLE_CHAINS.solana),
    )

    const txGrpcClient = new TxGrpcClient(endpoints.sentryGrpcApi)
    const { txRaw, cosmosSignDoc } =
      await createTransactionAndCosmosSignDocForAddressAndMsg({
        chainId: args.chainId,
        message: messages,
        address: args.injectiveAddress,
        endpoint: endpoints.sentryHttpApi,
        memo: 'Wormhole Transfer From Injective to Solana',
        pubKey: await provider.getPubKey(),
      })

    const directSignResponse = (await provider.signCosmosTransaction(
      {
        txRaw,
        accountNumber: cosmosSignDoc.accountNumber.toNumber(),
        chainId: args.chainId,
      },
      args.injectiveAddress,
    )) as any

    const txHash = await provider.sendTransaction(directSignResponse, {
      chainId: args.chainId as ChainId,
      address: args.injectiveAddress,
    })
    const txResponse = await txGrpcClient.fetchTx(txHash)

    const sequence = parseSequenceFromLogInjective(txResponse)
    const emitterAddress = await getEmitterAddressInjective(
      solanaContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.solana,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    return redeemOnSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      solanaPubKey,
      signedVAA,
    )
  }
}
