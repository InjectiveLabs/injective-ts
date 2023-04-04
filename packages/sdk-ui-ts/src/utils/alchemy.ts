export const getKeyFromRpcUrl = (rpcUrl: string) => {
  if (!rpcUrl.includes('alchemyapi.io')) {
    return rpcUrl
  }

  const [key] = rpcUrl.split('/').reverse()

  return key
}
