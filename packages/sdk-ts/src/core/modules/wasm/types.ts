export const ExitType = {
  Default: 'default',
  Quote: 'quote',
  Base: 'base',
} as const

export type ExitType = typeof ExitType[keyof typeof ExitType]

export const StrategyType = {
  Arithmetic: 'arithmetic',
  ArithmeticLP: 'trailing_arithmetic_lp',
  Geometric: 'geometric',
} as const

export type StrategyType = typeof StrategyType[keyof typeof StrategyType]

export type TrailingArithmetic = {
  trailing_arithmetic: {
    lower_trailing_bound: string
    upper_trailing_bound: string
  }
}

export type TrailingArithmeticLP = {
  trailing_arithmetic_l_p: {
    lower_trailing_bound: string
    upper_trailing_bound: string
  }
}

export type ExitConfig = {
  exitType: ExitType
  exitPrice: string
}
