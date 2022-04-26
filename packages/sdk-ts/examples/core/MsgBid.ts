import {
  Network,
  AuctionCore,
  ChainClient,
  PrivateKey,
  InjectiveTx,
  TxService,
  Address,
} from '@injectivelabs/sdk-ts'

/** MsgBid Example */
import { BigNumberInBase } from '@injectivelabs/utils'
;(async () => {
  const network = Network.testnet()
  const privateKey = PrivateKey.fromPrivateKey(
    'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3',
  )
  const address = Address.fromHex(privateKey.toHex())
  const injectiveAddress = address.toBech32()

  /** Account Details **/
  const accountDetails = await new ChainClient.AuthApi(
    network.sentryGrpcApi,
  ).account(injectiveAddress)

  /** Prepare the Message */
  const auctionModuleState = await new ChainClient.AuctionApi(
    network.sentryGrpcApi,
  ).moduleState()
  const latestRound = auctionModuleState.getState()?.getAuctionRound()
  const round = latestRound || 1
  const msg = new AuctionCore.MsgBid({
    round: round,
    injectiveAddress: injectiveAddress,
    amount: {
      amount: new BigNumberInBase(100).toWei().toFixed(),
      denom: 'inj',
    },
  })

  /** Prepare the Transaction **/
  const injectiveTx = new InjectiveTx({
    accountDetails,
    tx: {
      msgs: [msg],
      chainId: network.chainId,
      address: injectiveAddress,
    },
  })

  /** Sign transaction */
  const signature = await privateKey.sign(injectiveTx.signDoc.serializeBinary())

  /** Calculate hash of the transaction */
  const txRaw = injectiveTx.toTxRaw(signature)
  console.log(`Transaction Hash: ${InjectiveTx.getTxHash(txRaw)}`)

  const txService = new TxService({ txRaw, endpoint: network.sentryGrpcApi })

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
