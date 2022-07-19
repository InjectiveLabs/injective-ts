import ExecArgVaultSubscribe from './wasm/exec-args/ExecArgVaultSubscribe'
import ExecArgVaultRedeem from './wasm/exec-args/ExecArgVaultRedeem'

export type ExecArgs = ExecArgVaultRedeem | ExecArgVaultSubscribe
