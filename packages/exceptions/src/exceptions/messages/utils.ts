import type {
  ErrorContextCode,
  TransactionChainErrorModule,
} from '../types/index.js'

interface ChainErrorDefinition {
  code: ErrorContextCode
  message: string
  match?: string
}

export const createChainErrorMaps = (
  module: TransactionChainErrorModule,
  definitions: ChainErrorDefinition[],
) => {
  const byCode: Record<number, string> = {}
  const byMessage: Record<
    string,
    {
      code: ErrorContextCode
      message: string
      module: TransactionChainErrorModule
    }
  > = {}

  for (const { code, message, match } of definitions) {
    byCode[code] = message

    if (match !== undefined) {
      byMessage[match] = { code, message, module }
    }
  }

  return { byCode, byMessage }
}
