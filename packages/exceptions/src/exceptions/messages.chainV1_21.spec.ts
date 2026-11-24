import { chainModuleCodeErrorMessagesMap } from './messages.js'
import { mapFailedTransactionMessageFromString } from './utils/maps.js'
import {
  ChainCosmosErrorCode,
  ChainInsuranceErrorCodes,
  TransactionChainErrorModule,
  ChainExchangeModuleErrorCode,
} from './types/index.js'

describe('chain v1.21 error mappings', () => {
  it('maps every new exchange (101-133) and insurance (13-20) code to a message', () => {
    const exchange =
      chainModuleCodeErrorMessagesMap[TransactionChainErrorModule.Exchange]
    const insurance =
      chainModuleCodeErrorMessagesMap[TransactionChainErrorModule.Insurance]

    for (let code = 101; code <= 133; code++) {
      expect(exchange[code], `exchange ${code}`).toBeTruthy()
    }

    for (let code = 13; code <= 20; code++) {
      expect(insurance[code], `insurance ${code}`).toBeTruthy()
    }
  })

  it.each([
    [
      'address has reached the order-book order cap',
      ChainExchangeModuleErrorCode.ErrTooManyOrdersPerAddress,
      TransactionChainErrorModule.Exchange,
    ],
    [
      'position-opening fill rejected by reference price gate',
      ChainExchangeModuleErrorCode.ErrReferencePriceGateRejection,
      TransactionChainErrorModule.Exchange,
    ],
    [
      'swap input above maximum',
      ChainExchangeModuleErrorCode.ErrSwapMaxInputExceeded,
      TransactionChainErrorModule.Exchange,
    ],
    [
      'insufficient shares out',
      ChainInsuranceErrorCodes.ErrInsufficientSharesOut,
      TransactionChainErrorModule.Insurance,
    ],
    [
      'market launch proposal is pending',
      ChainInsuranceErrorCodes.ErrMarketLaunchPending,
      TransactionChainErrorModule.Insurance,
    ],
  ])('maps the chain message "%s"', (text, code, module) => {
    expect(
      mapFailedTransactionMessageFromString(
        `failed to execute message; message index: 0: ${text}: invalid request`,
      ),
    ).toMatchObject({ code, module })
  })

  it.each([
    [
      'consolidated insurance pool not found',
      ChainInsuranceErrorCodes.ErrConsolidatedPoolNotFound,
    ],
    [
      'consolidated insurance policy not found',
      ChainInsuranceErrorCodes.ErrConsolidatedPolicyNotFound,
    ],
  ])('"%s" is not swallowed by the generic not-found mapping', (text, code) => {
    expect(
      mapFailedTransactionMessageFromString(
        `message index: 0: ${text}: invalid request`,
      ),
    ).toMatchObject({ code, module: TransactionChainErrorModule.Insurance })
  })

  it('maps a transfer refused by the outflow guard ahead of the generic unauthorized', () => {
    expect(
      mapFailedTransactionMessageFromString(
        'failed to execute message; message index: 0: transfer not allowed: unauthorized',
      ),
    ).toMatchObject({
      message:
        'This transfer is not allowed at the moment. Please try again later.',
      code: ChainCosmosErrorCode.ErrUnauthorized,
      module: TransactionChainErrorModule.CosmosSdk,
    })
  })
})
