import { createWalletClient, custom, Account } from 'viem'
import { mainnet } from 'viem/chains'

export const getCosmosSigner = async (chainID: string) => {
  const key = await window.keplr?.getKey(chainID)
  if (!key) throw new Error('Keplr not installed or chain not added')

  return key.isNanoLedger
    ? window.keplr?.getOfflineSignerOnlyAmino(chainID)
    : window.keplr?.getOfflineSigner(chainID)
}

export const getEVMSigner = async () => {
  const ethereum = window.ethereum
  if (!ethereum) throw new Error('MetaMask not installed')
  const accounts = (await ethereum.request({
    method: 'eth_requestAccounts',
  })) as Account[]
  const account = accounts?.[0]
  if (!account) throw new Error('No accounts found')
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: custom(window.ethereum),
  })
  return client
}
