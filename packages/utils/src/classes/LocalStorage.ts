import store, { StoreAPI } from 'store2'

export default class LocalStorage {
  private storage: StoreAPI

  constructor(namespace: string) {
    this.storage = store.namespace(namespace)
  }

  get(key: string, defaultValue: unknown = {}): unknown {
    return this.storage.get(key) || defaultValue
  }

  has(key: string): boolean {
    return this.storage.has(key)
  }

  set(key: string, value: unknown): void {
    this.storage.set(key, value)
  }

  remove(key: string): void {
    this.storage.remove(key)
  }

  clear(): void {
    this.storage.clear()
  }
}
