import { createChainErrorMaps } from './utils.js'
import {
  ChainInsuranceErrorCodes,
  TransactionChainErrorModule,
} from '../types/index.js'

it('derives both lookups and preserves explicit substring matching order', () => {
  const module = TransactionChainErrorModule.Insurance
  const code = ChainInsuranceErrorCodes.ErrConsolidatedPoolNotFound
  const message = 'The consolidated pool is missing'
  const maps = createChainErrorMaps(module, [
    { code, message, match: 'consolidated insurance pool not found' },
    {
      code: ChainInsuranceErrorCodes.ErrInsuranceFundNotFound,
      message: 'The insurance fund is missing',
      match: 'not found',
    },
    {
      code: ChainInsuranceErrorCodes.ErrInvalidOracle,
      message: 'The oracle is invalid',
    },
  ])

  expect(maps.byCode[code]).toBe(message)
  expect(maps.byMessage['consolidated insurance pool not found']).toStrictEqual(
    {
      code,
      message,
      module,
    },
  )
  expect(Object.keys(maps.byMessage)).toStrictEqual([
    'consolidated insurance pool not found',
    'not found',
  ])
  expect(maps.byCode[ChainInsuranceErrorCodes.ErrInvalidOracle]).toBe(
    'The oracle is invalid',
  )
})
