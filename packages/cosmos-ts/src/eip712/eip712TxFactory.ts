import { StdFee } from '@cosmjs/amino'
import { Msg } from '@cosmjs/launchpad'
import { ChainId } from '@injectivelabs/ts-types'
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from '@injectivelabs/utils'
import { Eip712MessageTypeFactory } from './msg-values'

export class Eip712TxFactory {
  private chainId: ChainId

  private cosmosChainId: string

  private injectiveAddress: string

  private msgs: Msg[]

  private sequence: number

  private accountNumber: number

  private memo: string

  private fee?: StdFee

  constructor({
    chainId,
    cosmosChainId,
    injectiveAddress,
    sequence,
    accountNumber,
    memo,
    fee,
    msgs,
  }: {
    chainId: ChainId
    cosmosChainId: string
    injectiveAddress: string
    sequence: number
    accountNumber: number
    memo?: string
    timeoutHeight?: string
    fee?: StdFee
    msgs: Msg[]
  }) {
    this.chainId = chainId
    this.cosmosChainId = cosmosChainId
    this.injectiveAddress = injectiveAddress
    this.sequence = sequence
    this.accountNumber = accountNumber
    this.memo = memo || ''
    this.fee = fee
    this.msgs = msgs
  }

  static make(options: {
    chainId: ChainId
    cosmosChainId: string
    injectiveAddress: string
    sequence: number
    accountNumber: number
    memo?: string
    timeoutHeight?: string
    fee?: StdFee
    msgs: Msg[]
  }) {
    return new Eip712TxFactory(options).create()
  }

  create() {
    const {
      chainId,
      cosmosChainId,
      injectiveAddress,
      sequence,
      memo,
      accountNumber,
      fee,
      msgs,
    } = this
    const messages = msgs.map((m) => m.value)
    // Considering that there is only one type of message, we can use the first
    const [eip712Type] = msgs.map((m) => Eip712MessageTypeFactory.make(m.type))
    const types = Eip712TxFactory.generateTypes(eip712Type)

    const actualFee =
      fee ||
      Eip712TxFactory.generateFee({
        denom: 'inj',
        amount: DEFAULT_GAS_PRICE.toString(),
        feePayer: injectiveAddress,
        gas: DEFAULT_GAS_LIMIT.toString(),
      })

    const actualMessage = Eip712TxFactory.generateMessageWithMultipleMsgs({
      accountNumber,
      sequence,
      cosmosChainId,
      memo,
      fee: actualFee,
      msgs: messages,
    })

    return {
      types,
      primaryType: 'Tx',
      domain: {
        chainId,
        name: 'Injective Web3',
        version: '1.0.0',
        verifyingContract: 'cosmos',
        salt: Date.now().toString(),
      },
      message: actualMessage,
    }
  }

  private static generateMessageWithMultipleMsgs({
    accountNumber,
    sequence,
    cosmosChainId,
    memo,
    fee,
    msgs,
  }: {
    accountNumber: string | number
    sequence: string | number
    cosmosChainId: string
    memo?: string
    fee: Record<string, any>
    msgs: Record<string, any>[]
  }) {
    return {
      account_number: accountNumber.toString(),
      sequence: sequence.toString(),
      chain_id: cosmosChainId,
      fee,
      memo,
      msgs,
    }
  }

  private static generateTypes(msgValues: Record<string, any>) {
    const types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'string' },
        { name: 'salt', type: 'string' },
      ],
      Tx: [
        { name: 'account_number', type: 'string' },
        { name: 'chain_id', type: 'string' },
        { name: 'fee', type: 'Fee' },
        { name: 'memo', type: 'string' },
        { name: 'msgs', type: 'Msg[]' },
        { name: 'sequence', type: 'string' },
      ],
      Fee: [
        { name: 'feePayer', type: 'string' },
        { name: 'amount', type: 'Coin[]' },
        { name: 'gas', type: 'string' },
      ],
      Coin: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      Msg: [
        { name: 'type', type: 'string' },
        { name: 'value', type: 'MsgValue' },
      ],
    }

    return { ...types, ...msgValues }
  }

  private static generateFee({
    amount,
    denom,
    gas,
    feePayer,
  }: {
    amount: string
    denom: string
    feePayer: string
    gas: string
  }) {
    return {
      amount: [
        {
          amount,
          denom,
        },
      ],
      gas,
      feePayer,
    }
  }
}
