import {
  sha256,
  hashToHex,
  ripemd160,
  decompressPubKey,
  privateKeyToPublicKey,
} from './crypto.js'

describe('crypto helper functions', () => {
  it('hashToHex returns correct value', () => {
    const message = 'hello world'
    const expected =
      '8D93BD1A4B536FE30D0AA7D4FD0B43F4964A91059A1FB0014D8F3F4E575B38AB'
    const actual = hashToHex(message)

    expect(actual).toEqual(expected)
  })

  it('sha256 returns correct value', () => {
    const message = 'hello world'
    const expected =
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    const actual = sha256(Buffer.from(message))

    expect(Buffer.from(actual).toString('hex')).toEqual(expected)
  })

  it('ripemd160 returns correct value', () => {
    const message = 'hello world'
    const expected = '98c615784ccb5fe5936fbc0cbe9dfdb408d92f0f'
    const actual = ripemd160(Buffer.from(message))

    expect(Buffer.from(actual).toString('hex')).toEqual(expected)
  })

  it('privateKeyToPublicKey returns correct value', () => {
    const privateKey =
      'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3'
    const expected = 'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT'
    const actual = privateKeyToPublicKey(Buffer.from(privateKey, 'hex'))

    expect(Buffer.from(actual).toString('base64')).toEqual(expected)
  })

  it('decompressPubKey returns correct value', () => {
    const publicKey =
      '035ddc4d5642b9383e2f087b2ee88b7207f6286ebc9f310e9df1406eccc2c31813'
    const expected =
      '3564646334643536343262393338336532663038376232656538386237323037663632383665626339663331306539646631343036656363633263333138313334646637633662643665663761623466613261376332663265356432623630636334333862616164343331386165386637333636613364323137653939636337'
    const actual = decompressPubKey(publicKey)

    expect(Buffer.from(actual).toString('hex')).toEqual(expected)
  })
})
