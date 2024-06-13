# 📜 Contributing


## Validator Icons

Please reference the following steps when adding a new validator icon.

1. Add or replace the icon in the `validators-logo` folder. Note that the file name should be the operator address. The preferred file format is `webp` due to the rich image quality yet small file size, but other file formats will work as well such as `jpg`, `png`, or `svg`.

2. Add the operator/consensus address mappings to `validatorAddressToPathMap` in `utils/mappings.ts`. Note that you will have to add two items to the map. The first item will be in format: `<consensus address>:<file path>`. The second item will be in format: `<operator address>:<file path>`.

## Adding a Bridge

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

This guide is currently under work in progress.

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

## Adding a Wormhole Ethereum Bridge Token

Please reference the following steps when adding a new validator icon.

1. Within the `tokenDenomsPerNetwork` array in `src/utils/bridge.ts` add the symbol of the token in the `symbols` array for the entry which has the `network: BridgingNetwork.EthereumWh`.

Example:

```ts
  // ...
  {
    network: BridgingNetwork.EthereumWh,
    denoms: [],
    symbols: ['USDCet', 'CHZ', /* Added new Token here: */ 'LDO'],
  },
  // ...
```
