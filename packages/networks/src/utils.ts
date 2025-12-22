import { Network } from './types.js'
import { isDevnet, isTestnet } from './network.js'

export const CW20_CODE_IDS_BY_NETWORK = (
  network: Network = Network.Mainnet,
) => {
  if (isTestnet(network)) {
    return ['25']
  }

  return ['28', '5', '42']
}

export const getCw20AdapterContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  if (isDevnet(network)) {
    return 'inj1uukt3kqela4vsllvrqnrgllkna5wn3cm588w6k'
  }

  if (isTestnet(network)) {
    return 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6'
  }

  // mainnet
  return 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk'
}

export const getCw20SwapContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  if (isDevnet(network)) {
    return 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h'
  }

  if (isTestnet(network)) {
    return 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43'
  }

  if (network === Network.Staging) {
    return 'inj12yj3mtjarujkhcp6lg3klxjjfrx2v7v8yswgp9'
  }

  // mainnet
  return 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx'
}

export const getIncentivesContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  if (isDevnet(network)) {
    return ''
  }

  if (isTestnet(network)) {
    return 'inj16twru668nsl7tqzahxd9q033swhr6a5xuslpkt'
  }

  // mainnet
  return ''
}

export const getInjNameRegistryContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  if (isDevnet(network)) {
    return 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa'
  }

  if (isTestnet(network)) {
    return 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa'
  }

  // mainnet
  return 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275'
}

export const getInjNameReverseResolverContractForNetwork = (
  network: Network = Network.Mainnet,
) => {
  if (isDevnet(network)) {
    return 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v'
  }

  if (isTestnet(network)) {
    return 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v'
  }

  return 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu'
}

export const getPeggyGraphQlEndpointForNetwork = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://api.thegraph.com/subgraphs/name/injectivelabsdev/injective-peggo-devnet'
  }

  if (isTestnet(network)) {
    return 'https://api.thegraph.com/subgraphs/name/injectivelabs/injective-peggo-goerli'
  }

  // mainnet
  return 'https://api.thegraph.com/subgraphs/name/injectivelabs/injective-peggo-mainnet'
}

export const getAssetPriceServiceForNetwork = (network: Network): string => {
  if (isDevnet(network)) {
    return 'https://devnet.asset.injective.dev/asset-price/v1'
  }

  if (isTestnet(network)) {
    return 'https://k8s.testnet.asset.injective.network/asset-price/v1'
  }

  // mainnet
  return 'https://k8s.mainnet.asset.injective.network/asset-price/v1'
}
