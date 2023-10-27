import ExecArgCW20Send from './exec-args/ExecArgCW20Send'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens'
import ExecArgSwapMinOutput from './exec-args/ExecArgSwapMinOutput'
import ExecArgSwapExactOutput from './exec-args/ExecArgSwapExactOutput'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance'
import ExecArgRemoveGridStrategy from './exec-args/ExecArgRemoveGridStrategy'
import ExecArgCreateSpotGridStrategy from './exec-args/ExecArgCreateSpotGridStrategy'

import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe'
import ExecPrivilegedArgOffChainVaultRedeem from './exec-priv-args/ExecPrivilegedArgOffChainVaultRedeem'
import ExecPrivilegedArgOffChainVaultSubscribe from './exec-priv-args/ExecPrivilegedArgOffChainVaultSubscribe'

export type ExecArgs =
  | ExecArgCW20Send
  | ExecArgSubmitVaa
  | ExecArgCW20Transfer
  | ExecArgSwapMinOutput
  | ExecArgDepositTokens
  | ExecArgCreateSpotGridStrategy
  | ExecArgRemoveGridStrategy
  | ExecArgSwapExactOutput
  | ExecArgInitiateTransfer
  | ExecArgIncreaseAllowance
  | ExecArgCW20AdapterRedeemAndTransfer

export type ExecPrivilegedArgs =
  | ExecPrivilegedArgVaultRedeem
  | ExecPrivilegedArgVaultSubscribe
  | ExecPrivilegedArgOffChainVaultRedeem
  | ExecPrivilegedArgOffChainVaultSubscribe
