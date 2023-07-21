import { Network } from '@injectivelabs/networks'
import { DenomClient } from './DenomClient'
import { INJ_DENOM } from '@injectivelabs/utils'

describe('DenomClient', () => {
  const denomClient = new DenomClient(Network.Mainnet)

  test('works for denom within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(INJ_DENOM)

    expect(token).toBeDefined()
  })

  test('works for symbol within token-metadata package', async () => {
    const token = await denomClient.getDenomToken('INJ')

    expect(token).toBeDefined()
  })

  test('works for address within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
    )

    expect(token).toBeDefined()
  })

  test('works for peggy denom within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      'peggy0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
    )

    expect(token).toBeDefined()
  })

  test('works for factory denom within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
    )

    expect(token).toBeDefined()
  })

  test('works for CW20 within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      'inj1dxv423h8ygzgxmxnvrf33ws3k94aedfdevxd8h',
    )

    expect(token).toBeDefined()
  })

  test('works for ERC20 within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      '0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30',
    )

    expect(token).toBeDefined()
  })

  test('works for IBC within token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
    )

    expect(token).toBeDefined()
  })

  test('works for base denom within token-metadata package', async () => {
    const token = await denomClient.getDenomToken('uatom')

    expect(token).toBeDefined()
  })
})
