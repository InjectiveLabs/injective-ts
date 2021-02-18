export * from './enums'
export * from './aliases'
export * from './transactions'

export interface Constructable<T> {
  new (...args: never): T
}
