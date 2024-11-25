import * as grpc from '@injectivelabs/grpc-web'
import { NodeHttpTransport } from '@injectivelabs/grpc-web-node-http-transport'
import { ReactNativeTransport } from '@injectivelabs/grpc-web-react-native-transport'
import { isNode, isReactNative } from './helpers.js'

export const getGrpcTransport = (): grpc.grpc.TransportFactory => {
  if (isReactNative()) {
    return ReactNativeTransport({ withCredentials: true })
  }

  if (isNode()) {
    return NodeHttpTransport()
  }

  return grpc.grpc.CrossBrowserHttpTransport({ withCredentials: false })
}
