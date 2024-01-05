# Market min quantity tick size

The min market quantity tick size for an order price - if a market has an minQuantityTickSize of `0.001` and order submission with the quantity of `0.0011` will be rejected.

Note that derivate markets shares the same format for minQuantityTickSize between UI and the chain, so no formatting is required.

### Spot market

1.  UI human readable to chain format:
    Using on a INJ/USDT market which has 18 base decimals and 6 quote decimals as an example, here's how we convert the value to the chain format:

```js
const chainFormat = new BigNumberInWei(value).toBase(baseDecimals)
```

1. Chain format to UI human readable format:
   Using INJ/USDT market which has 18 base decimals and 6 quote decimals as an example, here's how we convert the value to the UI human readable format:

```js
const humanReadableFormat = new BigNumber(minQuantityTickSize)
  .shiftedBy(-baseDecimals)
  .toFixed()
```
