import { zValidator } from '@hono/zod-validator'
import 'dotenv/config'
import { Hono } from 'hono'
import { z } from 'zod'
import {
  getOrCreateSubOrgIdsForEmail,
  sendEmailOtp,
  verifyEmailOtp,
} from './lib/turnkey-server.js'

export const turnkeyRoute = new Hono()
  .get('/', (c) => {
    return c.json({
      message: 'Hello World',
    })
  })
  .post(
    '/init-email-auth',
    zValidator(
      'json',
      z.object({
        email: z.string(),
        suborgID: z.string().optional(),
      }),
    ),
    async (c) => {
      console.log('POST request received')
      const { suborgID, email } = c.req.valid('json')

      const userSubOrgIds = await getOrCreateSubOrgIdsForEmail(email)
      const relevantSubOrgId = suborgID ?? userSubOrgIds.organizationIds[0]

      const initEmailAuthResponse = await sendEmailOtp(email, relevantSubOrgId)
      console.log('🪵 | initEmailAuthResponse:', initEmailAuthResponse)
      console.log('🪵 | userSubOrgIds:', userSubOrgIds)

      return c.json({
        ...initEmailAuthResponse,
        organizationId: relevantSubOrgId,
      })
    },
  )
  .post(
    '/verify-email-auth',
    zValidator(
      'json',
      z.object({
        otpId: z.string(),
        otpCode: z.string(),
        targetPublicKey: z.string(),
        suborgID: z.string(),
        sessionLengthSeconds: z.number().optional(),
      }),
    ),
    async (c) => {
      const args = c.req.valid('json')

      const result = await verifyEmailOtp(args)
      console.log('🪵 | result:', result)

      return c.json(result)
    },
  )
