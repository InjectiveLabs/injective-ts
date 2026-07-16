import { Wallet } from '@injectivelabs/wallet-base'
import { vi, it, expect, describe, afterEach, beforeEach } from 'vitest'
import type {
  EIP6963ProviderDetail,
  BrowserEip1193Provider,
} from '@injectivelabs/wallet-base'

type MockWindow = Pick<
  Window,
  'addEventListener' | 'removeEventListener' | 'dispatchEvent'
> & {
  ethereum?: BrowserEip1193Provider
  providers?: BrowserEip1193Provider[]
  rainbow?: BrowserEip1193Provider
}

const createProvider = (
  flags: Partial<BrowserEip1193Provider>,
): BrowserEip1193Provider =>
  ({
    request: vi.fn(),
    on: vi.fn(),
    removeListener: vi.fn(),
    removeAllListeners: vi.fn(),
    ...flags,
  }) as unknown as BrowserEip1193Provider

const createMockWindow = (): MockWindow => {
  const target = new EventTarget()

  return {
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  }
}

const createAnnouncement = (detail: EIP6963ProviderDetail) => {
  const event = new Event('eip6963:announceProvider')

  Object.defineProperty(event, 'detail', {
    value: detail,
  })

  return event
}

const createDetail = ({
  name,
  provider,
  rdns,
}: {
  name: string
  provider: BrowserEip1193Provider
  rdns: string
}): EIP6963ProviderDetail => ({
  info: {
    icon: '',
    name,
    rdns,
    uuid: `${rdns}:${name}`,
  },
  provider,
})

const setupWindow = () => {
  const mockWindow = createMockWindow()

  vi.stubGlobal('window', mockWindow)

  return mockWindow
}

describe('EVM provider resolver', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('returns Rabby from EIP-6963 when MetaMask also announces', async () => {
    const mockWindow = setupWindow()
    const metamask = createProvider({ isMetaMask: true })
    const rabby = createProvider({ isMetaMask: true, isRabby: true })

    mockWindow.addEventListener('eip6963:requestProvider', () => {
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'MetaMask',
            provider: metamask,
            rdns: 'io.metamask',
          }),
        ),
      )
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'Rabby Wallet',
            provider: rabby,
            rdns: 'io.rabby',
          }),
        ),
      )
    })

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(resolveEvmProvider(Wallet.Rabby)).resolves.toBe(rabby)
  })

  it('returns MetaMask from EIP-6963 when Rabby also exposes isMetaMask', async () => {
    const mockWindow = setupWindow()
    const rabby = createProvider({ isMetaMask: true, isRabby: true })
    const metamask = createProvider({ isMetaMask: true })

    mockWindow.addEventListener('eip6963:requestProvider', () => {
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'Rabby Wallet',
            provider: rabby,
            rdns: 'io.rabby',
          }),
        ),
      )
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'MetaMask',
            provider: metamask,
            rdns: 'io.metamask',
          }),
        ),
      )
    })

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(resolveEvmProvider(Wallet.Metamask)).resolves.toBe(metamask)
  })

  it('falls back to EIP-6963 display name when rdns is unknown', async () => {
    const mockWindow = setupWindow()
    const rabby = createProvider({ isRabby: true })

    mockWindow.addEventListener('eip6963:requestProvider', () => {
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'Rabby Wallet',
            provider: rabby,
            rdns: 'unknown.wallet',
          }),
        ),
      )
    })

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(resolveEvmProvider(Wallet.Rabby)).resolves.toBe(rabby)
  })

  it('prefers EIP-6963 rdns over display name when they conflict', async () => {
    const mockWindow = setupWindow()
    const rabby = createProvider({ isMetaMask: true, isRabby: true })

    mockWindow.addEventListener('eip6963:requestProvider', () => {
      mockWindow.dispatchEvent(
        createAnnouncement(
          createDetail({
            name: 'MetaMask',
            provider: rabby,
            rdns: 'io.rabby',
          }),
        ),
      )
    })

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(resolveEvmProvider(Wallet.Rabby)).resolves.toBe(rabby)
    await expect(resolveEvmProvider(Wallet.Metamask)).resolves.toBeUndefined()
  })

  it('uses window.ethereum.providers without treating Rabby as MetaMask', async () => {
    const mockWindow = setupWindow()
    const rabby = createProvider({ isMetaMask: true, isRabby: true })
    const metamask = createProvider({ isMetaMask: true })

    mockWindow.ethereum = createProvider({
      providers: [rabby, metamask],
    })

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(
      resolveEvmProvider(Wallet.Rabby, { requestEip6963: false }),
    ).resolves.toBe(rabby)
    await expect(
      resolveEvmProvider(Wallet.Metamask, { requestEip6963: false }),
    ).resolves.toBe(metamask)
  })

  it('does not satisfy MetaMask with window.ethereum when it points to Rabby', async () => {
    const mockWindow = setupWindow()
    const rabby = createProvider({ isMetaMask: true, isRabby: true })

    mockWindow.ethereum = rabby

    const { resolveEvmProvider } = await import('./providerResolver.js')

    await expect(
      resolveEvmProvider(Wallet.Metamask, { requestEip6963: false }),
    ).resolves.toBeUndefined()
  })

  it('resolves Rainbow through the exported getEvmProvider utility', async () => {
    vi.useFakeTimers()

    const mockWindow = setupWindow()
    const rainbow = createProvider({ isRainbow: true })

    mockWindow.rainbow = rainbow

    const { getEvmProvider } = await import('../../utils/index.js')
    const providerPromise = getEvmProvider(Wallet.Rainbow)

    await vi.advanceTimersByTimeAsync(250)

    await expect(providerPromise).resolves.toBe(rainbow)
  })

  it('waits for Rainbow initialization event before resolving provider', async () => {
    vi.useFakeTimers()

    const mockWindow = setupWindow()
    const rainbow = createProvider({ isRainbow: true })

    const { getEvmProvider } = await import('../../utils/index.js')
    const providerPromise = getEvmProvider(Wallet.Rainbow)

    await vi.advanceTimersByTimeAsync(250)

    mockWindow.rainbow = rainbow
    mockWindow.dispatchEvent(new Event('rainbow#initialized'))

    await expect(providerPromise).resolves.toBe(rainbow)
  })
})
