import { TxGrpcApi } from './TxGrpcApi.js'

describe('TxGrpcApi V2 Migration', () => {
  let txApi: TxGrpcApi
  const endpoint = 'https://sentry.tm.injective.network:443'

  beforeEach(() => {
    txApi = new TxGrpcApi(endpoint)
  })

  describe('constructor', () => {
    it('should initialize with endpoint', () => {
      expect(txApi).toBeDefined()
      expect(txApi['endpoint']).toBe(endpoint)
      expect(txApi['client']).toBeDefined()
    })
  })

  describe('setMetadata', () => {
    it('should set metadata correctly', () => {
      const metadata = { 'x-api-key': 'test-key' }
      txApi.setMetadata(metadata)
      expect(txApi['metadata']).toEqual(metadata)
    })
  })

  describe('clearMetadata', () => {
    it('should clear metadata', () => {
      txApi.setMetadata({ 'x-api-key': 'test-key' })
      txApi.clearMetadata()
      expect(txApi['metadata']).toBeUndefined()
    })
  })

  describe('fetchTx', () => {
    it('should handle invalid transaction hash', async () => {
      const txHash = 'INVALID_HASH'
      await expect(txApi.fetchTx(txHash)).rejects.toThrow()
    })
  })

  describe('simulate', () => {
    it('should handle simulation with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.simulate(mockTxRaw as any)).rejects.toThrow()
    })
  })

  describe('broadcast', () => {
    it('should handle broadcasting with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [new Uint8Array()],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.broadcast(mockTxRaw as any)).rejects.toThrow()
    })
  })

  describe('broadcastBlock', () => {
    it('should handle block broadcasting with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [new Uint8Array()],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.broadcastBlock(mockTxRaw as any)).rejects.toThrow()
    })
  })
})
