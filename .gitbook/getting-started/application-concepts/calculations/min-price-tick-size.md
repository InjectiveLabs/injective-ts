# Market min price tick size

The min market price tick size for an order price - if a market has an minPriceTickSick of `0.001` and order submission with the price of `0.0011` will be rejected.

Note that calculating the formula for calculating a spot and quote market price tick size are different.

### Spot market

1.  UI human readable to chain format:
    Using INJ/USDT market which has 18 base decimals and 6 quote decimals as an example, here's how we convert the value to the chain format:

```ts
import { toChainFormat } from '@injectivelabs/utils'

const value = toChainFormat(value, quoteDecimals - baseDecimals).toFixed()
```

2. Chain format to UI human readable format:
   Using INJ/USDT market which has 18 base decimals and 6 quote decimals as an example, here's how we convert the value to the UI human readable format:

```ts
import { toHumanReadable } from '@injectivelabs/utils'

const value = toHumanReadable(
  value,
  quoteDecimals - baseDecimals,
).toFixed()
```

### Derivative market

1.  UI human readable to chain format:
    Using INJ/USDT perp market which has 6 quote decimals as an example, here's how we convert the value to the chain format:

```ts
import { toChainFormat } from '@injectivelabs/utils'

const value = toChainFormat(value, -quoteDecimals).toFixed()
```

2. Chain format to UI human readable format:
   Using INJ/USDT perp market which has 6 quote decimals as an example, here's how we convert the value to the UI human readable format:

```ts
import { toHumanReadable } from '@injectivelabs/utils'

const value = toHumanReadable(value, quoteDecimals).toFixed()
```
