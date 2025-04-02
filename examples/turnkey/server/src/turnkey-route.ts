import { zValidator } from '@hono/zod-validator'
import 'dotenv/config'
import { Hono } from 'hono'
import { z } from 'zod'
import {
  initEmailOtp,
  oauthLogin,
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
      const { email } = c.req.valid('json')

      const initEmailAuthResponse = await initEmailOtp(email)
      return c.json({
        ...initEmailAuthResponse,
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
  .post(
    '/oauth-login',
    zValidator(
      'json',
      z.object({
        oidcToken: z.string(),
        providerName: z.string(),
        targetPublicKey: z.string(),
        expirationSeconds: z.number().optional(),
      }),
    ),
    async (c) => {
      const args = c.req.valid('json')
      console.log('🪵 | args:', args)
      const result = await oauthLogin(args)
      console.log('🪵 | result:', result)
      return c.json(result)
    },
  )
