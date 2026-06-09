import { EvmWalletProviderErrorCode } from '@injectivelabs/wallet-base'
import { extractNormalizedErrorCode } from './index.js'

describe('extractNormalizedErrorCode', () => {
  const cases = [
    {
      error: { code: EvmWalletProviderErrorCode.UserRejectedRequest },
      expected: EvmWalletProviderErrorCode.UserRejectedRequest,
      name: 'returns numeric error code',
    },
    {
      error: { code: `${EvmWalletProviderErrorCode.UserRejectedRequest}` },
      expected: EvmWalletProviderErrorCode.UserRejectedRequest,
      name: 'normalizes numeric string error code',
    },
    {
      error: {
        data: {
          originalError: {
            code: EvmWalletProviderErrorCode.UnrecognizedChain,
          },
        },
      },
      expected: EvmWalletProviderErrorCode.UnrecognizedChain,
      name: 'uses original error code when code is undefined',
    },
    {
      error: {
        code: null,
        data: {
          originalError: {
            code: `${EvmWalletProviderErrorCode.UnrecognizedChain}`,
          },
        },
      },
      expected: EvmWalletProviderErrorCode.UnrecognizedChain,
      name: 'uses original error code when code is null',
    },
    {
      error: {
        code: EvmWalletProviderErrorCode.InternalError,
        data: {
          originalError: {
            code: EvmWalletProviderErrorCode.UnrecognizedChain,
          },
        },
      },
      expected: EvmWalletProviderErrorCode.UnrecognizedChain,
      name: 'prefers original error code for internal error wrappers',
    },
    {
      error: {
        code: `${EvmWalletProviderErrorCode.InternalError}`,
        data: {
          originalError: {
            code: `${EvmWalletProviderErrorCode.UnrecognizedChain}`,
          },
        },
      },
      expected: EvmWalletProviderErrorCode.UnrecognizedChain,
      name: 'prefers original error code for string internal error wrappers',
    },
    {
      error: EvmWalletProviderErrorCode.UserRejectedRequest,
      expected: NaN,
      name: 'returns NaN for primitive number input',
    },
    {
      error: 'rejected',
      expected: NaN,
      name: 'returns NaN for primitive string input',
    },
    {
      error: null,
      expected: NaN,
      name: 'returns NaN for null input',
    },
    {
      error: undefined,
      expected: NaN,
      name: 'returns NaN for undefined input',
    },
  ]

  it.each(cases)('$name', ({ error, expected }) => {
    const actual = extractNormalizedErrorCode(error)

    if (Number.isNaN(expected)) {
      expect(actual).toBeNaN()

      return
    }

    expect(actual).toBe(expected)
  })
})
