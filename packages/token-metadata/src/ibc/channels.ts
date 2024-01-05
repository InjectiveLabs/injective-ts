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
  Crescent = 'channel-90',
  Sommelier = 'channel-93',
  Migaloo = 'channel-102',
  Nois = 'channel-138',
  Kava = 'channel-143',
  Oraichain = 'channel-147',
  Noble = 'channel-148',
  Celestia = 'channel-152',
  Kujira = 'channel-98',
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

/**
 * @deprecated - use  canonicalChannelsToChainList
 **/
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
  'channel-102': { chainA: 'Injective', chainB: 'Migaloo' },
  'channel-104': { chainA: 'Injective', chainB: 'Terra2' },
  'channel-105': { chainA: 'Injective', chainB: 'Terra2' },
  'channel-143': { chainA: 'Injective', chainB: 'Kava' },
}

export const canonicalChannelsToChainList = [
  { channelId: 'channel-220', chainA: 'CosmosHub', chainB: 'Injective' },
  { channelId: 'channel-122', chainA: 'Osmosis', chainB: 'Injective' },
  { channelId: 'channel-17', chainA: 'Terra', chainB: 'Injective' },
  { channelId: 'channel-41', chainA: 'Persistence', chainB: 'Injective' },
  { channelId: 'channel-12', chainA: 'Chihuahua', chainB: 'Injective' },
  { channelId: 'channel-23', chainA: 'Secret Network', chainB: 'Injective' },
  { channelId: 'channel-59', chainA: 'Juno', chainB: 'Injective' },
  { channelId: 'channel-6', chainA: 'Stride', chainB: 'Injective' },
  { channelId: 'channel-90', chainA: 'Crescent', chainB: 'Injective' },
  { channelId: 'channel-1', chainA: 'Sommelier', chainB: 'Injective' },
  { channelId: 'channel-8', chainA: 'Canto', chainB: 'Injective' },
  { channelId: 'channel-91', chainA: 'Terra2', chainB: 'Injective' },
  { channelId: 'channel-92', chainA: 'Terra2', chainB: 'Injective' },
  { channelId: 'channel-3', chainA: 'Migaloo', chainB: 'Injective' },
  { channelId: 'channel-122', chainA: 'Kava', chainB: 'Injective' },
  { channelId: 'channel-146', chainA: 'Oraichain', chainB: 'Injective' },
  { channelId: 'channel-31', chainA: 'Noble', chainB: 'Injective' },
  { channelId: 'channel-7', chainA: 'Celestia', chainB: 'Injective' },
  { channelId: 'channel-54', chainA: 'Kujira', chainB: 'Injective' },
  { channelId: 'channel-1', chainA: 'Injective', chainB: 'CosmosHub' },
  { channelId: 'channel-83', chainA: 'Injective', chainB: 'Evmos' },
  { channelId: 'channel-8', chainA: 'Injective', chainB: 'Osmosis' },
  { channelId: 'channel-4', chainA: 'Injective', chainB: 'Terra' },
  { channelId: 'channel-84', chainA: 'Injective', chainB: 'Axelar' },
  { channelId: 'channel-82', chainA: 'Injective', chainB: 'Persistence' },
  { channelId: 'channel-76', chainA: 'Injective', chainB: 'Chihuahua' },
  { channelId: 'channel-88', chainA: 'Injective', chainB: 'Secret Network' },
  { channelId: 'channel-78', chainA: 'Injective', chainB: 'Juno' },
  { channelId: 'channel-89', chainA: 'Injective', chainB: 'Stride' },
  { channelId: 'channel-23', chainA: 'Injective', chainB: 'Crescent' },
  { channelId: 'channel-13', chainA: 'Injective', chainB: '' },
  { channelId: 'channel-93', chainA: 'Injective', chainB: 'Sommelier' },
  { channelId: 'channel-98', chainA: 'Injective', chainB: 'Kujira' },
  { channelId: 'channel-99', chainA: 'Injective', chainB: 'Canto' },
  { channelId: 'channel-102', chainA: 'Injective', chainB: 'Migaloo' },
  { channelId: 'channel-104', chainA: 'Injective', chainB: 'Terra2' },
  { channelId: 'channel-105', chainA: 'Injective', chainB: 'Terra2' },
  { channelId: 'channel-138', chainA: 'Injective', chainB: 'Nois' },
  { channelId: 'channel-140', chainA: 'Injective', chainB: 'Nois' },
  { channelId: 'channel-143', chainA: 'Injective', chainB: 'Kava' },
  { channelId: 'channel-147', chainA: 'Injective', chainB: 'Oraichain' },
  { channelId: 'channel-148', chainA: 'Injective', chainB: 'Noble' },
  { channelId: 'channel-152', chainA: 'Injective', chainB: 'Celestia' },
  
]

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
  'channel-102',
  'channel-104',
  'channel-105',
  'channel-138',
  'channel-140',
  'channel-143',
  'channel-147',
  'channel-148',
  'channel-152',
  'channel-98',
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
  [CanonicalChannelToDestinationChannel.Stride]: {
    inj: 'ibc/A7454562FF29FE068F42F9DE4805ABEF54F599D1720B345D6518D9B5C64EA6D2',
  },
  [CanonicalChannelToDestinationChannel.Migaloo]: {
    inj: 'ibc/1C2D8505A29823310B4484E4C63CFDCB08C0D3B57537A615A45F4E5D42CDC789',
  },
}
