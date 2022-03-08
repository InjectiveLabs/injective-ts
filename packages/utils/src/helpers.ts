import { Web3GatewayMessage } from '@injectivelabs/ts-types'
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
