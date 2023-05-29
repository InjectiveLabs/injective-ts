# Accounts

Injective defines its own custom Account type that uses Ethereum's ECDSA secp256k1 curve for keys. This satisfies the [EIP84](https://github.com/ethereum/EIPs/issues/84) for full [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) paths. The root HD path for Injective-based accounts is `m/44'/60'/0'/0.`

### Address conversion

You can easily convert between an Injective address and Ethereum address by using our utility functions in the `@injectivelabs/sdk-ts` package:

```ts
import { getInjectiveAddress, getEthereumAddress } from '@injectivelabs/sdk-ts'

const injectiveAddress = 'inj1...'
const ethereumAddress = '0x..'

console.log('Injective address from Ethereum address => ', getInjectiveAddress(ethereumAddress))
console.log('Ethereum address from Injective address => ', getEthereumAddress(ethereumAddress))
```

### Deriving wallets

**Using Injective utility classes**

* Example code snippet on how to derive Injective Account from a private key and/or a mnemonic phase:

```ts
import { PrivateKey } from '@injectivelabs/sdk-ts'

const mnemonic = "indoor dish desk flag debris potato excuse depart ticket judge file exit"
const privateKey = "afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890"
const privateKeyFromMnemonic = PrivateKey.fromMnemonic(mnemonic)
const privateKeyFromHex = PrivateKey.fromPrivateKey(privateKey)

const address = privateKeyFromMnemonic.toAddress() /* or privateKeyFromHex.toAddress() */
console.log({ injectiveAddress: address.toBech32(), ethereumAddress: address.toHex() })
```

* Example code snipped on how to derive a public key from a private key:

```ts
import { PublicKey } from '@injectivelabs/sdk-ts'

const pubKey = "AuY3ASbyRHfgKNkg7rumWCXzSGCvvgtpR6KKWlpuuQ9Y"
const publicKey = PublicKey.fromBase64(pubKey)

console.log(publicKey.toAddress().toBech32())
```

* Example code snipped on how to derive an address from a public key:

```ts
import { PublicKey } from '@injectivelabs/sdk-ts'

const privateKey = "afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890"
const publicKey = PublicKey.fromHex(privateKey)
const type = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'

console.log(publicKey.toBase64())
```

**Without using Injective utility classes**

* Example code snippet on how to derive Injective Account from a private key and/or a mnemonic phase:

```ts
import { Wallet } from 'ethers'
import { Address as EthereumUtilsAddress } from 'ethereumjs-util'

const mnemonic = "indoor dish desk flag debris potato excuse depart ticket judge file exit"
const privateKey = "afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890"
const defaultDerivationPath = "m/44'/60'/0'/0/0"
const defaultBech32Prefix = 'inj'
const isPrivateKey: boolean = true /* just for the example */

const wallet = isPrivateKey ? Wallet.fromMnemonic(mnemonic, defaultDerivationPath) : new Wallet(privateKey)
const ethereumAddress = wallet.address
const addressBuffer = EthereumUtilsAddress.fromString(ethereumAddress.toString()).toBuffer()
const injectiveAddress = bech32.encode(defaultBech32Prefix, bech32.toWords(addressBuffer))
```

* Example code snipped on how to derive a public key from a private key:

```ts
import secp256k1 from 'secp256k1'

const privateKey = "afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890"
const privateKeyHex = Buffer.from(privateKey.toString(), 'hex')
const publicKeyByte = secp256k1.publicKeyCreate(privateKeyHex)

const buf1 = Buffer.from([10])
const buf2 = Buffer.from([publicKeyByte.length])
const buf3 = Buffer.from(publicKeyByte)

const publicKey = Buffer.concat([buf1, buf2, buf3]).toString('base64')
const type = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
```
