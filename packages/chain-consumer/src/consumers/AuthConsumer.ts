import { AccountAddress } from '@injectivelabs/ts-types'
import { bech32 } from 'bech32'
import { Address } from 'ethereumjs-util'
import BaseConsumer from '../BaseConsumer'

export class AuthConsumer extends BaseConsumer {
  getCosmosAddress = ({
    address,
    type = 'hex',
    prefix = 'inj',
  }: {
    address: AccountAddress | Buffer
    // eslint-disable-next-line no-undef
    type: BufferEncoding
    prefix: string
  }) => {
    let words
    if (Buffer.isBuffer(address)) {
      words = bech32.toWords(Buffer.from(address))
    } else {
      words = bech32.toWords(Buffer.from(address, type))
    }

    return bech32.encode(prefix, words)
  }

  getInjectiveAddress = (address: string) => {
    const addressBuffer = Address.fromString(address.toString()).toBuffer()

    return bech32.encode('inj', bech32.toWords(addressBuffer))
  }
}
