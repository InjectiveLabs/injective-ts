import HttpClient from './HttpClient.js'
import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const createResponse = <T>(
  config: InternalAxiosRequestConfig,
  data: T,
): AxiosResponse<T> => ({
  config,
  data,
  headers: {},
  status: 200,
  statusText: 'OK',
})

const createAdapter = <T>(data: T) => {
  const calls: InternalAxiosRequestConfig[] = []

  const adapter: AxiosAdapter = async (config) => {
    calls.push(config)

    return createResponse(config, data)
  }

  return { adapter, calls }
}

const createPendingAdapter = () => {
  const calls: InternalAxiosRequestConfig[] = []

  const adapter: AxiosAdapter = (config) => {
    calls.push(config)

    return new Promise((_resolve, reject) => {
      const signal = config.signal as AbortSignal | undefined

      const onAbort = () => {
        reject(
          Object.assign(new Error('canceled'), {
            config,
            code: 'ERR_CANCELED',
            name: 'CanceledError',
            reason: signal?.reason,
          }),
        )
      }

      if (signal?.aborted) {
        onAbort()

        return
      }

      signal?.addEventListener('abort', onAbort, { once: true })
    })
  }

  return { adapter, calls }
}

describe('HttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('forwards the final per-call config for get/delete', async () => {
    const { adapter, calls } = createAdapter('ok')
    const client = new HttpClient('http://api.test', { adapter })

    await expect(
      client.get<string, string>(
        '/get',
        { account: 'inj1' },
        { headers: { 'X-Call': 'get' } },
      ),
    ).resolves.toMatchObject({ data: 'ok' })
    await expect(
      client.delete<string, string>(
        '/delete',
        { account: 'inj1' },
        { headers: { 'X-Call': 'delete' } },
      ),
    ).resolves.toMatchObject({ data: 'ok' })

    expect(calls).toHaveLength(2)
    expect(calls[0].url).toBe('/get')
    expect(calls[0].method).toBe('get')
    expect(calls[0].params).toEqual({ account: 'inj1' })
    expect(calls[0].headers.get('X-Call')).toBe('get')
    expect(calls[1].url).toBe('/delete')
    expect(calls[1].method).toBe('delete')
    expect(calls[1].params).toEqual({ account: 'inj1' })
    expect(calls[1].headers.get('X-Call')).toBe('delete')
  })

  it('forwards the final per-call config for post/put', async () => {
    const { adapter, calls } = createAdapter('ok')
    const client = new HttpClient('http://api.test', { adapter })

    await expect(
      client.post<Record<string, string>, string>(
        '/post',
        { id: '1' },
        { headers: { 'X-Call': 'post' } },
      ),
    ).resolves.toMatchObject({ data: 'ok' })
    await expect(
      client.put<Record<string, string>, string>(
        '/put',
        { id: '2' },
        { headers: { 'X-Call': 'put' } },
      ),
    ).resolves.toMatchObject({ data: 'ok' })

    expect(calls).toHaveLength(2)
    expect(calls[0].url).toBe('/post')
    expect(calls[0].method).toBe('post')
    expect(calls[0].headers.get('X-Call')).toBe('post')
    expect(calls[1].url).toBe('/put')
    expect(calls[1].method).toBe('put')
    expect(calls[1].headers.get('X-Call')).toBe('put')
  })

  it('preserves params/header precedence without mutating configs', async () => {
    const { adapter, calls } = createAdapter('ok')
    const client = new HttpClient('http://api.test', {
      adapter,
      headers: { Accept: 'application/json' },
    })
    const config = {
      headers: { Authorization: 'Bearer token', 'X-Config': 'yes' },
      params: { fromConfig: true },
    }
    const perCallConfig = {
      headers: { 'X-Call': 'yes' },
    }

    Object.freeze(config)
    Object.freeze(config.headers)
    Object.freeze(perCallConfig)
    Object.freeze(perCallConfig.headers)

    client.setConfig(config)

    await expect(
      client.get('/path', { fromArgument: true }, perCallConfig),
    ).resolves.toMatchObject({ data: 'ok' })

    // Existing behavior: configured params override endpoint arguments.
    expect(calls[0].params).toEqual({ fromConfig: true })
    expect(calls[0].headers.get('Accept')).toBe('application/json')
    expect(calls[0].headers.get('Authorization')).toBe('Bearer token')
    expect(calls[0].headers.get('X-Config')).toBe('yes')
    expect(calls[0].headers.get('X-Call')).toBe('yes')
    expect(config).toEqual({
      headers: { Authorization: 'Bearer token', 'X-Config': 'yes' },
      params: { fromConfig: true },
    })
    expect(perCallConfig).toEqual({ headers: { 'X-Call': 'yes' } })
  })

  it('tolerates nullish setConfig values from JavaScript callers', async () => {
    const { adapter, calls } = createAdapter('ok')
    const client = new HttpClient('http://api.test', { adapter })
    const jsClient = client as any

    jsClient.setConfig(undefined)

    await expect(client.post('/post', {})).resolves.toMatchObject({
      data: 'ok',
    })

    jsClient.setConfig(null)

    await expect(client.put('/put', {})).resolves.toMatchObject({ data: 'ok' })
    expect(calls).toHaveLength(2)
  })

  it('lets per-call params take precedence as the final config', async () => {
    const { adapter, calls } = createAdapter('ok')
    const client = new HttpClient('http://api.test', { adapter })

    client.setConfig({ params: { fromConfig: true } })

    await client.get(
      '/path',
      { fromArgument: true },
      {
        params: { fromCall: true },
      },
    )

    expect(calls[0].params).toEqual({ fromCall: true })
  })

  it('aborts an active request when the constructor signal aborts', async () => {
    const constructorController = new AbortController()
    const perCallController = new AbortController()
    const { adapter, calls } = createPendingAdapter()
    const client = new HttpClient('http://api.test', {
      adapter,
      signal: constructorController.signal,
    })

    const promise = client.get(
      '/path',
      {},
      {
        signal: perCallController.signal,
      },
    )

    await vi.waitFor(() => expect(calls).toHaveLength(1))

    const reason = { source: 'constructor' }

    constructorController.abort(reason)

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      code: 'ERR_CANCELED',
      reason,
    })
    expect(perCallController.signal.aborted).toBe(false)
  })

  it('aborts an active request when the config signal aborts', async () => {
    const configController = new AbortController()
    const perCallController = new AbortController()
    const { adapter, calls } = createPendingAdapter()
    const client = new HttpClient('http://api.test', { adapter })

    client.setConfig({ signal: configController.signal })

    const promise = client.get(
      '/path',
      {},
      {
        signal: perCallController.signal,
      },
    )

    await vi.waitFor(() => expect(calls).toHaveLength(1))

    const reason = new Error('config cancelled')

    configController.abort(reason)

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      reason,
    })
    expect(perCallController.signal.aborted).toBe(false)
  })

  it('aborts an active request when the per-call signal aborts', async () => {
    const perCallController = new AbortController()
    const { adapter, calls } = createPendingAdapter()
    const client = new HttpClient('http://api.test', { adapter })

    const promise = client.get(
      '/path',
      {},
      {
        signal: perCallController.signal,
      },
    )

    await vi.waitFor(() => expect(calls).toHaveLength(1))

    const reason = 'arbitrary string reason'

    perCallController.abort(reason)

    await expect(promise).rejects.toMatchObject({
      name: 'AbortError',
      reason,
    })
  })

  it('rejects pre-aborted calls without hitting the adapter', async () => {
    const constructorController = new AbortController()
    const { adapter, calls } = createPendingAdapter()
    const client = new HttpClient('http://api.test', {
      adapter,
      signal: constructorController.signal,
    })
    const reason = { source: 'pre-aborted' }

    constructorController.abort(reason)

    await expect(client.get('/path')).rejects.toMatchObject({
      name: 'AbortError',
      reason,
    })
    expect(calls).toHaveLength(0)
  })

  it('rejects a pre-aborted per-call signal without hitting the adapter', async () => {
    const perCallController = new AbortController()
    const { adapter, calls } = createPendingAdapter()
    const client = new HttpClient('http://api.test', { adapter })

    perCallController.abort('already gone')

    await expect(
      client.get('/path', {}, { signal: perCallController.signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'already gone',
    })
    expect(calls).toHaveLength(0)
  })

  it('isolates concurrent request signals', async () => {
    const resolvers = new Map<string, (response: AxiosResponse) => void>()
    const calls = new Map<string, InternalAxiosRequestConfig>()
    const adapter: AxiosAdapter = (config) => {
      const url = config.url || ''
      const promise = new Promise<AxiosResponse>((resolve) => {
        resolvers.set(url, resolve)
      })

      calls.set(url, config)

      return promise
    }
    const client = new HttpClient('http://api.test', { adapter })
    const firstController = new AbortController()
    const secondController = new AbortController()

    const firstPromise = client.get(
      '/first',
      {},
      {
        signal: firstController.signal,
      },
    )
    const secondPromise = client.get(
      '/second',
      {},
      {
        signal: secondController.signal,
      },
    )

    await vi.waitFor(() => expect(resolvers.size).toBe(2))

    expect(calls.get('/first')?.signal).toBe(firstController.signal)
    expect(calls.get('/second')?.signal).toBe(secondController.signal)

    firstController.abort('only the first request')

    await expect(firstPromise).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'only the first request',
    })

    const secondConfig = calls.get('/second')

    expect(secondConfig).toBeDefined()
    resolvers.get('/second')?.(createResponse(secondConfig!, 'second result'))

    await expect(secondPromise).resolves.toMatchObject({
      data: 'second result',
    })
    expect(secondController.signal.aborted).toBe(false)
  })
})
