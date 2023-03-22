import ExecArgCW20Send from './exec-args/ExecArgCW20Send'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens'
import ExecArgRegisterVault from './exec-args/ExecArgRegisterVault'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance'
import ExecArgUpdateAMMVaultConfig from './exec-args/ExecArgUpdateAMMVaultConfig'
import ExecArgUpdateSpotVaultConfig from './exec-args/ExecArgUpdateSpotVaultConfig'
import ExecArgExecuteUnlockedRedemption from './exec-args/ExecArgExecuteUnlockedRedemption'
import ExecArgUpdateDerivativeVaultConfig from './exec-args/ExecArgUpdateDerivativeVaultConfig'
import ExecArgRequestTimeLockedRedemption from './exec-args/ExecArgRequestTimeLockedRedemption'
import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem'
import ExecPrivilegedArgRegisterVault from './exec-priv-args/ExecPrivilegedRegisterVault'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe'

export type ExecArgs =
  | ExecArgCW20Send
  | ExecArgSubmitVaa
  | ExecArgCW20Transfer
  | ExecArgDepositTokens
  | ExecArgRegisterVault
  | ExecArgInitiateTransfer
  | ExecArgIncreaseAllowance
  | ExecArgUpdateAMMVaultConfig
  | ExecArgUpdateSpotVaultConfig
  | ExecArgExecuteUnlockedRedemption
  | ExecArgUpdateDerivativeVaultConfig
  | ExecArgRequestTimeLockedRedemption
  | ExecArgCW20AdapterRedeemAndTransfer

export type ExecPrivilegedArgs =
  | ExecPrivilegedArgVaultRedeem
  | ExecPrivilegedArgRegisterVault
  | ExecPrivilegedArgVaultSubscribe
