import { toAccount } from 'viem/accounts'
import {
  uint8ArrayToHex,
  stringToUint8Array,
  getEthereumAddress,
} from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  WalletException,
  isThrownException,
  UnspecifiedErrorCode,
  PrivyWalletSessionException,
} from '@injectivelabs/exceptions'
import {
  isHex,
  toHex,
  keccak256,
  getAddress,
  bytesToHex,
  hexToBytes,
  stringToHex,
  hashTypedData,
  isAddressEqual,
  parseSignature,
  serializeTransaction,
} from 'viem'
import {
  WalletAction,
  broadcastTxRaw,
  WalletDeviceType,
  getViemPublicClient,
  getViemWalletClient,
  BaseConcreteStrategy,
  toViemTransactionRequest,
  getEip1193ProviderForAccount,
} from '@injectivelabs/wallet-base'
import type { Hex, Hash, LocalAccount, SignableMessage } from 'viem'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  PrivyMetadata,
  Eip1193Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

// Privy returns r‖s‖v in several shapes; Injective expects v as 27/28
const normalizeSignature = (result: unknown): Hex => {
  const raw =
    typeof result === 'string'
      ? result
      : result && typeof result === 'object' && 'signature' in result
        ? String((result as { signature: unknown }).signature)
        : ''

  if (!/^(0x)?[0-9a-fA-F]+$/.test(raw)) {
    throw new Error('Privy returned an invalid signature')
  }

  const bytes = hexToBytes((raw.startsWith('0x') ? raw : `0x${raw}`) as Hex)

  if (bytes.length !== 65) {
    throw new Error(`Expected a 65-byte signature, got ${bytes.length} bytes`)
  }

  if (bytes[64] < 27) {
    bytes[64] += 27
  }

  return bytesToHex(bytes)
}

// Always hex, so Privy never has to guess whether a '0x…' string is text or bytes
const toPersonalSignMessage = (message: SignableMessage) => {
  if (typeof message === 'string') {
    return stringToHex(message)
  }

  return typeof message.raw === 'string' ? message.raw : bytesToHex(message.raw)
}

// The error and its causes, where viem keeps the provider's and our own errors
const getCauses = (e: unknown) => {
  const causes: object[] = []

  for (let error = e; error && typeof error === 'object'; ) {
    // Bounded: a cause can point back at its error
    if (causes.length === 5 || causes.includes(error)) {
      break
    }

    causes.push(error)
    error = (error as { cause?: unknown }).cause
  }

  return causes
}

