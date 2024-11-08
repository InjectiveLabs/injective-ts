import { verifyMessage, Wallet } from 'ethers'
import { generateArbitrarySignDoc } from '../tx'
import { PrivateKey } from './PrivateKey'
import { toUtf8 } from '../../utils'

const pk = process.env.TEST_PRIVATE_KEY as string
const seedPhase = process.env.TEST_SEED_PHASE as string

if (!pk || !seedPhase) {
  throw new Error('TEST_PRIVATE_KEY or TEST_SEED_PHASE is not set')
}

describe('PrivateKey', () => {
  it('returns the correct address derived from a mnemonic', () => {
    const privateKey = PrivateKey.fromMnemonic(seedPhase)

    expect(privateKey.toBech32()).toEqual(
      'inj1u3f7yuwl8mkd88ryzdhxt6kt90a60rgl0nmxyq',
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

  it('returns true when verifying signature for a particular EIP712', () => {
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
    const signature = privateKey.signTypedData(eip712)

    expect(Buffer.from(signature).toString('hex')).toEqual(expectedSignature)
  })

  it('returns true when verifying signature for a public key and eip712', () => {
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
      PrivateKey.verifySignature({
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

    const wallet = new Wallet(pk)
    const ethersSignature = await wallet.signMessage(message)

    const privateKey = PrivateKey.fromHex(pk)
    const publicKey = privateKey.toHex()

    const privKeySignatureArray = privateKey.sign(
      Buffer.from(toUtf8(message), 'utf-8'),
    )
    const privKeySignature = `0x${Buffer.from(privKeySignatureArray).toString(
      'hex',
    )}`

    const ethersVerifiedSigner = verifyMessage(message, ethersSignature)
    const ethersSignatureVerifiedCorrectly = ethersVerifiedSigner === publicKey
    expect(ethersSignatureVerifiedCorrectly).toBe(true)

    const privKeyVerifiedSigner = verifyMessage(message, privKeySignature)
    const privKeySignatureVerifiedCorrectly =
      privKeyVerifiedSigner === publicKey
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
