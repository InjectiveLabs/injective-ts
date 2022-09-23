import { grpc } from '@improbable-eng/grpc-web'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport'
import { isBrowser, isNode, isReactNative } from './helpers'

export const getGrpcTransport = (): grpc.TransportFactory | undefined => {
  if (isBrowser()) {
    return undefined
  }

  if (isNode()) {
    return NodeHttpTransport()
  }

  if (isReactNative()) {
    return ReactNativeTransport({ withCredentials: true })
  }

  return undefined
}
