import { getSignedVAAWithRetryFromRest } from './vaa'

describe('Wormhole API', () => {
  test('getSignedVAAWithRetryFromRest success', async () => {
    console.log(
      await getSignedVAAWithRetryFromRest(
        '4v46ixpJHUXrKoDSXRaHh6NmBSiL5K4FgWAAipuoPzAj7ZKjLkgDgQ5AxfSxAw5YcuDomMyLq1z9kW38FtuQPUEe',
        'https://api.wormholescan.io/api/v1',
      ),
    )
  })

  test('getSignedVAAWithRetryFromRest error', async () => {
    console.log(
      await getSignedVAAWithRetryFromRest(
        '4v46ixpJHUXrKoDSXRaHh6NmBSiL5K4FgWAAipuoPzAj7ZKjLkgDgQ5AxfSxAw5YcuDomMyLq1z9kW38FtuQPUE4',
        'https://api.wormholescan.io/api/v1',
      ),
    )
  })
})
