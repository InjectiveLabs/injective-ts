import * as grpcPkg from '@injectivelabs/grpc-web'

const grpc: typeof grpcPkg.grpc =
  grpcPkg.grpc ?? (grpcPkg as unknown as { default: { grpc: typeof grpcPkg.grpc } }).default.grpc ?? grpcPkg

export { grpc, grpcPkg }
