import {
  Status,
  StatusType,
  capitalize,
  toPascalCase,
  snakeToPascal,
  getDefaultStdFee,
  formatWalletAddress,
  DEFAULT_STD_FEE_BY_DENOM,
} from './light.js'
import {
  Status as RootStatus,
  StatusType as RootStatusType,
  capitalize as rootCapitalize,
  toPascalCase as rootToPascalCase,
  snakeToPascal as rootSnakeToPascal,
  getDefaultStdFee as rootGetDefaultStdFee,
  formatWalletAddress as rootFormatWalletAddress,
  DEFAULT_STD_FEE_BY_DENOM as ROOT_DEFAULT_STD_FEE_BY_DENOM,
} from './index.js'

describe('light utils', () => {
  it('matches root status exports', () => {
    expect(StatusType).toEqual(RootStatusType)
    expect(Object.keys(StatusType)).toEqual(Object.keys(RootStatusType))

    const status = new Status()
    const rootStatus = new RootStatus()

    expect(status.get()).toBe(rootStatus.get())

    status.setLoading()
    rootStatus.setLoading()

    expect(status.get()).toBe(rootStatus.get())
    expect(status.isLoading()).toBe(rootStatus.isLoading())

    status.toggle()
    rootStatus.toggle()

    expect(status.get()).toBe(rootStatus.get())
  })

  it('matches root fee constants helpers', () => {
    expect(getDefaultStdFee()).toEqual(rootGetDefaultStdFee())
    expect(DEFAULT_STD_FEE_BY_DENOM()).toEqual(ROOT_DEFAULT_STD_FEE_BY_DENOM())
    expect(DEFAULT_STD_FEE_BY_DENOM('usdt')).toEqual(
      ROOT_DEFAULT_STD_FEE_BY_DENOM('usdt'),
    )
  })

  it('matches root formatter helpers', () => {
    const address = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'

    expect(formatWalletAddress(address)).toBe(rootFormatWalletAddress(address))
    expect(toPascalCase('hello_world-test')).toBe(
      rootToPascalCase('hello_world-test'),
    )
    expect(snakeToPascal('foo_bar/baz_qux')).toBe(
      rootSnakeToPascal('foo_bar/baz_qux'),
    )
    expect(capitalize('injective')).toBe(rootCapitalize('injective'))
  })
})
