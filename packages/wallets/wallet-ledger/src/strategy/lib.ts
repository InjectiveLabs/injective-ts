export type EthType = typeof import('@bangjelkoski/ledgerhq-hw-app-eth').Eth

export type CosmosType =
  typeof import('@bangjelkoski/ledgerhq-hw-app-cosmos').Cosmos

export type ledgerServiceType =
  typeof import('@bangjelkoski/ledgerhq-hw-app-eth').ledgerService

export type TransportWebHIDType =
  typeof import('@bangjelkoski/ledgerhq-hw-transport-webhid').TransportWebHID

export type TransportWebUSBType =
  typeof import('@bangjelkoski/ledgerhq-hw-transport-webusb').TransportWebUSB

let EthType: EthType
let CosmosType: CosmosType
let ledgerServiceType: ledgerServiceType
let TransportWebUSB: TransportWebUSBType
let TransportWebHID: TransportWebHIDType

export async function loadEthType(): Promise<typeof EthType> {
  if (!EthType) {
    const module = await import('@bangjelkoski/ledgerhq-hw-app-eth')
    EthType = module.Eth ? module.Eth : (module as any).default.Eth
  }

  return EthType
}

export async function loadCosmosType(): Promise<typeof CosmosType> {
  if (!CosmosType) {
    const module = await import('@bangjelkoski/ledgerhq-hw-app-cosmos')
    CosmosType = module.Cosmos ? module.Cosmos : (module as any).default.Cosmos
  }

  return CosmosType
}

export async function loadLedgerServiceType(): Promise<
  typeof ledgerServiceType
> {
  if (!ledgerServiceType) {
    const module = await import('@bangjelkoski/ledgerhq-hw-app-eth')
    ledgerServiceType =
      module.ledgerService ||
      ((module as any).default.ledgerService as typeof ledgerServiceType)
  }

  return ledgerServiceType
}

export async function loadTransportWebUSB(): Promise<TransportWebUSBType> {
  if (!TransportWebUSB) {
    const module = await import('@bangjelkoski/ledgerhq-hw-transport-webusb')

    TransportWebUSB =
      module.TransportWebUSB ||
      ((module as any).default.TransportWebUSB as TransportWebUSBType)
  }

  return TransportWebUSB
}

export async function loadTransportWebHIDType(): Promise<TransportWebHIDType> {
  if (!TransportWebHID) {
    const module = await import('@bangjelkoski/ledgerhq-hw-transport-webhid')

    TransportWebHID =
      module.TransportWebHID ||
      ((module as any).default.TransportWebHID as TransportWebHIDType)
  }

  return TransportWebHID
}
