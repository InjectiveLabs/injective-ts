import type { Keplr } from '@keplr-wallet/types'
import { ChainId } from '@injectivelabs/ts-types'
import { PublicKey } from '@injectivelabs/sdk-ts'
import { Wallet, capitalize } from '@injectivelabs/wallet-base'
import { CosmosWalletException } from '@injectivelabs/exceptions'
import { CosmosWallet } from './../wallet.js'
import { cosmosWallets } from './../data/index.js'

export const isCosmosWalletInstalled = (wallet: Wallet) => {
  const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
    leap?: Keplr
    keplr?: Keplr
    ninji?: Keplr
  }

  switch (wallet) {
    case Wallet.Keplr:
      return $window.keplr !== undefined
    case Wallet.Ninji:
      return $window.ninji !== undefined
    case Wallet.Leap:
      return $window.leap !== undefined
    default:
      return false
  }
}

export const confirmCosmosAddress = async ({
  wallet,
  chainId,
  injectiveAddress,
}: {
  wallet: Wallet
  chainId: ChainId
  injectiveAddress: string
}) => {
  if (!cosmosWallets.includes(wallet)) {
    throw new CosmosWalletException(
      new Error(`Cosmos Wallet for ${capitalize(wallet)} is not supported.`),
    )
  }

  const keplr = new CosmosWallet({ chainId, wallet })
  const key = await keplr.getKey()
  const publicKey = PublicKey.fromBase64(
    Buffer.from(key.pubKey).toString('base64'),
  )

  const { address: derivedAddress } = publicKey.toAddress()

  if (derivedAddress !== injectiveAddress) {
    throw new CosmosWalletException(
      new Error(
        `Connected ${capitalize(
          wallet,
        )} address is wrong. Please update Injective on ${capitalize(wallet)}.`,
      ),
    )
  }
}
