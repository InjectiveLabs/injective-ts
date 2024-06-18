import ExecArgCW20Send from './exec-args/ExecArgCW20Send'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa'
import ExecArgCreateRound from './exec-args/ExecArgCreateRound'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer'
import ExecArgFundCampaign from './exec-args/ExecArgFundCampaign'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens'
import ExecArgSwapMinOutput from './exec-args/ExecArgSwapMinOutput'
import ExecArgCreateCampaign from './exec-args/ExecArgCreateCampaign'
import ExecArgSwapExactOutput from './exec-args/ExecArgSwapExactOutput'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer'
import ExecArgUpdateGridConfig from './exec-args/ExecArgUpdateGridConfig'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance'
import ExecArgRemoveGridStrategy from './exec-args/ExecArgRemoveGridStrategy'
import ExecArgCreateSpotGridStrategy from './exec-args/ExecArgCreateSpotGridStrategy'
import ExecArgCreatePerpGridStrategy from './exec-args/ExecArgCreatePerpGridStrategy'

import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe'
import ExecPrivilegedArgOffChainVaultRedeem from './exec-priv-args/ExecPrivilegedArgOffChainVaultRedeem'
import ExecPrivilegedArgOffChainVaultSubscribe from './exec-priv-args/ExecPrivilegedArgOffChainVaultSubscribe'

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
