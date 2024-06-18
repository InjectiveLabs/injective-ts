# 📜 Contributing

## Token Metadata

Please reference the following steps when adding a new token metadata. **Ensure that the PR you make is done on the `dev` branch**

1. Add the token information to the `src/tokens/tokens/tokens.ts` array in the following `TokenMeta` interface:

```ts
// the specific TokenMeta interfaces can be found in `src/types.ts`
export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType?: TokenType
  coinGeckoId: string

  ibc?: IbcTokenMeta
  spl?: SplTokenMeta
  cw20?: Cw20TokenMeta
  cw20s?: Cw20TokenMetaWithSource[] // When there are multiple variations of the same CW20 token
  erc20?: Erc20TokenMeta
  evm?: EvmTokenMeta
}
```

Example:

```ts
CHZ: {
  name: 'Chiliz',
  symbol: 'CHZ',
  decimals: 18,
  logo: 'chz.png',
  coinGeckoId: 'chiliz',

  erc20: {
    decimals: 18,
    address: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
    tokenType: TokenType.Erc20,
  },

  cw20: {
    decimals: 8,
    address: 'inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh',
    tokenType: TokenType.Cw20,
  },
},
```
