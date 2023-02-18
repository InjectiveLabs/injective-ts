import {
  canonicalChannelIds,
  canonicalChannelsToChainMapFromInjective,
} from './channels'
import { IbcToken, Token, TokenType } from '../types'

export const isIbcTokenCanonical = (token: IbcToken) => {
  const { denom } = token

  if (!denom.startsWith('ibc/') || !token.ibc) {
    return false
  }

  const pathParts = token.ibc.path.replace('transfer/', '').split('/')

  /** More than one channelId */
  if (pathParts.length > 1) {
    return false
  }

  const [channelId] = pathParts

  return canonicalChannelIds.includes(channelId)
}

export const getChannelIdFromPath = (path: string) => {
  const pathParts = path.replace('transfer/', '').split('/')
  const [channelId] = pathParts

  return channelId
}

export const getIbcDestinationChain = ({
  channelPaths,
  channel,
  index,
  token,
}: {
  channelPaths: string[]
  channel: string
  index: number
  token: Token
}) => {
  if (token.tokenType !== TokenType.Ibc) {
    return ''
  }

  const canonicalChannel =
    channel as keyof typeof canonicalChannelsToChainMapFromInjective

  if (canonicalChannelsToChainMapFromInjective[canonicalChannel]) {
    return canonicalChannelsToChainMapFromInjective[canonicalChannel].chainB
  }

  if (index === channelPaths.length - 1) {
    return token.name
  }

  return ''
}

export const formatNonCanonicalIbcTokenName = (token: IbcToken): string => {
  const formattedDenomTrace = token.ibc.channelId.replaceAll('transfer/', '')

  const channelToLastChain = formattedDenomTrace.split('/').shift()

  const lastChain = canonicalChannelsToChainMapFromInjective[
    channelToLastChain as keyof typeof canonicalChannelsToChainMapFromInjective
  ]
    ? canonicalChannelsToChainMapFromInjective[
        channelToLastChain as keyof typeof canonicalChannelsToChainMapFromInjective
      ].chainB
    : 'Unknown'

  return `${token.ibc.baseDenom.toUpperCase()}-${lastChain.toLowerCase()}-${channelToLastChain}`
}
