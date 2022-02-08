import {
  Erc20TokenMetaFactory,
  Erc20TokenMeta,
  TokenMeta,
} from '@injectivelabs/token-metadata'
import { IBCConsumer } from '@injectivelabs/chain-consumer'
import { INJ_DENOM } from '../constants'
import { TokenServiceOptions } from '../types'

export class TokenService {
  // @ts-expect-error
  private options: TokenServiceOptions

  private ibcConsumer: IBCConsumer

  private erc20TokenMetaFactory: Erc20TokenMeta

  constructor({ options }: { options: TokenServiceOptions }) {
    this.options = options
    this.ibcConsumer = new IBCConsumer(options.endpoints.sentryGrpcApi)
    this.erc20TokenMetaFactory = Erc20TokenMetaFactory.make(options.network)
  }

  async fetchDenomTrace(denom: string) {
    const { ibcConsumer } = this
    const hash = denom.replace('ibc/', '')
    const denomTrace = await ibcConsumer.fetchDenomTrace(hash)

    if (!denomTrace) {
      throw new Error(`Denom trace not found for ${denom}`)
    }

    return {
      path: denomTrace.getPath(),
      baseDenom: denomTrace.getBaseDenom(),
    }
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMeta | undefined {
    const { erc20TokenMetaFactory } = this

    return erc20TokenMetaFactory.getMetaBySymbol(symbol)
  }

  getTokenMetaData(denom: string): TokenMeta | undefined {
    const { erc20TokenMetaFactory } = this

    if (denom.toLowerCase() === INJ_DENOM) {
      return erc20TokenMetaFactory.getMetaBySymbol('INJ')
    }

    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    return erc20TokenMetaFactory.getMetaByAddress(address)
  }

  async getIbcTokenMetaData(denom: string): Promise<TokenMeta | undefined> {
    const { erc20TokenMetaFactory } = this
    const { baseDenom: symbol } = await this.fetchDenomTrace(denom)

    return erc20TokenMetaFactory.getMetaBySymbol(symbol)
  }

  async getTokenMetaDataWithIbc(denom: string): Promise<TokenMeta | undefined> {
    return denom.startsWith('ibc/')
      ? this.getIbcTokenMetaData(denom)
      : this.getTokenMetaData(denom)
  }
}
