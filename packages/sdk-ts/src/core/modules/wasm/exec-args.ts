import ExecArgRegisterVault from './exec-args/ExecArgRegisterVault'
import ExecArgVaultRedeem from './exec-args/ExecArgVaultRedeem'
import ExecArgVaultSubscribe from './exec-args/ExecArgVaultSubscribe'

export type ExecArgs =
  | ExecArgRegisterVault
  | ExecArgVaultRedeem
  | ExecArgVaultSubscribe
