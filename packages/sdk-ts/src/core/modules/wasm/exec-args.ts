import ExecArgConvert from './exec-args/ExecArgSwap'
import ExecArgStake from './exec-args/ExecArgStake'
import ExecArgUnStake from './exec-args/ExecArgUnstake'
import ExecArgClaimStake from './exec-args/ExecArgClaimStake'
import ExecArgClaimRewards from './exec-args/ExecArgClaimRewards'
import ExecArgCW20Send from './exec-args/ExecArgCW20Send'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens'
import ExecArgRegisterVault from './exec-args/ExecArgRegisterVault'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance'
import ExecArgUpdateAMMVaultConfig from './exec-args/ExecArgUpdateAMMVaultConfig'
import ExecArgUpdateSpotVaultConfig from './exec-args/ExecArgUpdateSpotVaultConfig'
import ExecArgUpdateDerivativeVaultConfig from './exec-args/ExecArgUpdateDerivativeVaultConfig'
import ExecArgUpdateStakingContractConfig from './exec-args/ExecArgUpdateStakingContractConfig'
import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer'
import ExecArgUpdateAllocatorContractConfig from './exec-args/ExecArgUpdateAllocatorContractConfig'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe'

export type ExecArgs =
  | ExecArgConvert
  | ExecArgStake
  | ExecArgUnStake
  | ExecArgCW20Send
  | ExecArgSubmitVaa
  | ExecArgClaimStake
  | ExecArgClaimRewards
  | ExecArgCW20Transfer
  | ExecArgDepositTokens
  | ExecArgRegisterVault
  | ExecArgInitiateTransfer
  | ExecArgIncreaseAllowance
  | ExecArgUpdateAMMVaultConfig
  | ExecArgUpdateSpotVaultConfig
  | ExecArgUpdateDerivativeVaultConfig
  | ExecArgUpdateStakingContractConfig
  | ExecArgCW20AdapterRedeemAndTransfer
  | ExecArgUpdateAllocatorContractConfig

export type ExecPrivilegedArgs =
  | ExecPrivilegedArgVaultRedeem
  | ExecPrivilegedArgVaultSubscribe
