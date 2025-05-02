import { SkipClient } from '@skip-go/client'
import { getCosmosSigner, getEVMSigner } from './signers.js'

export const skipClient = new SkipClient({
  getCosmosSigner,
  getEVMSigner,
})
