import { PrivateKey } from './PrivateKey'

const privateKey =
  'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3'

describe('PrivateKey', () => {
  it('the correct PublicKey is derived from a private key', () => {
    const publicKey = PrivateKey.fromPrivateKey(privateKey)

    expect(publicKey.toPublicKey().toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })
})
