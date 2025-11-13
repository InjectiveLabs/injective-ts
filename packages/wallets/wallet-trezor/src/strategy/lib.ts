import type { TrezorConnect as TrezorConnectType } from '@trezor/connect-web'

export async function loadTrezorConnect(): Promise<TrezorConnectType> {
  const module = await import('@trezor/connect-web')

  return (module as any).default.default as unknown as TrezorConnectType
}
