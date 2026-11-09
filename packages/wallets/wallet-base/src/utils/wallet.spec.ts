import { Wallet } from '../types/enums.js'
import { resolveEip712Version } from './wallet.js'

describe('resolveEip712Version', () => {
  it.each([
    [Wallet.Phantom, undefined, 'v3'],
    [Wallet.Metamask, undefined, 'v2'],
    [Wallet.Phantom, 'v2', 'v2'],
    [Wallet.Metamask, 'v3', 'v3'],
  ] as const)('%s with override %s uses %s', (wallet, override, expected) => {
    expect(resolveEip712Version(wallet, override)).toBe(expected)
  })
})
