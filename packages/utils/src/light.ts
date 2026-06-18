import type { AccountAddress } from '@injectivelabs/ts-types'

export const StatusType = {
  Idle: 'idle',
  Loading: 'loading',
  Completed: 'completed',
  Error: 'error',
  Confirmed: 'confirmed',
} as const

export type StatusType = (typeof StatusType)[keyof typeof StatusType]

export class Status {
  public status: string

  constructor(status: StatusType = StatusType.Idle) {
    this.status = status
  }

  get(): string {
    return this.status
  }

  set(status: StatusType): void {
    this.status = status
  }

  is(status: StatusType): boolean {
    return this.status === status
  }

  isLoading(): boolean {
    return this.is(StatusType.Loading)
  }

  isNotLoading(): boolean {
    return !this.is(StatusType.Loading)
  }

  isCompleted(): boolean {
    return this.is(StatusType.Completed)
  }

  isConfirmed(): boolean {
    return this.is(StatusType.Confirmed)
  }

  isIdle(): boolean {
    return this.is(StatusType.Idle)
  }

  isError(): boolean {
    return this.is(StatusType.Error)
  }

  setLoading(): void {
    this.set(StatusType.Loading)
  }

  setCompleted(): void {
    this.set(StatusType.Completed)
  }

  setConfirmed(): void {
    this.set(StatusType.Confirmed)
  }

  setError(): void {
    this.set(StatusType.Error)
  }

  setIdle(): void {
    this.set(StatusType.Idle)
  }

  toggle(): void {
    this.set(
      this.status === StatusType.Idle ? StatusType.Loading : StatusType.Idle,
    )
  }

  toString(): string {
    return this.get()
  }

  valueOf(): string {
    return this.get()
  }
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const INJ_DENOM = 'inj'
export const INJECTIVE_DENOM = 'inj'

export const DEFAULT_FEE_DENOM = 'inj'
export const DEFAULT_GAS_LIMIT = 400000
export const DEFAULT_IBC_GAS_LIMIT = 300000
export const DEFAULT_GAS_PRICE = 160000000
export const DEFAULT_EXCHANGE_LIMIT = 200000

export const DEFAULT_BRIDGE_FEE_DENOM = 'inj'
export const DEFAULT_BRIDGE_FEE_PRICE = '160000000'
export const DEFAULT_BRIDGE_FEE_AMOUNT = '200000000000000'

export const DEFAULT_BLOCK_TIMEOUT_HEIGHT = 60
export const DEFAULT_BLOCK_TIME_IN_SECONDS = 0.7

export const DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS = Math.floor(
  DEFAULT_BLOCK_TIMEOUT_HEIGHT * DEFAULT_BLOCK_TIME_IN_SECONDS * 1000,
)
export const DEFAULT_TX_POLL_INTERVAL_MS = 500
export const DEFAULT_TX_POLL_CALL_TIMEOUT_MS = 3000
export const DEFAULT_TIMESTAMP_TIMEOUT_MS = 60 * 1000 * 3

export const getDefaultStdFee = () => ({
  amount: [
    {
      denom: 'inj',
      amount: String(DEFAULT_GAS_LIMIT * DEFAULT_GAS_PRICE),
    },
  ],
  gas: DEFAULT_GAS_LIMIT.toString(),
  payer: '',
  granter: '',
  feePayer: '',
})

export const DEFAULT_STD_FEE_BY_DENOM = (denom: string = 'inj') => ({
  amount: [
    {
      denom,
      amount: String(DEFAULT_GAS_LIMIT * DEFAULT_GAS_PRICE),
    },
  ],
  gas: DEFAULT_GAS_LIMIT.toString(),
})

export const formatWalletAddress = (
  address: AccountAddress,
  substrLength = 6,
): string => {
  if (address.length <= 10) {
    return address
  }

  return `${address.slice(0, substrLength)}...${address.slice(
    address.length - substrLength,
    address.length,
  )}`
}

export const toPascalCase = (str: string): string => {
  return `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())
}

export const snakeToPascal = (str: string): string => {
  return str
    .split('/')
    .map((snake) =>
      snake
        .split('_')
        .map((substr) => substr.charAt(0).toUpperCase() + substr.slice(1))
        .join(''),
    )
    .join('/')
}

export const capitalize = (str: string): string =>
  str[0].toUpperCase() + str.slice(1)

export const sleep = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout))

export const awaitAll = async <T, S>(
  array: Array<T>,
  callback: (item: T) => Promise<S>,
): Promise<Awaited<S>[]> =>
  await Promise.all(array.map(async (item: T) => await callback(item)))

export const awaitForAll = async <T, S>(
  array: Array<T>,
  callback: (item: T) => Promise<S>,
  onError?: (error: unknown, item: T, index: number) => void,
): Promise<S[]> => {
  const result = [] as S[]

  for (let index = 0; index < array.length; index += 1) {
    try {
      result.push(await callback(array[index]))
    } catch (error: unknown) {
      if (onError) {
        onError(error, array[index], index)
      }
    }
  }

  return result
}

export const splitArrayToChunksThrow = <T>({
  array,
  filter,
  chunkSize,
}: {
  array: Array<T>
  chunkSize: number
  filter?: (item: T) => boolean
}) => {
  const chunks = []
  const chunkSizeInNumber = Number(chunkSize)

  if (Number.isNaN(chunkSizeInNumber)) {
    throw new Error('Invalid chunk size, must be a valid number')
  }

  for (let index = 0; index < array.length; index += chunkSizeInNumber) {
    const chunk = array.slice(index, index + chunkSizeInNumber)

    if (filter) {
      chunks.push(chunk.filter(filter))
    } else {
      chunks.push(chunk)
    }
  }

  return chunks
}

export const splitArrayToChunks = <T>({
  array,
  filter,
  chunkSize,
}: {
  array: Array<T>
  chunkSize: number
  filter?: (item: T) => boolean
}) => {
  try {
    return splitArrayToChunksThrow({ array, chunkSize, filter })
  } catch {
    return [array]
  }
}
