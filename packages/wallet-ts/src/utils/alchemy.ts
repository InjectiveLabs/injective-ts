export const getKeyFromRpcUrl = (rpcUrl: string) => {
  if (!rpcUrl.includes('alchemyapi.io') && !rpcUrl.includes('alchemy.com')) {
    return rpcUrl
  }

  const [key] = rpcUrl.split('/').reverse()

  return key
}
