import { WalletErrorActionModule } from '@injectivelabs/exceptions'
import * as LightWalletBase from './light.js'
import * as RuntimeLight from './runtime-light.js'
import {
  DEFAULT_ADDRESS_SEARCH_LIMIT as ROOT_DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_BASE_DERIVATION_PATH as ROOT_DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_NUM_ADDRESSES_TO_FETCH as ROOT_DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from './utils/constants.js'
import {
  Wallet,
  isEvmWallet,
  WalletAction,
  BroadcastMode,
  MagicProvider,
  isCosmosWallet,
  TurnkeyProvider,
  WalletDeviceType,
  StrategyEventType,
  isEvmBrowserWallet,
  WalletEventListener,
  isEip712V2OnlyWallet,
  isCosmosBrowserWallet,
  isCosmosAminoOnlyWallet,
  EvmWalletProviderErrorCode,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_BASE_DERIVATION_PATH,
  WalletStrategyEmitterEventType,
  WalletConnectStrategyEventType,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from './runtime-light.js'
import {
  Wallet as RootWallet,
  isEvmWallet as rootIsEvmWallet,
  WalletAction as RootWalletAction,
  BroadcastMode as RootBroadcastMode,
  MagicProvider as RootMagicProvider,
  isCosmosWallet as rootIsCosmosWallet,
  TurnkeyProvider as RootTurnkeyProvider,
  WalletDeviceType as RootWalletDeviceType,
  StrategyEventType as RootStrategyEventType,
  isEvmBrowserWallet as rootIsEvmBrowserWallet,
  WalletEventListener as RootWalletEventListener,
  isEip712V2OnlyWallet as rootIsEip712V2OnlyWallet,
  isCosmosBrowserWallet as rootIsCosmosBrowserWallet,
  isCosmosAminoOnlyWallet as rootIsCosmosAminoOnlyWallet,
  EvmWalletProviderErrorCode as RootEvmWalletProviderErrorCode,
  WalletStrategyEmitterEventType as RootWalletStrategyEmitterEventType,
  WalletConnectStrategyEventType as RootWalletConnectStrategyEventType,
} from './index.js'

describe('runtime-light wallet exports', () => {
  it('keeps the light entry aligned with runtime-light', () => {
    expect(LightWalletBase).toEqual(RuntimeLight)
  })

  it('matches root enum and event exports', () => {
    expect(Wallet).toEqual(RootWallet)
    expect(WalletAction).toEqual(RootWalletAction)
    expect(BroadcastMode).toEqual(RootBroadcastMode)
    expect(MagicProvider).toEqual(RootMagicProvider)
    expect(TurnkeyProvider).toEqual(RootTurnkeyProvider)
    expect(StrategyEventType).toEqual(RootStrategyEventType)
    expect(WalletDeviceType).toEqual(RootWalletDeviceType)
    expect(WalletEventListener).toEqual(RootWalletEventListener)
    expect(EvmWalletProviderErrorCode).toEqual(RootEvmWalletProviderErrorCode)
    expect(WalletConnectStrategyEventType).toEqual(
      RootWalletConnectStrategyEventType,
    )
    expect(WalletStrategyEmitterEventType).toEqual(
      RootWalletStrategyEmitterEventType,
    )
    expect(RootWalletAction).toEqual(WalletErrorActionModule)
  })

  it('matches root wallet category helpers', () => {
    const wallets = Object.values(Wallet)

    expect(wallets.map(isEvmWallet)).toEqual(wallets.map(rootIsEvmWallet))
    expect(wallets.map(isCosmosWallet)).toEqual(wallets.map(rootIsCosmosWallet))
    expect(wallets.map(isEvmBrowserWallet)).toEqual(
      wallets.map(rootIsEvmBrowserWallet),
    )
    expect(wallets.map(isEip712V2OnlyWallet)).toEqual(
      wallets.map(rootIsEip712V2OnlyWallet),
    )
    expect(wallets.map(isCosmosBrowserWallet)).toEqual(
      wallets.map(rootIsCosmosBrowserWallet),
    )
    expect(wallets.map(isCosmosAminoOnlyWallet)).toEqual(
      wallets.map(rootIsCosmosAminoOnlyWallet),
    )
  })

  it('matches root lightweight constants', () => {
    expect(DEFAULT_ADDRESS_SEARCH_LIMIT).toBe(ROOT_DEFAULT_ADDRESS_SEARCH_LIMIT)
    expect(DEFAULT_BASE_DERIVATION_PATH).toBe(ROOT_DEFAULT_BASE_DERIVATION_PATH)
    expect(DEFAULT_NUM_ADDRESSES_TO_FETCH).toBe(
      ROOT_DEFAULT_NUM_ADDRESSES_TO_FETCH,
    )
  })
})
