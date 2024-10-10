export * from './enums'
export * from './strategy'

export type UnwrappedPromise<T> = T extends Promise<infer Return> ? Return : T
