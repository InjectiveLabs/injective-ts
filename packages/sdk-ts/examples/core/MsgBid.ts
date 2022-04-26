import {
  Network,
  ExchangeCore,
  ChainClient,
  PrivateKey,
  InjectiveTx,
  TxService,
} from '@injectivelabs/sdk-ts'

/** MsgBid Example */
;(async () => {
  const network = Network.testnet()
  const privateKey = PrivateKey.fromPrivateKey(
    'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3',
  )

  /** Account Details **/
  const injectiveAddress = privateKey.toHex()
  const authApi = new ChainClient.AuthApi(network.sentryGrpcApi)
  const accountDetails = await authApi.account(injectiveAddress)

  /** Prepare the Transaction **/
  const injectiveTx = new InjectiveTx({
    accountDetails,
    tx: {
      msgs: [msg],
      chainId: network.chainId,
      address: injectiveAddress,
    },
  })

  const signature = await privateKey.sign(injectiveTx.signDoc.serializeBinary())
  const txRaw = injectiveTx.toTxRaw(signature)
  console.log(`Transaction Hash: ${InjectiveTx.getTxHash(txRaw)}`)

  /** Simulating and Broadcasting a transaction */
  const txService = new TxService({ txRaw, endpoint: network.sentryGrpcApi })
  const simulationResponse = await txService.simulate()
  console.log(
    `Transaction simulation response: ${JSON.stringify(
      simulationResponse.gasInfo,
    )}`,
  )

  const txResponse = await txService.broadcast()
  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`,
  )
})()
