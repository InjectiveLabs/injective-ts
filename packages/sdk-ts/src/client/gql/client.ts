import * as Apollo from '@apollo/client'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { USER_DEPOSITS, USER_BRIDGE_DEPOSITS } from './queries.js'
import { UserDepositResponse } from './types.js'

/**
 * @hidden
 */
export class ApolloConsumer {
  private apolloClient: Apollo.ApolloClient<Apollo.NormalizedCacheObject>

  constructor(graphQlEndpoint: string) {
    this.apolloClient = new Apollo.ApolloClient({
      uri: graphQlEndpoint,
      cache: new Apollo.InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    })
  }

  async fetchUserDeposits(address: string) {
    const response = (await this.apolloClient.query({
      query: USER_DEPOSITS,
      variables: {
        destination: `0x${'0'.repeat(24)}${address
          .toLowerCase()
          .replace('0x', '')}`,
      },
    })) as Apollo.ApolloQueryResult<UserDepositResponse>

    if (response.errors && response.errors.length > 0) {
      throw new HttpRequestException(new Error(response.errors[0].message))
    }

    return response.data.deposits
  }

  async fetchUserBridgeDeposits(address: string, timestamp: number) {
    const response = (await this.apolloClient.query({
      query: USER_BRIDGE_DEPOSITS,
      variables: {
        timestamp,
        sender: address,
      },
    })) as Apollo.ApolloQueryResult<UserDepositResponse>

    if (response.errors && response.errors.length > 0) {
      throw new HttpRequestException(new Error(response.errors[0].message))
    }

    return response.data.deposits
  }
}
