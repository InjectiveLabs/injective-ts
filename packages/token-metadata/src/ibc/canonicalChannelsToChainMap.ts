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
}

export default legacyCanonicalChannels
