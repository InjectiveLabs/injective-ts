import { coins } from '@cosmjs/amino'
import { PrivateKey } from '../accounts'
import { InjectiveDirectEthSecp256k1Wallet } from '../accounts/signers'
import { InjectiveOfflineSigner } from '../accounts/signers/types'
import { SigningStargateClient } from './SigningStargateClient'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { OfflineSigner } from '@cosmjs/proto-signing'

describe('SigningStargateClient', () => {
  it('can sign and broadcast a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )
    const network = Network.Devnet
    const endpoints = getNetworkEndpoints(network)
    const privateKeyHex = privateKey.toPrivateKeyHex()
    const privateKeyHexWithoutPrefix = privateKeyHex.startsWith('0x')
      ? privateKeyHex.slice(2)
      : privateKeyHex

    const privateKeyBuffer = Buffer.from(privateKeyHexWithoutPrefix, 'hex')

    const wallet = (await InjectiveDirectEthSecp256k1Wallet.fromKey(
      privateKeyBuffer,
    )) as InjectiveOfflineSigner

    const client = await SigningStargateClient.connectWithSigner(
      endpoints.rpc as string,
      wallet as OfflineSigner,
    )

    const msgSend = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: privateKey.toAddress().toBech32(),
        toAddress: privateKey.toAddress().toBech32(),
        amount: coins(1, 'inj'),
      },
    }

    const fee = {
      amount: [{ denom: 'inj', amount: '2000' }],
      gas: '200000',
    }

    const response = await client.signAndBroadcast(
      privateKey.toBech32(),
      [msgSend],
      fee,
    )

    expect(response.code).toEqual(0)
    expect(response.transactionHash).toBeDefined()
  })

  it('can send coins', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )
    const network = Network.Devnet
    const endpoints = getNetworkEndpoints(network)
    const privateKeyHex = privateKey.toPrivateKeyHex()
    const privateKeyHexWithoutPrefix = privateKeyHex.startsWith('0x')
      ? privateKeyHex.slice(2)
      : privateKeyHex

    const privateKeyBuffer = Buffer.from(privateKeyHexWithoutPrefix, 'hex')

    const wallet = (await InjectiveDirectEthSecp256k1Wallet.fromKey(
      privateKeyBuffer,
    )) as InjectiveOfflineSigner

    const client = await SigningStargateClient.connectWithSigner(
      endpoints.rpc as string,
      wallet as OfflineSigner,
    )

    const fee = {
      amount: [{ denom: 'inj', amount: '2000' }],
      gas: '200000',
    }

    const response = await client.sendTokens(
      privateKey.toBech32(), //sender
      privateKey.toBech32(), // recipient,
      coins(1, 'inj'),
      fee,
    )

    expect(response.code).toEqual(0)
    expect(response.transactionHash).toBeDefined()
  })
})
