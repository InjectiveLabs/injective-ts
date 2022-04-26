import {
  Network,
  ExchangeCore,
  ExchangeClient,
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
  const injectiveAddress = 'inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne'
  const authApi = new ExchangeClient.AuthApi(network.sentryGrpcApi)
  const accountDetails = await authApi.account(injectiveAddress)

  /** Limit Order Details */
  const price = 5
  const quantity = 10
  const baseDecimals = 18 // INJ has 18 decimals
  const quoteDecimals = 6 // USDT has 6 decimals
  const marketId =
    '0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0' // INJ/USDT on testnet;
  const subaccountId =
    '0x07dfdf8c15cd738d0d85830127646fb6b2e4cadd000000000000000000000000'
  const orderType = 1 /* Buy, 2 for Sale */

  /** Preparing the transaction */
  const msg = new ExchangeCore.MsgBatchCancelDerivativeOrders({
    marketId,
    subaccountId,
    injectiveAddress,
    orderType,
    price,
    quantity,
    triggerPrice: '0',
    feeRecipient: injectiveAddress,
  })
  const injectiveTx = new InjectiveTx({
    accountDetails,
    tx: {
      msgs: [msg],
      chainId: network.chainId,
      address: injectiveAddress,
    },
  })
  const signature = privateKey.sign(injectiveTx.signDoc.serializeBinary())
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
