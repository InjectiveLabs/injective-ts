export * from './enums.js'

export type UnwrappedPromise<T> = T extends Promise<infer Return> ? Return : T
