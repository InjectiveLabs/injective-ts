import { getDefaultStdFee } from '@injectivelabs/utils'
import { Wallet, hashMessage, verifyMessage } from 'ethers'
import { PrivateKey } from './PrivateKey.js'
import { MsgSend } from '../modules/index.js'
import {
  TxClient,
  createTransaction,
  generateArbitrarySignDoc,
} from '../tx/index.js'

const pk = 'f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3'
const seedPhrase =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

describe('PrivateKey', () => {
  it('returns the correct address derived from a mnemonic', () => {
    const privateKey = PrivateKey.fromMnemonic(seedPhrase)

    expect(privateKey.toBech32()).toEqual(
      'inj1npvwllfr9dqr8erajqqr6s0vxnk2ak55re90dz',
    )
  })

  it('returns the correct PublicKey derived from a private key', () => {
    const privateKey = PrivateKey.fromHex(pk)

    expect(privateKey.toPublicKey().toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })

  it('returns the correct PublicKey derived from a private key starting with 0x', () => {
    const privateKey = PrivateKey.fromHex('0x' + pk)

    expect(privateKey.toPublicKey().toBase64()).toEqual(
      'A13cTVZCuTg+Lwh7LuiLcgf2KG68nzEOnfFAbszCwxgT',
    )
  })

  it('returns true when verifying signature for a particular EIP712', async () => {
    const expectedSignature =
      'e75db7f206927afd916b1423ed04fca37d2ac19662b220edc7d14f164b3af8f4727bb0f5b1f1372fd25675aebed92a5467cc55d2f38774a794a14bc59212c7d41c'
    const eip712 = {
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
          '{"account_number":17,"chain_id":"injective-888","fee":{"amount":[{"denom":"inj","amount":"71101500000000"}],"gas":142203,"payer":"inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z"},"memo":"","sequence":21979,"timeout_height":30038262}',
        msgs: '[{"@type":"/injective.exchange.v1beta1.MsgCreateSpotMarketOrder","sender":"inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r","order":{"market_id":"0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe","order_info":{"subaccount_id":"0xbdaedec95d563fb05240d6e01821008454c24c36000000000000000000000000","fee_recipient":"inj1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8dkncm8","price":"0.000000000024039000","quantity":"41000000000000000.000000000000000000","cid":""},"order_type":"BUY","trigger_price":"0.000000000000000000"}}]',
      },
    }
    const privateKey = PrivateKey.fromHex(pk)
    const signature = await privateKey.signTypedData(eip712)

    expect(Buffer.from(signature).toString('hex')).toEqual(expectedSignature)
  })

  it('returns true when verifying signature for a public key and eip712', async () => {
    const signature =
      '0xe75db7f206927afd916b1423ed04fca37d2ac19662b220edc7d14f164b3af8f4727bb0f5b1f1372fd25675aebed92a5467cc55d2f38774a794a14bc59212c7d41c'
    const publicKey =
      '035ddc4d5642b9383e2f087b2ee88b7207f6286ebc9f310e9df1406eccc2c318'
    const eip712 = {
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
          '{"account_number":17,"chain_id":"injective-888","fee":{"amount":[{"denom":"inj","amount":"71101500000000"}],"gas":142203,"payer":"inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z"},"memo":"","sequence":21979,"timeout_height":30038262}',
        msgs: '[{"@type":"/injective.exchange.v1beta1.MsgCreateSpotMarketOrder","sender":"inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r","order":{"market_id":"0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe","order_info":{"subaccount_id":"0xbdaedec95d563fb05240d6e01821008454c24c36000000000000000000000000","fee_recipient":"inj1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8dkncm8","price":"0.000000000024039000","quantity":"41000000000000000.000000000000000000","cid":""},"order_type":"BUY","trigger_price":"0.000000000000000000"}}]',
      },
    }

    expect(
      await PrivateKey.verifySignature({
        eip712,
        signature,
        publicKey: publicKey,
      }),
    ).toBe(true)
  })

  it('returns true when verifying signature for a public key and a cosmos message', () => {
    //
  })

  it('returns true when checking a pk signature against the signer public key', async () => {
    const message = 'this is a test message'
    const messageHash = hashMessage(message)

    const wallet = new Wallet(pk)
    const privateKey = PrivateKey.fromHex(pk)

    const ethersSignature = await wallet.signMessage(message)
    const ethersVerifiedSigner = verifyMessage(message, ethersSignature)
    const ethersSignatureVerifiedCorrectly =
      ethersVerifiedSigner.toLowerCase() === wallet.address.toLowerCase()
    expect(ethersSignatureVerifiedCorrectly).toBe(true)

    const privKeySignatureArray = privateKey.signHashed(
      Buffer.from(messageHash.slice(2), 'hex'),
    )
    const privKeySignature = `0x${Buffer.from(privKeySignatureArray).toString(
      'hex',
    )}`
    const privKeyVerifiedSigner = verifyMessage(message, privKeySignature)
    const privKeySignatureVerifiedCorrectly =
      privKeyVerifiedSigner.toLowerCase() === wallet.address.toLowerCase()
    expect(privKeySignatureVerifiedCorrectly).toBe(true)
  })

  it('returns true when verifying arbitrary message', async () => {
    const privateKey = PrivateKey.fromHex(pk)

    const message = 'testing ADR-36'
    const { signDocBuff } = generateArbitrarySignDoc(
      message,
      privateKey.toBech32(),
    )
    const signature = await privateKey.sign(signDocBuff)

    expect(
      PrivateKey.verifyArbitrarySignature({
        signature: Buffer.from(signature).toString('hex'),
        signDoc: signDocBuff,
        publicKey: privateKey.toPublicKey().toHex(),
      }),
    ).toBe(true)
  })
})

