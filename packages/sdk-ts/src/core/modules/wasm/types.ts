export enum ExitType {
  Default = 'default',
  Quote = 'quote',
  Base = 'base',
}

export enum StrategyType {
  Arithmetic = 'arithmetic',
  Geometric = 'geometric',
}

export type TrailingArithmetic = {
  trailing_arithmetic: {
    lower_trailing_bound: string
    upper_trailing_bound: string
  }
}

export type ExitConfig = {
  exitType: ExitType
  exitPrice: string
}
