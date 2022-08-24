import { gql } from '@apollo/client/core'

/**
 * @hidden
 */
export const USER_DEPOSITS = gql`
  query Deposits($destination: Bytes!) {
    deposits(
      orderBy: timestamp
      orderDirection: desc
      first: 10
      where: { destination: $destination }
    ) {
      id
      tokenContract
      sender
      destination
      eventNonce
      amount
      timestamp
      blockHeight
    }
  }
`

export const USER_BRIDGE_DEPOSITS = gql`
  query Deposits($sender: Bytes!, $timestamp: Int!) {
    deposits(
      orderBy: timestamp
      orderDirection: desc
      where: { timestamp_gte: $timestamp, sender: $sender }
    ) {
      id
      tokenContract
      sender
      destination
      eventNonce
      amount
      timestamp
      blockHeight
    }
  }
`
