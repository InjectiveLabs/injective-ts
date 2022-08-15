import { WasmQueryPayload } from './../types'

export abstract class BaseWasmQuery {
  public abstract toPayload(response?: WasmQueryPayload): string

  public abstract toData(response: { data: string }): any

  public encodeToBase64(payload: Record<string, any>): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  public decodeFromBase64(payload: string): Record<string, any> {
    return JSON.parse(Buffer.from(payload, 'base64').toString())
  }
}
