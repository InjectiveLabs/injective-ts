import { PublicKey } from './PublicKey'

const privateKey =
  'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3'

describe('PublicKey', () => {
  it('returns the correct PublicKey is derived from a private key', () => {
    const publicKey = PublicKey.fromHex(privateKey)

    expect(publicKey.toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })

  it('returns the correct PublicKey is derived from a private key starting with 0x', () => {
    const publicKey = PublicKey.fromHex('0x' + privateKey)

    expect(publicKey.toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })

  it('returns the correct Ethereum address is derived from a PublicKey', () => {
    const publicKey = PublicKey.fromHex(privateKey)

    expect(publicKey.toAddress().toHex()).toEqual(
      '0xbdaedec95d563fb05240d6e01821008454c24c36',
    )
  })

  it('return the correct Injective address is derived from a PublicKey', () => {
    const publicKey = PublicKey.fromHex(privateKey)

    expect(publicKey.toAddress().toBech32()).toEqual(
      'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r',
    )
  })

  it('returns the correct PublicKey is derived from a public key', () => {
    const publicKey = PublicKey.fromBase64(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )

    expect(publicKey.toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })
})
