import { Network } from '@injectivelabs/networks'
import { Wallet } from '@injectivelabs/wallet-base'
import { EvmChainId } from '@injectivelabs/ts-types'
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { PrivateKey } from '@injectivelabs/sdk-ts/core/accounts'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import {
  SIGN_DIRECT,
  MsgBroadcasterWithPk,
} from '@injectivelabs/sdk-ts/core/tx'
import { MsgBroadcaster } from './MsgBroadcaster.js'
import type {
  WalletStrategyArguments,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import type { MsgBroadcasterOptions } from './types.js'

const strategyArgs: WalletStrategyArguments = {} as any /** define the args */
const strategyEthArgs: ConcreteEvmWalletStrategyArgs =
  {} as any /** if the wallet is an Ethereum wallet */
const strategies = {
  [Wallet.PrivateKey]: new PrivateKeyWalletStrategy(strategyEthArgs),
}

export const walletStrategy = new BaseWalletStrategy({
  ...strategyArgs,
  strategies,
}) as any

const broadcasterArgs: MsgBroadcasterOptions = {
  network: Network.Devnet,
  walletStrategy,
}
export const msgBroadcaster = new MsgBroadcaster(broadcasterArgs)

describe('MsgBroadcaster', () => {
  test('prepares, simulates, signs and broadcasts a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
      simulateTx: true,
    }).broadcast({ msgs: message })

    expect(response.txHash).toBeDefined()
  }, 60000)

  test.skip('prepares, simulates, signs and broadcasts a transaction with fee delegation', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
      simulateTx: true,
      evmChainId: EvmChainId.Sepolia,
    }).broadcastWithFeeDelegation({ msgs: message })

    expect(response.txHash).toBeDefined()
  }, 60000)

  test.skip('simulates a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
    }).simulate({ msgs: message })

    expect(response.result).toBeDefined()
  }, 60000)

  describe('getTxWithSignersAndStdFee', () => {
    let mockBroadcaster: MsgBroadcaster
    let mockArgs: any

    beforeEach(() => {
      // Create a mock broadcaster instance for testing private methods
      const mockOptions: MsgBroadcasterOptions = {
        network: Network.Devnet,
        walletStrategy: walletStrategy,
        simulateTx: false,
        gasBufferCoefficient: 1.2,
      }
      mockBroadcaster = new MsgBroadcaster(mockOptions)

      // Sample args based on the provided JSON data
      mockArgs = {
        chainId: 'injective-888',
        signMode: SIGN_DIRECT,
        memo: '',
        message: [
          MsgSend.fromJSON({
            srcInjectiveAddress: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
            dstInjectiveAddress: 'inj1995xnrrtnmtdgjmx0g937vf28dwefhkhy6gy5e',
            amount: {
              amount: '1000000000000000000',
              denom: 'inj',
            },
          }),
        ],
        timeoutHeight: 93914852,
        signers: {
          pubKey: 'A3eNFVby5yUxCFWubsbRcNuY0IjXqOuGBq3Clz8xVjgw',
          sequence: 4490,
          accountNumber: 1045,
        },
        fee: {
          amount: [
            {
              denom: 'inj',
              amount: '64000000000000',
            },
          ],
          gas: '400000',
        },
      }
    })

    test('should return transaction without simulation when simulateTx is false', async () => {
      // Set simulateTx to false
      mockBroadcaster.simulateTx = false

      // Mock the getStdFeeWithDynamicBaseFee method
      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      // Call the private method using type assertion
      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        mockArgs,
      )

      expect(result).toHaveProperty('txRaw')
      expect(result).toHaveProperty('signDoc')
      expect(result).toHaveProperty('stdFee')
      expect(result.stdFee).toEqual(mockStdFee)
    })

    test('should simulate transaction and use simulated gas when simulateTx is true', async () => {
      // Set simulateTx to true
      mockBroadcaster.simulateTx = true

      // Mock successful simulation response with gas info
      const mockSimulationResult = {
        gasInfo: {
          gasUsed: '300000',
          gasWanted: '400000',
        },
        result: {
          data: 'mock_data',
          log: 'mock_log',
        },
      }

      // Mock simulateTxWithSigners method
      jest
        .spyOn(mockBroadcaster as any, 'simulateTxWithSigners')
        .mockResolvedValue(mockSimulationResult)

      // Mock the getStdFeeWithDynamicBaseFee method
      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '72000000000000' }], // Updated amount based on simulated gas
        gas: '360000', // 300000 * 1.2 = 360000
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      // Call the private method
      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        mockArgs,
      )

      expect(result).toHaveProperty('txRaw')
      expect(result).toHaveProperty('signDoc')
      expect(result).toHaveProperty('stdFee')
      expect(result.stdFee).toEqual(mockStdFee)

      // Verify simulateTxWithSigners was called
      expect(
        (mockBroadcaster as any).simulateTxWithSigners,
      ).toHaveBeenCalledWith(mockArgs)
    })

    test('should fallback to original fee when simulation returns no gasUsed', async () => {
      // Set simulateTx to true
      mockBroadcaster.simulateTx = true

      // Mock simulation response without gasUsed
      const mockSimulationResult = {
        gasInfo: {
          gasWanted: '400000',
        }, // No gasUsed property
        result: {
          data: 'mock_data',
          log: 'mock_log',
        },
      }

      // Mock simulateTxWithSigners method
      jest
        .spyOn(mockBroadcaster as any, 'simulateTxWithSigners')
        .mockResolvedValue(mockSimulationResult)

      // Mock the getStdFeeWithDynamicBaseFee method
      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      // Call the private method
      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        mockArgs,
      )

      expect(result).toHaveProperty('txRaw')
      expect(result).toHaveProperty('signDoc')
      expect(result).toHaveProperty('stdFee')
      expect(result.stdFee).toEqual(mockStdFee)

      // Verify it fell back to using original fee
      expect(
        (mockBroadcaster as any).getStdFeeWithDynamicBaseFee,
      ).toHaveBeenCalledWith(mockArgs.fee)
    })

    test('should apply custom gasBufferCoefficient when using simulated gas', async () => {
      // Set custom gasBufferCoefficient
      mockBroadcaster.simulateTx = true
      mockBroadcaster.gasBufferCoefficient = 1.5 // 50% buffer instead of 20%

      // Mock successful simulation response
      const mockSimulationResult = {
        gasInfo: {
          gasUsed: '200000',
          gasWanted: '400000',
        },
        result: {
          data: 'mock_data',
          log: 'mock_log',
        },
      }

      jest
        .spyOn(mockBroadcaster as any, 'simulateTxWithSigners')
        .mockResolvedValue(mockSimulationResult)

      // Mock getStdFeeWithDynamicBaseFee to capture the gas calculation
      let capturedGasArg: any
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockImplementation((args: any) => {
          capturedGasArg = args
          return Promise.resolve({
            amount: [{ denom: 'inj', amount: '60000000000000' }],
            gas: args.gas,
          })
        })

      // Call the private method
      await (mockBroadcaster as any).getTxWithSignersAndStdFee(mockArgs)

      // Verify that gas was calculated with 1.5 coefficient: 200000 * 1.5 = 300000
      expect(capturedGasArg.gas).toBe('300000')
    })

    test('should handle multiple signers in the args', async () => {
      // Modify args to have multiple signers
      const multiSignerArgs = {
        ...mockArgs,
        signers: [
          {
            pubKey: 'A3eNFVby5yUxCFWubsbRcNuY0IjXqOuGBq3Clz8xVjgw',
            sequence: 4490,
            accountNumber: 1045,
          },
          {
            pubKey: 'B4fOGWcz6zVyCGXvcscsRdOvZ1IkYrPvHCr4Dm9yWkhx',
            sequence: 4491,
            accountNumber: 1046,
          },
        ],
      }

      mockBroadcaster.simulateTx = false

      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        multiSignerArgs,
      )

      expect(result).toHaveProperty('txRaw')
      expect(result).toHaveProperty('signDoc')
      expect(result).toHaveProperty('stdFee')
      expect(result.stdFee).toEqual(mockStdFee)
    })

    test('should handle string fee argument', async () => {
      // Modify args to have string fee (valid gas price format)
      const stringFeeArgs = {
        ...mockArgs,
        fee: '0.16inj', // Valid gas price string instead of object
      }

      mockBroadcaster.simulateTx = false

      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        stringFeeArgs,
      )

      expect(result).toHaveProperty('txRaw')
      expect(result).toHaveProperty('signDoc')
      expect(result).toHaveProperty('stdFee')
      expect(result.stdFee).toEqual(mockStdFee)
    })

    test('should handle edge case with zero gasUsed from simulation', async () => {
      mockBroadcaster.simulateTx = true

      // Mock simulation with undefined gasUsed (falsy)
      const mockSimulationResult = {
        gasInfo: {
          gasWanted: '400000',
          // gasUsed is undefined/missing
        },
        result: {
          data: 'mock_data',
          log: 'mock_log',
        },
      }

      jest
        .spyOn(mockBroadcaster as any, 'simulateTxWithSigners')
        .mockResolvedValue(mockSimulationResult)

      const mockStdFee = {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      }
      jest
        .spyOn(mockBroadcaster as any, 'getStdFeeWithDynamicBaseFee')
        .mockResolvedValue(mockStdFee)

      const result = await (mockBroadcaster as any).getTxWithSignersAndStdFee(
        mockArgs,
      )

      // Should fallback to original fee since gasUsed is 0 (falsy)
      expect(result.stdFee).toEqual(mockStdFee)
      expect(
        (mockBroadcaster as any).getStdFeeWithDynamicBaseFee,
      ).toHaveBeenCalledWith(mockArgs.fee)
    })
  })
})
