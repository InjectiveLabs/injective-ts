# 🌟 Injective Protocol - Token Metadata

---

## 📚 Installation

```bash
yarn add @injectivelabs/token-metadata
```

---

## 📖 Documentation

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

The Injective Token Metadata package contains details for all tokens deployed on Injective whether they are native tokens, CW20 tokens, tokens transferred via IBC and even tokens created by the Peggy Module.

### Adding token metadata

Tokens added to the metadata package must conform to the schema provided so that downstream tools and packages can access your token data in a standard way.

Here is an example of the schema for adding a tokens data
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
}
```
Each one for the most part has a similar structure but handled the different details needed for each token standard.

Here is an example you can use for CW20s:
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

And one for IBC denoms:

```ts
SCRT: {
    name: 'Secret Network',
    symbol: 'SCRT',
    decimals: 6,
    logo: 'scrt.png',
    coinGeckoId: 'secret',

    ibc: {
      decimals: 6,
      isNative: true,
      baseDenom: 'uscrt',
      path: 'transfer/channel-88',
      channelId: 'channel-88',
      hash: '0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
      tokenType: TokenType.Ibc,
    },
  },
```


In general please refer to [Contributing.md](CONTRIBUTING.md) for up to date information on how to structure your data before a PR.


### Adding chain metadata such as IBC channels

Adding metadata related to a Chain mostly consists of providing Channel information for IBC and also the denom of Injective on your change

+ Most of the work will be done in [`src/ibc/channels.ts`](src/ibc/channels.ts).
+ Add an entry to `CanonicalChannelToDestinationChannel` for your Chain and its channel, this will be used for the Injective IBC denom
+ Add the From Injective channel details which is the path from Injective to your Chain in `canonicalChannelsToChainMapFromInjective`.
+ Add the To Injective channel details which is the path to Injective from your Chain in `canonicalChannelsToChainMapToInjective`

In general please refer to [Contributing.md](CONTRIBUTING.md) for up to date information on how to structure your data before a PR.


🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injective.com" target="_blank">`injective.com`</a>
- Twitter at <a href="https://twitter.com/Injective_" target="_blank">`@Injective`</a>
- Discord at <a href="https://discord.com/invite/NK4qdbv" target="_blank">`Discord`</a>
- Telegram at <a href="https://t.me/joininjective" target="_blank">`Telegram`</a>

---

## 🔓 License

Copyright © 2021 - 2022 Injective Labs Inc. (https://injectivelabs.org/)

<a href="https://iili.io/mNneZN.md.png"><img src="https://iili.io/mNneZN.md.png" style="width: 300px; max-width: 100%; height: auto" />

Originally released by Injective Labs Inc. under: <br />
Apache License <br />
Version 2.0, January 2004 <br />
http://www.apache.org/licenses/


<p>&nbsp;</p>
<div align="center">
  <sub><em>Powering the future of decentralized finance.</em></sub>
</div>