describe('Transaction signing flow', () => {
  const createTestMsg = (injectiveAddress: string) =>
    MsgSend.fromJSON({
      amount: { denom: 'inj', amount: '10000000000000000' },
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
    })

  const createTestTransaction = (privateKey: PrivateKey) => {
    const injectiveAddress = privateKey.toBech32()
    const pubKey = privateKey.toPublicKey().toBase64()
    const msg = createTestMsg(injectiveAddress)

    return createTransaction({
      pubKey,
      message: msg,
      chainId: 'injective-1',
      fee: getDefaultStdFee(),
      sequence: 0,
      timeoutHeight: 12345678,
      accountNumber: 12345,
    })
  }

  it('creates a valid MsgSend with correct type URL', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const msg = createTestMsg(privateKey.toBech32())

    expect(msg.toProto()).toBeDefined()
    expect(msg.toDirectSign().type).toBe('/cosmos.bank.v1beta1.MsgSend')
  })

  it('creates a transaction with txRaw and signBytes', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { txRaw, signBytes } = createTestTransaction(privateKey)

    expect(txRaw.bodyBytes).toBeDefined()
    expect(txRaw.authInfoBytes).toBeDefined()
    expect(signBytes.length).toBeGreaterThan(0)
    expect(txRaw.signatures.length).toBe(0)
  })

  it('signs transaction bytes and produces a 64-byte secp256k1 signature', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { signBytes } = createTestTransaction(privateKey)

    const signature = privateKey.sign(signBytes)

    expect(signature).toBeInstanceOf(Uint8Array)
    expect(signature.length).toBe(64)
  })

  it('produces deterministic signatures for the same input', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { signBytes } = createTestTransaction(privateKey)

    const signature1 = privateKey.sign(signBytes)
    const signature2 = privateKey.sign(signBytes)

    expect(Buffer.from(signature1).toString('hex')).toBe(
      Buffer.from(signature2).toString('hex'),
    )
  })

  it('completes full transaction prepare and sign flow', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { signBytes, txRaw } = createTestTransaction(privateKey)

    const signature = privateKey.sign(signBytes)
    txRaw.signatures = [signature]

    expect(txRaw.signatures.length).toBe(1)
    expect(txRaw.signatures[0]).toBe(signature)
  })

  it('calculates consistent transaction hash', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { signBytes, txRaw } = createTestTransaction(privateKey)

    txRaw.signatures = [privateKey.sign(signBytes)]
    const txHash = TxClient.hash(txRaw)

    expect(typeof txHash).toBe('string')
    expect(txHash.length).toBe(64)
    expect(TxClient.hash(txRaw)).toBe(txHash)
  })

  it('encodes and decodes transaction correctly', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const { signBytes, txRaw } = createTestTransaction(privateKey)

    txRaw.signatures = [privateKey.sign(signBytes)]

    const encoded = TxClient.encode(txRaw)
    const decoded = TxClient.decode(encoded)

    expect(typeof encoded).toBe('string')
    expect(decoded.bodyBytes).toEqual(txRaw.bodyBytes)
    expect(decoded.authInfoBytes).toEqual(txRaw.authInfoBytes)
  })
})

describe('PrivateKey address derivation', () => {
  it('derives valid bech32 address and consistent Address object', () => {
    const privateKey = PrivateKey.fromHex(pk)

    const injectiveAddress = privateKey.toBech32()
    const address = privateKey.toAddress()

    expect(injectiveAddress).toMatch(/^inj1[a-z0-9]{38}$/)
    expect(address.toBech32()).toBe(injectiveAddress)
  })
})

describe('MsgSend', () => {
  it('handles single amount object', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const injectiveAddress = privateKey.toBech32()

    const msg = MsgSend.fromJSON({
      amount: { denom: 'inj', amount: '10000000000000000' },
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
    })

    const proto = msg.toProto()
    expect(proto.amount.length).toBe(1)
    expect(proto.amount[0].denom).toBe('inj')
    expect(proto.amount[0].amount).toBe('10000000000000000')
  })

  it('handles array of amounts', () => {
    const privateKey = PrivateKey.fromHex(pk)
    const injectiveAddress = privateKey.toBech32()

    const msg = MsgSend.fromJSON({
      amount: [
        { denom: 'inj', amount: '10000000000000000' },
        { denom: 'peggy0x...', amount: '1000000' },
      ],
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
    })

    const proto = msg.toProto()
    expect(proto.amount.length).toBe(2)
  })
})
