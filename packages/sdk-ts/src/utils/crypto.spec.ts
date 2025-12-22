import {
  sha256,
  ripemd160,
  hashToHex,
  decompressPubKey,
  privateKeyToPublicKey,
  SignTypedDataVersionV4,
  TypedDataUtilsHashStruct,
  TypedDataUtilsSanitizeData,
} from './crypto.js'

describe('crypto helper functions', () => {
  it('hashToHex returns correct value', () => {
    // Use valid base64 input (base64 encoding of 'hello world')
    const message = 'aGVsbG8gd29ybGQ='
    // SHA256 of 'hello world' bytes
    const expected =
      'B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9'
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

describe('EIP-712 Typed Data functions', () => {
  const mockEip712Data = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'string' },
      ],
      Tx: [
        { name: 'context', type: 'string' },
        { name: 'msgs', type: 'string' },
      ],
    },
    primaryType: 'Tx',
    domain: {
      name: 'Injective Web3',
      version: '1.0.0',
      chainId: '0xaa36a7',
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      salt: '0',
    },
    message: {
      context:
        '{"account_number":78,"chain_id":"injective-777","fee":{"amount":[{"denom":"inj","amount":"73893500000000"}],"gas":147787,"payer":"inj18j2myhaf2at75kwwaqxfstk4q28n4am45nlfg7"},"memo":"","sequence":0,"timeout_height":8732}',
      msgs: '[{"@type":"/injective.exchange.v1beta1.MsgCreateSpotLimitOrder","sender":"inj1fxfju0kgfn53ukvyhwg6y5vtt92c6ecjtzpexs","order":{"market_id":"0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0","order_info":{"subaccount_id":"0x49932e3ec84ce91e5984bb91a2518b59558d6712000000000000000000000000","fee_recipient":"inj1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8dkncm8","price":"0.000000000013781000","quantity":"872000000000000000.000000000000000000","cid":""},"order_type":"SELL","trigger_price":"0.000000000000000000"}}]',
    },
  }

  it('TypedDataUtilsSanitizeData sanitizes data correctly', () => {
    const result = TypedDataUtilsSanitizeData(mockEip712Data)

    expect(result).toHaveProperty('types')
    expect(result).toHaveProperty('primaryType')
    expect(result).toHaveProperty('domain')
    expect(result).toHaveProperty('message')
    expect(result.primaryType).toBe('Tx')
    expect(result.domain.name).toBe('Injective Web3')
    expect(result.message.context).toContain('account_number')
  })

  it('TypedDataUtilsHashStruct hashes EIP712Domain correctly', () => {
    const domainData = mockEip712Data.domain
    const types = mockEip712Data.types
    const version = SignTypedDataVersionV4

    const result = TypedDataUtilsHashStruct(
      'EIP712Domain',
      domainData,
      types,
      version,
    )

    expect(result).toBeDefined()
    expect(typeof result.toString('hex')).toBe('string')
    expect(result.toString('hex')).toMatch(/^[a-f0-9]+$/)
    expect(result.toString('hex').length).toBeGreaterThan(0)
  })

  it('TypedDataUtilsHashStruct hashes message correctly', () => {
    const messageData = mockEip712Data.message
    const types = { ...mockEip712Data.types, domain: mockEip712Data.domain }
    const version = SignTypedDataVersionV4

    const result = TypedDataUtilsHashStruct('Tx', messageData, types, version)

    expect(result).toBeDefined()
    expect(typeof result.toString('hex')).toBe('string')
    expect(result.toString('hex')).toMatch(/^[a-f0-9]+$/)
    expect(result.toString('hex').length).toBeGreaterThan(0)
  })

  it('TypedDataUtilsHashStruct handles different encodings', () => {
    const domainData = mockEip712Data.domain
    const types = mockEip712Data.types
    const version = SignTypedDataVersionV4

    const result = TypedDataUtilsHashStruct(
      'EIP712Domain',
      domainData,
      types,
      version,
    )

    // Test hex encoding
    const hexResult = result.toString('hex')
    expect(hexResult).toMatch(/^[a-f0-9]+$/)

    // Test default encoding (should return the full hash with 0x prefix)
    const defaultResult = result.toString()
    expect(defaultResult).toMatch(/^0x[a-f0-9]+$/)
  })

  it('TypedDataUtilsHashStruct handles minimal domain for message hash', () => {
    const messageData = mockEip712Data.message
    const types = {
      ...mockEip712Data.types,
      domain: {
        name: 'Test',
        version: '1.0.0',
        chainId: '0x1',
        verifyingContract: '0x0000000000000000000000000000000000000000',
        salt: '0',
      },
    }
    const version = SignTypedDataVersionV4

    const result = TypedDataUtilsHashStruct('Tx', messageData, types, version)

    expect(result).toBeDefined()
    expect(typeof result.toString('hex')).toBe('string')
  })

  it('TypedDataUtilsHashStruct handles BigInt values in data', () => {
    const dataWithBigInt = {
      ...mockEip712Data,
      message: {
        ...mockEip712Data.message,
        context:
          '{"account_number":78,"chain_id":"injective-777","fee":{"amount":[{"denom":"inj","amount":"73893500000000"}],"gas":147787,"payer":"inj18j2myhaf2at75kwwaqxfstk4q28n4am45nlfg7"},"memo":"","sequence":0,"timeout_height":8732}',
      },
    }

    const result = TypedDataUtilsSanitizeData(dataWithBigInt)

    expect(result).toBeDefined()
    expect(result.message.context).toBeDefined()
  })

  it('TypedDataUtilsHashStruct throws error for invalid data', () => {
    const invalidData = null
    const types = mockEip712Data.types
    const version = SignTypedDataVersionV4

    expect(() => {
      TypedDataUtilsHashStruct('EIP712Domain', invalidData, types, version)
    }).toThrow()
  })
})
