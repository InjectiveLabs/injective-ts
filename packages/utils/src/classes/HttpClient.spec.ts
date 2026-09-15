import axios from 'axios'
import { it, vi, expect, describe, afterEach } from 'vitest'
import HttpClient from './HttpClient.js'

vi.mock('axios', () => {
  const get = vi.fn().mockResolvedValue({ data: 'ok' })
  const post = vi.fn().mockResolvedValue({ data: 'ok' })

  return {
    default: {
      create: vi.fn(() => ({ get, post, put: vi.fn(), delete: vi.fn() })),
    },
  }
})

describe('HttpClient', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends the header provider value fresh on every request', async () => {
    const client = new HttpClient('http://localhost:9090')
    const mockedClient = (axios.create as any).mock.results[0].value
    let ip = ''

    client.setHeaderProvider(() => ({ 'x-forwarded-for': ip }))

    await client.get('/status')

    expect(mockedClient.get).toHaveBeenLastCalledWith('/status', {
      params: {},
      headers: { 'x-forwarded-for': '' },
    })

    ip = '203.0.113.1'

    await client.post('/status', { foo: 'bar' })

    expect(mockedClient.post).toHaveBeenLastCalledWith(
      '/status',
      { foo: 'bar' },
      { headers: { 'x-forwarded-for': '203.0.113.1' } },
    )
  })

  it('lets an explicit setConfig header override the provider', async () => {
    const client = new HttpClient('http://localhost:9090')
    const mockedClient = (axios.create as any).mock.results[0].value

    client.setHeaderProvider(() => ({ 'x-forwarded-for': 'from-provider' }))
    client.setConfig({ headers: { 'x-forwarded-for': 'from-setConfig' } })

    await client.get('/status')

    expect(mockedClient.get).toHaveBeenLastCalledWith('/status', {
      params: {},
      headers: { 'x-forwarded-for': 'from-setConfig' },
    })
  })
})
