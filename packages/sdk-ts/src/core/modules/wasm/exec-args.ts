import ExecArgCW20Send from './exec-args/ExecArgCW20Send.js'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa.js'
import ExecArgCreateRound from './exec-args/ExecArgCreateRound.js'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer.js'
import ExecArgFundCampaign from './exec-args/ExecArgFundCampaign.js'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens.js'
import ExecArgSwapMinOutput from './exec-args/ExecArgSwapMinOutput.js'
import ExecArgCreateCampaign from './exec-args/ExecArgCreateCampaign.js'
import ExecArgSwapExactOutput from './exec-args/ExecArgSwapExactOutput.js'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer.js'
import ExecArgUpdateGridConfig from './exec-args/ExecArgUpdateGridConfig.js'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance.js'
import ExecArgRemoveGridStrategy from './exec-args/ExecArgRemoveGridStrategy.js'
import ExecArgCreateSpotGridStrategy from './exec-args/ExecArgCreateSpotGridStrategy.js'
import ExecArgCreatePerpGridStrategy from './exec-args/ExecArgCreatePerpGridStrategy.js'

import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer.js'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem.js'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe.js'
import ExecPrivilegedArgOffChainVaultRedeem from './exec-priv-args/ExecPrivilegedArgOffChainVaultRedeem.js'
import ExecPrivilegedArgOffChainVaultSubscribe from './exec-priv-args/ExecPrivilegedArgOffChainVaultSubscribe.js'

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
