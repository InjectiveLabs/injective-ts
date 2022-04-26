import { bech32 } from 'bech32'
import { Address as EthereumUtilsAddress } from 'ethereumjs-util'
import {
  BECH32_ADDR_ACC_PREFIX,
  BECH32_ADDR_CONS_PREFIX,
  BECH32_ADDR_VAL_PREFIX,
} from '../utils/constants'

export class Address {
  public address: string

  public accountNumber: number

  public sequence: number

  private constructor(address: string) {
    this.address = address
    this.accountNumber = 0
    this.sequence = 0
  }

  compare(address: Address): boolean {
    return this.address.toLowerCase() === address.address.toLowerCase()
  }

  /**
   * Create an address instance from a bech32-encoded address and a prefix
   * @param {string} bech32 bech32-encoded address
   * @param {string} prefix
   * @return {Address}
   * @throws {Error} if bech is not a valid bech32-encoded address
   */
  static fromBech32(bech: string): Address {
    const address = Buffer.from(
      bech32.fromWords(bech32.decode(bech).words),
    ).toString('hex')
    const addressInHex = address.startsWith('0x') ? address : `0x${address}`

    return Address.fromHex(addressInHex)
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
    const addressBuffer = EthereumUtilsAddress.fromString(hex).toBuffer()
    const address = bech32.encode(prefix, bech32.toWords(addressBuffer))

    return new Address(address)
  }

  /**
   * Convert an address instance to a bech32-encoded account address
   * @param {string} prefix
   * @returns {string}
   */
  toBech32(prefix: string = BECH32_ADDR_ACC_PREFIX): string {
    const addressBuffer = EthereumUtilsAddress.fromString(
      this.toHex(),
    ).toBuffer()

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
    return this.address.startsWith('0x') ? this.address : `0x${this.address}`
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
