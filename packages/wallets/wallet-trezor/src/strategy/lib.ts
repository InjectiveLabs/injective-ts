type TrezorConnectType =
  typeof import('@bangjelkoski/trezor-connect-web').TrezorConnect

let TrezorConnect: TrezorConnectType

export async function loadTrezorConnect(): Promise<TrezorConnectType> {
  if (!TrezorConnect) {
    const module = await import('@bangjelkoski/trezor-connect-web')

    TrezorConnect = (module.TrezorConnect ||
      (module as any).default.TrezorConnect) as TrezorConnectType
  }

  return TrezorConnect
}
