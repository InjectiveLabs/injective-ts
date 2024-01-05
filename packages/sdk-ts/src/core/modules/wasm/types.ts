export enum ExitType {
  Default = 'default',
  Quote = 'quote',
  Base = 'base',
}

export type ExitConfig = {
  exitType: ExitType
  exitPrice: string
}
