export * from './enums'
export * from './aliases'

export interface Constructable<T> {
  new (...args: never): T
}
