import { vi } from 'vitest'
import { domainHash, messageHash, isEIP712PayloadTooBig } from './utils.js'

const tooBigPayload = {
  types: {
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
      {
        name: 'salt',
        type: 'string',
      },
    ],
    Tx: [
      {
        name: 'context',
        type: 'string',
      },
      {
        name: 'msgs',
        type: 'string',
      },
    ],
  },
  primaryType: 'Tx',
  domain: {
    name: 'Injective Web3',
    version: '1.0.0',
    chainId: '0x1',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    salt: '0',
  },
  message: {
    context:
      '{"account_number":1607336,"chain_id":"injective-1","fee":{"amount":[{"denom":"inj","amount":"452096000000000"}],"gas":904192,"payer":"inj1065f86fh88ptyrg8h5048zu0vyx7ex8ymwgr6h"},"memo":"","sequence":8,"timeout_height":146288343}',
    msgs: '[{"@type":"/cosmos.authz.v1beta1.MsgGrant","granter":"inj1qa8jmnd0tql2uc7yachkyqc22dqnz2uxcs9ra6","grantee":"inj1hcsytnq2salprkkscr73fzj7y9p8srgpncjhqx","grant":{"authorization":{"@type":"/cosmos.authz.v1beta1.GenericAuthorization","msg":"/injective.exchange.v1beta1.MsgWithdraw"},"expiration":"2030-12-17T23:00:00Z"}},{"@type":"/cosmos.authz.v1beta1.MsgGrant","granter":"inj1qa8jmnd0tql2uc7yachkyqc22dqnz2uxcs9ra6","grantee":"inj1hcsytnq2salprkkscr73fzj7y9p8srgpncjhqx","grant":{"authorization":{"@type":"/cosmos.authz.v1beta1.GenericAuthorization","msg":"/injective.exchange.v1beta1.MsgBatchUpdateOrders"},"expiration":"2030-12-17T23:00:00Z"}},{"@type":"/cosmos.authz.v1beta1.MsgGrant","granter":"inj1qa8jmnd0tql2uc7yachkyqc22dqnz2uxcs9ra6","grantee":"inj1hcsytnq2salprkkscr73fzj7y9p8srgpncjhqx","grant":{"authorization":{"@type":"/cosmos.authz.v1beta1.GenericAuthorization","msg":"/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"},"expiration":"2030-12-17T23:00:00Z"}},{"@type":"/injective.wasmx.v1.MsgExecuteContractCompat","sender":"inj1qa8jmnd0tql2uc7yachkyqc22dqnz2uxcs9ra6","contract":"inj1hcsytnq2salprkkscr73fzj7y9p8srgpncjhqx","msg":"{\\"create_strategy\\":{\\"bounds\\":[\\"4000000\\",\\"5000000\\"],\\"levels\\":3,\\"subaccount_id\\":\\"0x074f2dcdaf583eae63c4ee2f62030a5341312b860000696e6a2d757364742d70\\",\\"fee_recipient\\":\\"inj1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8dkncm8\\",\\"slippage\\":\\"0.1\\",\\"strategy_type\\":{\\"perpetual\\":{\\"margin_ratio\\":\\"0.83\\"}}}}","funds":"10000000peggy0xdAC17F958D2ee523a2206206994597C13D831ec7"}]',
  },
}

const validPayload = {
  types: {
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
      {
        name: 'salt',
        type: 'string',
      },
    ],
    Tx: [
      {
        name: 'context',
        type: 'string',
      },
      {
        name: 'msgs',
        type: 'string',
      },
    ],
  },
  primaryType: 'Tx',
  domain: {
    name: 'Injective Web3',
    version: '1.0.0',
    chainId: '0x1',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    salt: '0',
  },
  message: {
    context:
      '{"account_number":1607336,"chain_id":"injective-1","fee":{"amount":[{"denom":"inj","amount":"89625000000000"}],"gas":179250,"payer":"inj1065f86fh88ptyrg8h5048zu0vyx7ex8ymwgr6h"},"memo":"","sequence":8,"timeout_height":146288649}',
    msgs: '[{"@type":"/injective.exchange.v1beta1.MsgCreateSpotLimitOrder","sender":"inj1qa8jmnd0tql2uc7yachkyqc22dqnz2uxcs9ra6","order":{"market_id":"0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0","order_info":{"subaccount_id":"0x074f2dcdaf583eae63c4ee2f62030a5341312b86000000000000000000000000","fee_recipient":"inj1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8dkncm8","price":"0.000000000004601000","quantity":"434000000000000000.000000000000000000","cid":""},"order_type":"BUY","trigger_price":"0.000000000000000000"}}]',
  },
}

const payload = {
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
    chainId: '0x1',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    salt: '0',
  },
  message: {
    context:
      '{"account_number":1336022,"chain_id":"injective-1","fee":{"amount":[{"denom":"inj","amount":"21426400000000"}],"gas":133915},"memo":"","sequence":23,"timeout_height":136749601}',
    msgs: '[{"@type":"/cosmos.bank.v1beta1.MsgSend","from_address":"inj1nu7ea4dd66w57snq73x3lxuw9qnjl5pettg0am","to_address":"inj1nu7ea4dd66w57snq73x3lxuw9qnjl5pettg0am","amount":[{"denom":"inj","amount":"10000000000000000"}]}]',
  },
}

const domainHashOutput =
  '0x692ee0201500cb39314156e6832d85f1ba784bdd38d31a72d98ea5dc8ccdf918'

const messageHashOutput =
  '0x593fc50fdedbbe20543ed8afb9577b5a5cb12d9db62c01c82e791f073762c0a6'

describe('Ledger Utils', () => {
  test('domainHash encodes data correctly', () => {
    const expected = domainHash(payload)

    expect(expected).toMatch(domainHashOutput)
  })

  test('messageHash encodes data correctly', () => {
    const expected = messageHash(payload)

    expect(expected).toMatch(messageHashOutput)
  })
})

describe('isEIP712PayloadTooBig', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('returns true if payload is too big', () => {
    const result = isEIP712PayloadTooBig(tooBigPayload)
    expect(result).toBe(true)
  })

  test('returns false if payload is valid', () => {
    const result = isEIP712PayloadTooBig(validPayload)
    expect(result).toBe(false)
  })
})
