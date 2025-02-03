import * as grpcPkg from '@injectivelabs/grpc-web'
import { NodeHttpTransport } from '@injectivelabs/grpc-web-node-http-transport'
import { ReactNativeTransport } from '@injectivelabs/grpc-web-react-native-transport'
import { isNode, isReactNative } from './helpers.js'

const grpc: typeof grpcPkg.grpc =
  grpcPkg.grpc ??
  (grpcPkg as unknown as { default: { grpc: typeof grpcPkg.grpc } }).default
    .grpc ??
  grpcPkg

export const getGrpcTransport = () => {
  if (isReactNative()) {
    return ReactNativeTransport({ withCredentials: true })
  }

  if (isNode()) {
    return NodeHttpTransport()
  }

  return grpc.CrossBrowserHttpTransport({ withCredentials: false })
}

export { grpc, grpcPkg }
