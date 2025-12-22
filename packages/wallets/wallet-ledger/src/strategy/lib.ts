export type EthType = typeof import('@ledgerhq/hw-app-eth').default

export type CosmosType = typeof import('@ledgerhq/hw-app-cosmos').default

export type ledgerServiceType =
  typeof import('@ledgerhq/hw-app-eth').ledgerService

export type TransportWebHIDType =
  typeof import('@ledgerhq/hw-transport-webhid').default

export type TransportWebUSBType =
  typeof import('@ledgerhq/hw-transport-webusb').default

let EthType: EthType
let CosmosType: CosmosType
let ledgerServiceType: ledgerServiceType
let TransportWebUSB: TransportWebUSBType
let TransportWebHID: TransportWebHIDType

export async function loadEthType(): Promise<typeof EthType> {
  if (!EthType) {
    const module = await import('@ledgerhq/hw-app-eth')
    EthType = module.default
  }

  return EthType
}

export async function loadCosmosType(): Promise<typeof CosmosType> {
  if (!CosmosType) {
    const module = await import('@ledgerhq/hw-app-cosmos')
    CosmosType = module.default
  }

  return CosmosType
}

export async function loadLedgerServiceType(): Promise<
  typeof ledgerServiceType
> {
  if (!ledgerServiceType) {
    const module = await import('@ledgerhq/hw-app-eth')
    ledgerServiceType = module.ledgerService
  }

  return ledgerServiceType
}

export async function loadTransportWebUSB(): Promise<TransportWebUSBType> {
  if (!TransportWebUSB) {
    const module = await import('@ledgerhq/hw-transport-webusb')
    TransportWebUSB = module.default
  }

  return TransportWebUSB
}

export async function loadTransportWebHIDType(): Promise<TransportWebHIDType> {
  if (!TransportWebHID) {
    const module = await import('@ledgerhq/hw-transport-webhid')
    TransportWebHID = module.default
  }

  return TransportWebHID
}
