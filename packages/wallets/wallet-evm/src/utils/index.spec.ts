import { EvmWalletProviderErrorCode } from '@injectivelabs/wallet-base'
import {
  isUnrecognizedChainError,
  extractNormalizedErrorCode,
} from './index.js'

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

describe('isUnrecognizedChainError', () => {
  it('returns true for standard unrecognized chain errors', () => {
    expect(
      isUnrecognizedChainError({
        code: EvmWalletProviderErrorCode.UnrecognizedChain,
      }),
    ).toBe(true)
  })

  it('returns true for Rainbow invalid request chain unsupported errors', () => {
    expect(
      isUnrecognizedChainError({
        code: -32600,
        name: 'Invalid Request',
        message: 'Chain Id not supported',
      }),
    ).toBe(true)
  })

  it('returns true for nested invalid request chain unsupported errors', () => {
    expect(
      isUnrecognizedChainError({
        code: EvmWalletProviderErrorCode.InternalError,
        data: {
          originalError: {
            code: -32600,
            message: 'Chain not supported',
          },
        },
      }),
    ).toBe(true)
  })

  it('returns true for invalid request unsupported chain errors', () => {
    expect(
      isUnrecognizedChainError({
        code: -32600,
        name: 'Invalid Request',
        message: 'Unsupported chain id',
      }),
    ).toBe(true)
  })

  it('returns false for unrelated invalid request errors', () => {
    expect(
      isUnrecognizedChainError({
        code: -32600,
        name: 'Invalid Request',
        message: 'Invalid params',
      }),
    ).toBe(false)
  })

  it('returns false for unsupported method errors', () => {
    expect(
      isUnrecognizedChainError({
        code: -32600,
        name: 'Invalid Request',
        message: 'Unsupported method wallet_switchEthereumChain',
      }),
    ).toBe(false)
  })
})
