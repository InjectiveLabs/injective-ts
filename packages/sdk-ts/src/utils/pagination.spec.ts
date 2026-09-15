import { fetchAllWithTokenPagination } from './pagination.js'

describe('fetchAllWithTokenPagination', () => {
  test('returns a next-only response without throwing', async () => {
    const response = await fetchAllWithTokenPagination(undefined, async () => ({
      next: [],
    }))

    expect(response).toEqual({ next: [] })
  })
})
