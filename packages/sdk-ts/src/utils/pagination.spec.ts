import { vi, test, expect, describe } from 'vitest'
import {
  fetchAllWithPagination,
  fetchAllWithTokenPagination,
} from './pagination.js'

describe('fetchAllWithTokenPagination', () => {
  test('returns a next-only response without throwing', async () => {
    const response = await fetchAllWithTokenPagination(undefined, async () => ({
      next: [],
    }))

    expect(response).toEqual({ next: [] })
  })

  test('forwards options to every page and keeps accumulated results', async () => {
    const options = { signal: new AbortController().signal }
    const receivedOptions: unknown[] = []
    let page = 0
    const method = vi.fn(async (_args: unknown, pageOptions?: unknown) => {
      receivedOptions.push(pageOptions)

      const currentPage = page++

      return {
        funds: [{ id: currentPage + 1 }],
        next: currentPage === 0 ? ['next-token'] : [],
      }
    })

    const response = await fetchAllWithTokenPagination(
      { perPage: 1 },
      method,
      options,
    )

    expect(method).toHaveBeenCalledTimes(2)
    expect(receivedOptions).toEqual([options, options])
    expect(response).toEqual({
      funds: [{ id: 1 }, { id: 2 }],
      next: [],
    })
  })

  test('rejects pre-aborted calls without invoking the page method', async () => {
    const controller = new AbortController()
    controller.abort('token pagination cancelled')
    const method = vi.fn()

    await expect(
      fetchAllWithTokenPagination({ perPage: 1 }, method, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'token pagination cancelled',
    })
    expect(method).not.toHaveBeenCalled()
  })
})

describe('fetchAllWithPagination', () => {
  test('retains the legacy accumulator argument', async () => {
    const result = [1]
    const response = await fetchAllWithPagination(
      { limit: 1 },
      async () => ({ items: [2], pagination: { next: '', total: 2 } }),
      result,
    )

    expect(response.items).toEqual([1, 2])
    expect(result).toEqual([1, 2])
  })

  test('forwards options to every page and merges results', async () => {
    const options = { signal: new AbortController().signal }
    const receivedOptions: unknown[] = []
    let page = 0
    const method = vi.fn(async (_args: unknown, pageOptions?: unknown) => {
      receivedOptions.push(pageOptions)

      const currentPage = page++

      return {
        items: [{ id: currentPage + 1 }],
        pagination: {
          next: currentPage === 0 ? 'next-key' : '',
          total: 2,
        },
      }
    })

    const response = await fetchAllWithPagination({ limit: 1 }, method, options)

    expect(method).toHaveBeenCalledTimes(2)
    expect(receivedOptions).toEqual([options, options])
    expect(response).toEqual({
      items: [{ id: 1 }, { id: 2 }],
      pagination: { next: '', total: 2 },
    })
  })

  test('an abort observed after a page prevents the next request', async () => {
    const controller = new AbortController()
    const method = vi.fn(async () => {
      const response = {
        items: [1],
        pagination: { next: 'next-key', total: 2 },
      }

      controller.abort('stopped between pages')

      return response
    })

    await expect(
      fetchAllWithPagination({ limit: 1 }, method, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: 'stopped between pages',
    })
    expect(method).toHaveBeenCalledTimes(1)
  })

  test('rejects pre-aborted calls without invoking the page method', async () => {
    const controller = new AbortController()
    controller.abort(new Error('pagination cancelled'))
    const method = vi.fn()

    await expect(
      fetchAllWithPagination({ limit: 1 }, method, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      reason: expect.objectContaining({ message: 'pagination cancelled' }),
    })
    expect(method).not.toHaveBeenCalled()
  })
})
