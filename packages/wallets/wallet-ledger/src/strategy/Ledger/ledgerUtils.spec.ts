import { domainHash, messageHash } from './utils.js'

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
