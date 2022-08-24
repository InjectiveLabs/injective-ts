import { bech32 } from 'bech32'
import { Address as EthereumUtilsAddress } from 'ethereumjs-util'
import {
  BECH32_ADDR_ACC_PREFIX,
  BECH32_ADDR_CONS_PREFIX,
  BECH32_ADDR_VAL_PREFIX,
} from '../utils/constants'

/**
 * @category Utility Classes
 */
export class Address {
  public bech32Address: string

  constructor(bech32Address: string) {
    this.bech32Address = bech32Address
  }

  compare(address: Address): boolean {
    return (
      this.bech32Address.toLowerCase() === address.bech32Address.toLowerCase()
    )
  }

  get address(): string {
    return this.bech32Address
  }

  /**
   * Create an address instance from a bech32-encoded address and a prefix
   * @param {string} bech32 bech32-encoded address
   * @param {string} prefix
   * @return {Address}
   * @throws {Error} if bech is not a valid bech32-encoded address
   */
  static fromBech32(
    bech: string,
    prefix: string = BECH32_ADDR_ACC_PREFIX,
  ): Address {
    const address = Buffer.from(
      bech32.fromWords(bech32.decode(bech).words),
    ).toString('hex')
    const addressInHex = address.startsWith('0x') ? address : `0x${address}`
    const addressBuffer = EthereumUtilsAddress.fromString(
      addressInHex.toString(),
    ).toBuffer()
    const bech32Address = bech32.encode(prefix, bech32.toWords(addressBuffer))

    return new Address(bech32Address)
  }

  /**
   * Create an address instance from an ethereum address
   * @param {string} hex Ethereum address
   * @param {string} prefix
   * @return {Address}
   * @throws {Error} if bech is not a valid bech32-encoded address
   */
  static fromHex(
    hex: string,
    prefix: string = BECH32_ADDR_ACC_PREFIX,
  ): Address {
    const addressHex = hex.startsWith('0x') ? hex : `0x${hex}`
    const addressBuffer = EthereumUtilsAddress.fromString(
      addressHex.toString(),
    ).toBuffer()
    const bech32Address = bech32.encode(prefix, bech32.toWords(addressBuffer))

    return new Address(bech32Address)
  }

  /**
   * Convert an address instance to a bech32-encoded account address
   * @param {string} prefix
   * @returns {string}
   */
  toBech32(prefix: string = BECH32_ADDR_ACC_PREFIX): string {
    const address = this.toHex()
    const addressHex = address.startsWith('0x') ? address : `0x${address}`
    const addressBuffer = EthereumUtilsAddress.fromString(addressHex).toBuffer()

    return bech32.encode(prefix, bech32.toWords(addressBuffer))
  }

  /**
   * Return a bech32-encoded account address
   * @return {string}
   * @throws {Error} if this address is not a valid account address
   * */
  toAccountAddress(): string {
    return this.toBech32(BECH32_ADDR_ACC_PREFIX)
  }

  /**
   * Return a bech32-encoded validator address
   * @return {string}
   * @throws {Error} if this address is not a valid validator address
   * */
  toValidatorAddress(): string {
    return this.toBech32(BECH32_ADDR_VAL_PREFIX)
  }

  /**
   * Return a bech32-encoded consensus address
   * @return {string}
   * @throws {Error} if this address is not a valid consensus address
   * */
  toConsensusAddress(): string {
    return this.toBech32(BECH32_ADDR_CONS_PREFIX)
  }

  /**
   * Return a hex representation of address
   * @return {string}
   * @throws {Error} if this address is not a valid account address
   * */
  toHex(): string {
    const { bech32Address } = this
    const address = Buffer.from(
      bech32.fromWords(bech32.decode(bech32Address).words),
    ).toString('hex')

    return address.startsWith('0x') ? address : `0x${address}`
  }

  /**
   * Return a subaccount address from the given bech32 encoded address
   * @param {number} index the subaccount index
   * @return {string}
   * @throws {Error} if this address is not a valid account address
   * */
  getSubaccountId(index: number = 0): string {
    const suffix = '0'.repeat(23) + index /* TODO for double digit numbers */

    return `${this.toHex()}${suffix}`
  }

  /**
   * Return a ethereum address from the given bech32 encoded address
   * @return {string}
   * @throws {Error} if this address is not a valid account address
   * */
  getEthereumAddress(): string {
    return this.toHex()
  }
}
