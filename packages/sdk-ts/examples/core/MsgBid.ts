import {
  AuctionCore,
  ChainClient,
  PrivateKey,
  BaseAccount,
  TxInjective,
  TxService,
} from '@injectivelabs/sdk-ts'
import { Network, getNetworkInfo } from '@injectivelabs/networks'
import { BigNumberInBase } from '@injectivelabs/utils'

/** MsgBid Example */
;(async () => {
  const network = getNetworkInfo(Network.TestnetK8s)
  const privateKey = PrivateKey.fromPrivateKey(
    '241824dffdda13c05f5a0de30d3ac7511849005585d89f7a045368cded0e6271',
  )
  const injectiveAddress = privateKey.toBech32()

  /** Account Details **/
  const accountDetails = await new ChainClient.AuthRestApi(
    network.sentryHttpApi,
  ).account(injectiveAddress)
  const baseAccount = BaseAccount.fromRestApi(accountDetails)

  /** Prepare the Message */
  const auctionModuleState = await new ChainClient.AuctionApi(
    network.sentryGrpcApi,
  ).moduleState()
  const latestRound = auctionModuleState.getState()?.getAuctionRound()
  const round = latestRound || 1
  const bid = 200 /** 100 INJ */
  const amount = {
    amount: new BigNumberInBase(bid).toWei().toFixed(),
    denom: 'inj',
  }
  const msg = new AuctionCore.MsgBid({
    round,
    amount,
    injectiveAddress,
  })

  /** Prepare the Transaction **/
  const txInjective = new TxInjective({
    baseAccount,
    msgs: [msg],
    chainId: network.chainId,
    address: injectiveAddress,
  })

  /** Sign transaction */
  const signature = await privateKey.sign(txInjective.signBytes)
  const signedTxInjective = txInjective.withSignature(signature)

  /** Calculate hash of the transaction */
  console.log(`Transaction Hash: ${signedTxInjective.getTxHash()}`)

  const txService = new TxService({
    txInjective: signedTxInjective,
    endpoint: network.sentryGrpcApi,
  })

  /** Simulate transaction */
  const simulationResponse = await txService.simulate()
  console.log(
    `Transaction simulation response: ${JSON.stringify(
      simulationResponse.gasInfo,
    )}`,
  )

  /** Broadcast transaction */
  const txResponse = await txService.broadcast()
  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`,
  )
})()
