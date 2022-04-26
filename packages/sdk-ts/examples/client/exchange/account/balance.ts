import { PrivateKey, ExchangeClient } from '@injectivelabs/sdk-ts'
import { Network, getNetworkInfo } from '@injectivelabs/networks'

/** Fetching subaccount balance for a particular denom */
;(async () => {
  const network = getNetworkInfo(Network.TestnetK8s)
  const privateKey = PrivateKey.fromPrivateKey(
    '241824dffdda13c05f5a0de30d3ac7511849005585d89f7a045368cded0e6271',
  )
  const address = privateKey.toAddress()
  const defaultSubaccountId = address.getSubaccountId()
  const denom = 'inj'

  console.log(network.exchangeApi)
  const exchangeClient = new ExchangeClient.ExchangeGrpcClient(
    network.exchangeApi,
  )
  console.log(
    await exchangeClient.accountApi.subaccountBalance(
      defaultSubaccountId,
      denom,
    ),
  )
})()
