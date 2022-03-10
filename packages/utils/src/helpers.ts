import { ComposerResponse, Web3GatewayMessage } from '@injectivelabs/ts-types'
import snakeCaseKeys from 'snakecase-keys'

export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))

export const isServerSide = () => typeof window === 'undefined'

export const getWeb3GatewayMessage = <T>(
  message: T,
  type: string,
): Web3GatewayMessage<T> =>
  ({
    ...snakeCaseKeys(message),
    '@type': type,
  } as Web3GatewayMessage<T>)

export const mapMultipleComposerResponseMessages = <T, R>(
  messages: ComposerResponse<T, R>[],
) =>
  messages.reduce(
    (
      messages: {
        web3GatewayMessage: R[]
        directBroadcastMessage: { type: string; message: T }[]
      },
      message,
    ) => {
      const web3GatewayMessage = Array.isArray(message.web3GatewayMessage)
        ? message.web3GatewayMessage
        : [message.web3GatewayMessage]

      const directBroadcastMessage = Array.isArray(
        message.directBroadcastMessage,
      )
        ? message.directBroadcastMessage
        : [message.directBroadcastMessage]

      return {
        web3GatewayMessage: [
          ...messages.web3GatewayMessage,
          ...web3GatewayMessage,
        ],
        directBroadcastMessage: [
          ...messages.directBroadcastMessage,
          ...directBroadcastMessage,
        ],
      }
    },
    {
      web3GatewayMessage: [] as R[],
      directBroadcastMessage: [] as { type: string; message: T }[],
    },
  )
