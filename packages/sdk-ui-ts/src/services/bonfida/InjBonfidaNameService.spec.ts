import { InjBonfidaNameService } from './InjBonfidaNameService'

describe('InjBonfidaNameService', () => {
  test('fetchInjAddress', () => {
    const service = new InjBonfidaNameService()
    const name = 'randomname.sol'
    const result = service.fetchInjAddress(name)

    expect(result).toBeDefined()
    expect(result).toEqual('inj1...')
  })
})
