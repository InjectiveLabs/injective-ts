import { Network } from '@injectivelabs/networks'
import { DenomClientAsync } from './DenomClientAsync'

describe('DenomClientAsync', () => {
  const alchemyKey = process.env.ALCHEMY_KEY as string
  const denomClient = new DenomClientAsync(Network.Mainnet, {
    alchemyRpcUrl: alchemyKey,
  })

  test('works for erc20 which is not part of token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
    )

    if (!alchemyKey) {
      return
    }

    expect(token).toBeDefined()
  })

  test('works for cw20 which is not part of the token-metadata package', async () => {
    const token = await denomClient.getDenomToken(
      'inj1hnn3wkkuqdl657pk9kkst9jfcf5evg07guhkaf',
    )

    expect(token).toBeDefined()
  })

  test('works for custom factory denom', async () => {
    const token = await denomClient.getDenomToken(
      'factory/inj1zaem9jqplp08hkkd5vcl6vmvala9qury79vfj4/point',
    )

    expect(token).toBeDefined()
  })

  test('works for insurance funds denom', async () => {
    const token = await denomClient.getDenomToken('share1')

    expect(token).toBeDefined()
  })
})
