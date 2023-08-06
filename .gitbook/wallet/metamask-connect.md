# Connecting dirictly with Metamask

### Setting up services

```ts
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  MetamaskException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

import {
  Msgs,
  TxGrpcApi,
  hexToBuff,
  hexToBase64,
  SIGN_AMINO,
  BaseAccount,
  ChainGrpcBankApi,
  ChainRestAuthApi,
  createTransaction,
  createTxRawEIP712,
  createWeb3Extension,
  getEip712TypedData,
  getEthereumAddress,
  IndexerGrpcSpotApi,
  ChainRestTendermintApi,
} from '@injectivelabs/sdk-ts'

export const CHAIN_ID = ChainId.Mainnet
export const ETHEREUM_CHAIN_ID = EthereumChainId.Mainnet
export const NETWORK = Network.MainnetK8s

export const ENDPOINTS = getNetworkEndpoints(NETWORK)
```

### Connecting Metamask

```ts
async connect() {
      let ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new MetamaskException(new Error("Metamask is not installed"));
      }

      try {
        const ethereumAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const [ethereumAddress] = ethereumAccounts;
        const address = getInjectiveAddress(ethereumAddress);

        return address
      } catch (e: unknown) {
        throw new MetamaskException(new Error((e as any).message), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
        });
      }
    },
```

### Create and Broadcast Transaction

```ts
export const createAndBroadcastTransaction = async ({
  address,
  message,
}: {
  address: string
  message: Msgs
}) => {
  const signEip712TypedData = async (
    ethereumAddress: string,
    eip712json: string,
  ) => {
    try {
      return await (window as any).ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [ethereumAddress, eip712json],
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
      })
    }
  }

  const ethereumAddress = getEthereumAddress(address)

  /** Account Details **/
  const chainRestAuthApi = new ChainRestAuthApi(ENDPOINTS.rest)
  const accountDetailsResponse = await chainRestAuthApi.fetchAccount(address)
  const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse)
  const accountDetails = baseAccount.toAccountDetails()

  /** Block Details */
  const chainRestTendermintApi = new ChainRestTendermintApi(ENDPOINTS.rest)
  const latestBlock = await chainRestTendermintApi.fetchLatestBlock()
  const latestHeight = latestBlock.header.height
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(
    DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  )

  /** EIP712 for signing on Ethereum wallets */
  const eip712TypedData = getEip712TypedData({
    msgs: message,
    fee: getStdFee(DEFAULT_GAS_LIMIT.toString()),
    tx: {
      accountNumber: accountDetails.accountNumber.toString(),
      sequence: accountDetails.sequence.toString(),
      timeoutHeight: timeoutHeight.toFixed(),
      chainId: ChainId.Mainnet,
    },
    ethereumChainId: ETHEREUM_CHAIN_ID,
  })

  /** Signing on Ethereum */
  const signature = await signEip712TypedData(
    ethereumAddress,
    JSON.stringify(eip712TypedData),
  )
  const signatureBuff = hexToBuff(signature)

  /** Get Public Key of the signer */
  const publicKeyHex = recoverTypedSignaturePubKey(eip712TypedData, signature)
  const publicKeyBase64 = hexToBase64(publicKeyHex)

  /** Preparing the transaction for client broadcasting */
  const txApi = new TxGrpcApi(ENDPOINTS.grpc)
  const { txRaw } = createTransaction({
    chainId: CHAIN_ID,
    message: message,
    signMode: SIGN_AMINO,
    fee: getStdFee(DEFAULT_GAS_LIMIT.toString()),
    pubKey: publicKeyBase64,
    sequence: baseAccount.sequence,
    timeoutHeight: timeoutHeight.toNumber(),
    accountNumber: baseAccount.accountNumber,
  })

  const web3Extension = createWeb3Extension({
    ethereumChainId: ETHEREUM_CHAIN_ID,
  })
  const txRawEip712 = createTxRawEIP712(txRaw, web3Extension)

  /** Append Signatures */
  txRawEip712.signatures = [signatureBuff]

  /** Broadcast the transaction */
  const response = await txApi.broadcast(txRawEip712)

  if (response.code !== 0) {
    throw new TransactionException(new Error(response.rawLog), {
      code: UnspecifiedErrorCode,
      contextCode: response.code,
      contextModule: response.codespace,
    })
  }

  return response
}
```

```ts
async transfer({
      amount,
      destination,
    }: {
      amount: string;
      destination: string;
    }) {

      if (!walletStore.isUserWalletConnected) {
        return;
      }

      const message = MsgSend.fromJSON({
        srcInjectiveAddress: injectiveAddress,
        dstInjectiveAddress: destination,
        amount: {
          denom: "inj",
          amount: new BigNumberInBase(amount).toWei().toFixed(),
        },
      });

      await createAndBroadcastTransaction({
        address: injectiveAddress,
        message,
      });
    },
  },
```