/** Signs through the Privy embedded wallet provider passed in `metadata.privy`. */
export class PrivyWalletStrategy
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public evmOptions: WalletStrategyEvmOptions

  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super(args)

    this.evmOptions = args.evmOptions
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  // WalletStrategy sends every setMetadata call to all strategies
  setMetadata(metadata?: { privy?: PrivyMetadata }) {
    if (metadata?.privy) {
      this.metadata = { ...this.metadata, privy: metadata.privy }
    }
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(Boolean(this.metadata?.privy?.address))
  }

  public async disconnect() {
    // The app signs out through the Privy SDK; here we only forget the wallet
    if (this.metadata?.privy) {
      this.metadata = { ...this.metadata, privy: undefined }
    }
  }

  async getAddresses(): Promise<string[]> {
    try {
      return [
        getAddress(this.getPrivyMetadata(WalletAction.GetAccounts).address),
      ]
    } catch (e: unknown) {
      throw this.toWalletException(e, WalletAction.GetAccounts)
    }
  }

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw this.toWalletException(
      new Error('getAddressesInfo is not implemented'),
      WalletAction.GetAccounts,
    )
  }

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${uint8ArrayToHex(
        stringToUint8Array(
          `Confirmation for ${address} at time: ${Date.now()}`,
        ),
      )}`,
    )
  }

  async sendEvmTransaction(
    transaction: unknown,
    args: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const action = WalletAction.SendEvmTransaction

    try {
      const account = this.getCheckedAccount(args.address, action)
      const chainId = args.evmChainId || this.evmOptions.evmChainId
      const client = getViemWalletClient({
        chainId,
        account,
        rpcUrl: this.getRpcUrl(chainId),
      })

      // Prepared and sent through our RPC; Privy only signs the hash
      return await client.sendTransaction({
        ...toViemTransactionRequest(transaction, account.address, chainId),
        account,
        chain: client.chain,
      })
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<any> {
    return broadcastTxRaw(transaction, options)
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const action = WalletAction.SignTransaction

    try {
      const account = this.getCheckedAccount(address, action)
      let parsedData

      try {
        parsedData = JSON.parse(eip712json)
      } catch {
        throw new Error('Failed to parse EIP-712 data: Invalid JSON format')
      }

      if (
        parsedData.domain?.chainId &&
        typeof parsedData.domain.chainId === 'string'
      ) {
        parsedData.domain.chainId = Number(parsedData.domain.chainId)
      }

      // Signs the digest like Turnkey: eth_signTypedData_v4 can reject Injective's domain
      return await account.signTypedData({
        types: parsedData.types,
        domain: parsedData.domain,
        message: parsedData.message,
        primaryType: parsedData.primaryType,
      })
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw this.toWalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      WalletAction.SignTransaction,
    )
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw this.toWalletException(
      new Error('This wallet does not support signAminoCosmosTransaction'),
      WalletAction.SignTransaction,
    )
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    const action = WalletAction.SignArbitrary

    try {
      const account = this.getCheckedAccount(signer, action)

      return await account.signMessage({
        // A hex string is bytes, as in the other EVM strategies
        message:
          typeof data === 'string' && !isHex(data) ? data : { raw: data },
      })
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  async getEthereumChainId(): Promise<string> {
    return Promise.resolve(toHex(this.evmOptions.evmChainId))
  }

  async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<Record<string, any>> {
    const action = WalletAction.GetEvmTransactionReceipt
    const chainId = evmChainId || this.evmOptions.evmChainId
    let publicClient: ReturnType<typeof getViemPublicClient>

    try {
      publicClient = getViemPublicClient(chainId, this.getRpcUrl(chainId))
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }

    try {
      return await publicClient.waitForTransactionReceipt({
        hash: txHash as Hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })
    } catch {
      throw this.toWalletException(
        new Error(
          `Failed to retrieve transaction receipt for txHash: ${txHash}`,
        ),
        action,
      )
    }
  }

  async getPubKey(): Promise<string> {
    throw this.toWalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
      WalletAction.GetAccounts,
    )
  }

  // Signs through Privy and sends through evmOptions, like the Turnkey strategy
  public async getEip1193Provider(): Promise<Eip1193Provider> {
    try {
      return await getEip1193ProviderForAccount(
        this.getAccount(WalletAction.GetAccounts),
        this.evmOptions.evmChainId,
        { rpcUrl: this.evmOptions.rpcUrl, rpcUrls: this.evmOptions.rpcUrls },
      )
    } catch (e: unknown) {
      throw this.toWalletException(e, WalletAction.GetAccounts)
    }
  }

  private getPrivyMetadata(action: WalletAction): PrivyMetadata {
    const privy = this.metadata?.privy

    if (!privy?.address) {
      throw new PrivyWalletSessionException(
        new Error('Privy metadata with an address is required'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: action,
        },
      )
    }

    return privy
  }

  /**
   * The Privy wallet as a viem account. Hashes (transactions, EIP-712) are
   * signed with secp256k1_sign, so Privy never sees the decoded transaction.
   */
  private getAccount(action: WalletAction): LocalAccount {
    const address = getAddress(this.getPrivyMetadata(action).address)
    // Read again on every request: the wallet can change while viem prepares a transaction
    const request = async (method: string, params: unknown[]) => {
      const privy = this.getPrivyMetadata(action)

      if (!isAddressEqual(privy.address as Hex, address)) {
        throw new WalletException(
          new Error(`The Privy wallet is no longer ${address}`),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: action,
          },
        )
      }

      return (await privy.getProvider()).request({ method, params })
    }
    const sign = async ({ hash }: { hash: Hex }) =>
      normalizeSignature(await request('secp256k1_sign', [hash]))

    return toAccount({
      address,
      sign,
      signMessage: async ({ message }) =>
        normalizeSignature(
          await request('personal_sign', [
            toPersonalSignMessage(message),
            address,
          ]),
        ),
      signTypedData: async (typedData) =>
        sign({ hash: hashTypedData(typedData) }),
      // Like viem's own signTransaction: a blob transaction is signed without its sidecars
      signTransaction: async (
        transaction,
        { serializer = serializeTransaction } = {},
      ) => {
        const signable =
          transaction.type === 'eip4844'
            ? { ...transaction, sidecars: false as const }
            : transaction
        const signature = await sign({
          hash: keccak256(await serializer(signable)),
        })

        return serializer(transaction, parseSignature(signature))
      },
    })
  }

  // Accepts the signer as 0x or inj1
  private getCheckedAccount(address: string, action: WalletAction) {
    const account = this.getAccount(action)

    if (getAddress(getEthereumAddress(address)) !== account.address) {
      throw new Error(`Address ${address} is not the connected Privy wallet`)
    }

    return account
  }

  private getRpcUrl(chainId: EvmChainId) {
    const url = this.evmOptions.rpcUrls?.[chainId] || this.evmOptions.rpcUrl

    if (!url) {
      throw new Error('Please pass rpcUrl within the evmOptions')
    }

    return url
  }

  private toWalletException(e: unknown, action: WalletAction) {
    const causes = getCauses(e)
    // Ours already (e.g. a session error), also when viem wrapped it as the cause
    const thrown = causes.find((error) => isThrownException(error as Error))

    if (thrown) {
      return thrown as Error
    }

    // viem's shortMessage leaves out its request and version details. A viem error
    // wrapping the provider's has none, so the provider's own message is used
    const shortMessage = causes
      .map((error) => (error as { shortMessage?: unknown }).shortMessage)
      .find((text) => typeof text === 'string' && text)
    const { message } = (causes.at(-1) ?? {}) as { message?: unknown }
    const text =
      typeof shortMessage === 'string'
        ? shortMessage
        : typeof message === 'string'
          ? message
          : String(e)
    // EIP-1193 errors carry e.g. 4001 (user rejected); the provider's is the deepest
    const providerCode = causes
      .map((error) => (error as { code?: unknown }).code)
      .reverse()
      .find((code) => typeof code === 'number')

    return new WalletException(new Error(text), {
      code: UnspecifiedErrorCode,
      type: ErrorType.WalletError,
      contextModule: action,
      ...(providerCode !== undefined ? { contextCode: providerCode } : {}),
    })
  }
}
