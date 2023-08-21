import ExecArgUnStake from './exec-args/ExecArgUnstake'
import ExecArgGeneric from './exec-args/ExecArgGeneric'
import ExecArgCW20Send from './exec-args/ExecArgCW20Send'
import ExecArgSubmitVaa from './exec-args/ExecArgSubmitVaa'
import ExecArgClaimStake from './exec-args/ExecArgClaimStake'
import ExecArgClaimRewards from './exec-args/ExecArgClaimRewards'
import ExecArgCW20Transfer from './exec-args/ExecArgCW20Transfer'
import ExecArgDepositTokens from './exec-args/ExecArgDepositTokens'
import ExecArgRegisterVault from './exec-args/ExecArgRegisterVault'
import ExecArgSwapMinOutput from './exec-args/ExecArgSwapMinOutput'
import ExecArgSwapExactOutput from './exec-args/ExecArgSwapExactOutput'
import ExecArgInitiateTransfer from './exec-args/ExecArgInitiateTransfer'
import ExecArgIncreaseAllowance from './exec-args/ExecArgIncreaseAllowance'
import ExecArgRemoveGridStrategy from './exec-args/ExecArgRemoveGridStrategy'
import ExecArgUpdateAMMVaultConfig from './exec-args/ExecArgUpdateAMMVaultConfig'
import ExecArgUpdateSpotVaultConfig from './exec-args/ExecArgUpdateSpotVaultConfig'
import ExecArgCreateSpotGridStrategy from './exec-args/ExecArgCreateSpotGridStrategy'

import ExecArgUpdateOffChainVaultConfig from './exec-args/ExecArgUpdateOffChainVaultConfig'
import ExecArgUpdateDerivativeVaultConfig from './exec-args/ExecArgUpdateDerivativeVaultConfig'
import ExecArgUpdateStakingContractConfig from './exec-args/ExecArgUpdateStakingContractConfig'
import ExecArgCW20AdapterRedeemAndTransfer from './exec-args/ExecArgCW20AdapterRedeemAndTransfer'
import ExecArgUpdateAllocatorContractConfig from './exec-args/ExecArgUpdateAllocatorContractConfig'

import ExecPrivilegedArgVaultRedeem from './exec-priv-args/ExecPrivilegedArgVaultRedeem'
import ExecPrivilegedArgVaultSubscribe from './exec-priv-args/ExecPrivilegedArgVaultSubscribe'
import ExecPrivilegedArgOffChainVaultRedeem from './exec-priv-args/ExecPrivilegedArgOffChainVaultRedeem'
import ExecPrivilegedArgOffChainVaultSubscribe from './exec-priv-args/ExecPrivilegedArgOffChainVaultSubscribe'

export type ExecArgs =
  | ExecArgGeneric
  | ExecArgUnStake
  | ExecArgCW20Send
  | ExecArgSubmitVaa
  | ExecArgClaimStake
  | ExecArgClaimRewards
  | ExecArgCW20Transfer
  | ExecArgSwapMinOutput
  | ExecArgDepositTokens
  | ExecArgRegisterVault
  | ExecArgCreateSpotGridStrategy
  | ExecArgRemoveGridStrategy
  | ExecArgSwapExactOutput
  | ExecArgInitiateTransfer
  | ExecArgIncreaseAllowance
  | ExecArgUpdateAMMVaultConfig
  | ExecArgUpdateSpotVaultConfig
  | ExecArgUpdateOffChainVaultConfig
  | ExecArgUpdateDerivativeVaultConfig
  | ExecArgUpdateStakingContractConfig
  | ExecArgCW20AdapterRedeemAndTransfer
  | ExecArgUpdateAllocatorContractConfig

export type ExecPrivilegedArgs =
  | ExecPrivilegedArgVaultRedeem
  | ExecPrivilegedArgVaultSubscribe
  | ExecPrivilegedArgOffChainVaultRedeem
  | ExecPrivilegedArgOffChainVaultSubscribe
