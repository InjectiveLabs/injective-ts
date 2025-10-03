import type ExecArgCW20Send from './exec-args/ExecArgCW20Send.js'
import type ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa.js'
import type ExecArgCreateRound from './exec-args/ExecArgCreateRound.js'
import type ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer.js'
import type ExecArgFundCampaign from './exec-args/ExecArgFundCampaign.js'
import type ExecArgDepositTokens from './exec-args/ExecArgDepositTokens.js'
import type ExecArgSwapMinOutput from './exec-args/ExecArgSwapMinOutput.js'
import type ExecArgCreateCampaign from './exec-args/ExecArgCreateCampaign.js'
import type ExecArgSwapExactOutput from './exec-args/ExecArgSwapExactOutput.js'
import type ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer.js'
import type ExecArgUpdateGridConfig from './exec-args/ExecArgUpdateGridConfig.js'
import type ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance.js'
import type ExecArgRemoveGridStrategy from './exec-args/ExecArgRemoveGridStrategy.js'
import type ExecArgCreatePerpGridStrategy from './exec-args/ExecArgCreatePerpGridStrategy.js'
import type ExecArgCreateSpotGridStrategy from './exec-args/ExecArgCreateSpotGridStrategy.js'
import type ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem.js'
import type ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe.js'
import type ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer.js'
import type ExecPrivilegedArgOffChainVaultRedeem from './exec-priv-args/ExecPrivilegedArgOffChainVaultRedeem.js'
import type ExecPrivilegedArgOffChainVaultSubscribe from './exec-priv-args/ExecPrivilegedArgOffChainVaultSubscribe.js'

export type ExecArgs =
  | ExecArgCW20Send
  | ExecArgSubmitVaa
  | ExecArgCreateRound
  | ExecArgCW20Transfer
  | ExecArgFundCampaign
  | ExecArgSwapMinOutput
  | ExecArgDepositTokens
  | ExecArgCreateCampaign
  | ExecArgSwapExactOutput
  | ExecArgInitiateTransfer
  | ExecArgUpdateGridConfig
  | ExecArgIncreaseAllowance
  | ExecArgRemoveGridStrategy
  | ExecArgCreateSpotGridStrategy
  | ExecArgCreatePerpGridStrategy
  | ExecArgCW20AdapterRedeemAndTransfer

export type ExecPrivilegedArgs =
  | ExecPrivilegedArgVaultRedeem
  | ExecPrivilegedArgVaultSubscribe
  | ExecPrivilegedArgOffChainVaultRedeem
  | ExecPrivilegedArgOffChainVaultSubscribe
