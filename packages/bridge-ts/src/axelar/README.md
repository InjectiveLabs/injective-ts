The use-case of the `AxelarClient` is to enable a bridge between Injective and Moonbeam. This abstraction is mainly used to transfer DOT to using Axelar between Injective and Moonbeam. Let's quickly see the process of transferring assets between Injective and Moonbeam using the `AxelarClient`.

### Axelar -> Injective

To transfer DOT to Injective through Axelar from the Moonbeam network we need to:

1. First, we need to get a deposit address to transfer

```ts
const MOONBEAM_MAINNET_GATEWAY_ADDRESS = '0x..'
const destinationAddress = ''

const axelarClient = new AxelarClient({
  environment: 'mainnet',
  gatewayAddress: MOONBEAM_MAINNET_GATEWAY_ADDRESS,
})

const depositAddress = axelarClient.getDepositAddress({
  sourceChain: 'moonbeam',
  destinationChain: 'injective',
  address: destinationAddress,
  asset: 'dot-planck'
})
```

2. And then we sign and submit an Ethereum transaction on the Moonbeam network

```ts
const MOONBEAM_DOT_CONTRACT_ADDRESS = '0x..'

const axelarClient = new AxelarClient({
  environment: 'mainnet',
  gatewayAddress: MOONBEAM_MAINNET_GATEWAY_ADDRESS,
})

return await axelarClient.transferTokens({
  contractAddress: MOONBEAM_DOT_CONTRACT_ADDRESS,
  amount: amount.toFixed(),
  receiver: depositAddress
})
```

### Injective -> Injective

To transfer DOT from Injective through Axelar to the Moonbeam network we need to:

1. First, we need to get a deposit address to transfer

```ts
const MOONBEAM_MAINNET_GATEWAY_ADDRESS = '0x..'
const destinationAddress = ''

const axelarClient = new AxelarClient({
  environment: 'mainnet',
  gatewayAddress: MOONBEAM_MAINNET_GATEWAY_ADDRESS,
})

const depositAddress = axelarClient.getDepositAddress({
  address: destinationAddress,
  sourceChain: 'injective',
  destinationChain: 'moonbeam',
  asset: 'dot-planck'
})
```

2. Pack an IBC transfer Message on Injective and broadcast a transaction with that message
