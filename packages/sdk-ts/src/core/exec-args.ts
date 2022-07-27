import ExecArgRegisterVault from './wasm/exec-args/ExecArgRegisterVault'
import ExecArgsInstantiateDerivativeVault from './wasm/exec-args/ExecArgsInstantiateDerivativeVault'
import ExecArgsInstantiateSpotVault from './wasm/exec-args/ExecArgsInstantiateSpotVault'
import ExecArgsUpdateDerivativeVaultConfig from './wasm/exec-args/ExecArgsUpdateDerivativeVaultConfig'
import ExecArgsUpdateSpotVaultConfig from './wasm/exec-args/ExecArgsUpdateSpotVaultConfig'
import ExecArgVaultRedeem from './wasm/exec-args/ExecArgVaultRedeem'
import ExecArgVaultSubscribe from './wasm/exec-args/ExecArgVaultSubscribe'

export type ExecArgs =
  | ExecArgRegisterVault
  | ExecArgsUpdateDerivativeVaultConfig
  | ExecArgsUpdateSpotVaultConfig
  | ExecArgVaultRedeem
  | ExecArgVaultSubscribe

export type InstantiateExecArgs =
  | ExecArgsInstantiateDerivativeVault
  | ExecArgsInstantiateSpotVault
