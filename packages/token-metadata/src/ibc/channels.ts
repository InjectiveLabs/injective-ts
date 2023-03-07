export enum CanonicalChannelToDestinationChannel {
  CosmosHub = 'channel-1',
  Evmos = 'channel-83',
  Osmosis = 'channel-8',
  Terra = 'channel-4',
  Axelar = 'channel-84',
  Persistence = 'channel-82',
  Chihuahua = 'channel-76',
  SecretNetwork = 'channel-88',
  Juno = 'channel-78',
  Stride = 'channel-89',
  Crescent = 'channel-23',
  Sommelier = 'channel-93',
}

/**
 * We can't use this approach because the channels can overlap between chains
 * For example for Secret -> Injective we have channel-23 and we have the same
 * for Crescent -> Injective.
 * @deprecated - use  canonicalChannelsToChainMapFromInjective or canonicalChannelsToChainMapToInjective
 * */
const legacyCanonicalChannels = {
  'channel-1': { chainA: 'Injective', chainB: 'CosmosHub' },
  'channel-83': { chainA: 'Injective', chainB: 'Evmos' },
  'channel-8': { chainA: 'Injective', chainB: 'Osmosis' },
  'channel-4': { chainA: 'Injective', chainB: 'Terra' },
  'channel-84': { chainA: 'Injective', chainB: 'Axelar' },
  'channel-82': { chainA: 'Injective', chainB: 'Persistence' },
  'channel-76': { chainA: 'Injective', chainB: 'Chihuahua' },
  'channel-88': { chainA: 'Injective', chainB: 'Secret Network' },
  'channel-78': { chainA: 'Injective', chainB: 'Juno' },
  'channel-89': { chainA: 'Injective', chainB: 'Stride' },
  'channel-220': { chainA: 'CosmosHub', chainB: 'Injective' },
  'channel-122': { chainA: 'Osmosis', chainB: 'Injective' },
  'channel-17': { chainA: 'Terra', chainB: 'Injective' },
  'channel-41': { chainA: 'Persistence', chainB: 'Injective' },
  'channel-12': { chainA: 'Chihuahua', chainB: 'Injective' },
  'channel-23': { chainA: 'Secret Network', chainB: 'Injective' },
  'channel-59': { chainA: 'Juno', chainB: 'Injective' },
  'channel-6': { chainA: 'Stride', chainB: 'Injective' },
}

export const canonicalChannelsToChainMapFromInjective = {
  'channel-1': { chainA: 'Injective', chainB: 'CosmosHub' },
  'channel-83': { chainA: 'Injective', chainB: 'Evmos' },
  'channel-8': { chainA: 'Injective', chainB: 'Osmosis' },
  'channel-4': { chainA: 'Injective', chainB: 'Terra' },
  'channel-84': { chainA: 'Injective', chainB: 'Axelar' },
  'channel-82': { chainA: 'Injective', chainB: 'Persistence' },
  'channel-76': { chainA: 'Injective', chainB: 'Chihuahua' },
  'channel-88': { chainA: 'Injective', chainB: 'Secret Network' },
  'channel-78': { chainA: 'Injective', chainB: 'Juno' },
  'channel-89': { chainA: 'Injective', chainB: 'Stride' },
  'channel-23': { chainA: 'Injective', chainB: 'Crescent' },
  'channel-13': { chainA: 'Injective', chainB: '' },
  'channel-93': { chainA: 'Injective', chainB: 'Sommelier' },
  'channel-99': { chainA: 'Injective', chainB: 'Canto' },
  'channel-104': { chainA: 'Injective', chainB: 'Terra2' },
  'channel-105': { chainA: 'Injective', chainB: 'Terra2' },
}

export const canonicalChannelsToChainMapToInjective = {
  'channel-220': { chainA: 'CosmosHub', chainB: 'Injective' },
  'channel-122': { chainA: 'Osmosis', chainB: 'Injective' },
  'channel-17': { chainA: 'Terra', chainB: 'Injective' },
  'channel-41': { chainA: 'Persistence', chainB: 'Injective' },
  'channel-12': { chainA: 'Chihuahua', chainB: 'Injective' },
  'channel-23': { chainA: 'Secret Network', chainB: 'Injective' },
  'channel-59': { chainA: 'Juno', chainB: 'Injective' },
  'channel-6': { chainA: 'Stride', chainB: 'Injective' },
  'channel-90': { chainA: 'Crescent', chainB: 'Injective' },
  'channel-1': { chainA: 'Sommelier', chainB: 'Injective' },
  'channel-8': { chainA: 'Canto', chainB: 'Injective' },
  'channel-91': { chainA: 'Terra2', chainB: 'Injective' },
  'channel-92': { chainA: 'Terra2', chainB: 'Injective' },
}

export default legacyCanonicalChannels

export const canonicalChannelIds = [
  'channel-1',
  'channel-4',
  'channel-5',
  'channel-6',
  'channel-8',
  'channel-13',
  'channel-74',
  'channel-76',
  'channel-78',
  'channel-82',
  'channel-83',
  'channel-84',
  'channel-88',
  'channel-89',
  'channel-90',
  'channel-93',
  'channel-99',
  'channel-104',
  'channel-105',
]

export const channelIbcDenomToBaseDenomMap = {
  [CanonicalChannelToDestinationChannel.Osmosis]: {
    inj: 'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
  },
  [CanonicalChannelToDestinationChannel.Crescent]: {
    inj: 'ibc/5A76568E079A31FA12165E4559BA9F1E9D4C97F9C2060B538C84DCD503815E30',
  },
  [CanonicalChannelToDestinationChannel.Persistence]: {
    inj: 'ibc/D64E84758BCA42602C27E9ED2DB8F4EFDAE6A1E311CF404B516D45FEDF319D73',
  },
}
