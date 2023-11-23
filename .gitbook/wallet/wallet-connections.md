# Wallet Connections

Injective supports both Ethereum and Cosmos native wallets. You can use popular wallets like Metamask, Ledger, Keplr, Leap, etc. to sign transactions on Injective.&#x20;

### Wallet Strategy

The recommended way to have support for all of these wallets out of the box is to use the [WalletStrategy](wallet-wallet-strategy.md) abstraction we've built. This approach will enable your dApp users to connect and interact with different wallets.&#x20;

Combining it with the [MsgBroadcaster](../transactions/msgbroadcaster.md) abstraction allows you to sign transactions using one function call. This is what's being used on all products like Helix, Hub, Explorer, etc., and we strongly recommend using this approach in your dApp.&#x20;

In case you still want to use some wallet natively (without the WalletStrategy class), we are going to provide examples of how to connect to a dApp built on Injective via Metamask and Keplr in this doc.&#x20;

### Metamask

Metamask is an Ethereum native wallet and can be used to connect and interact with your dApp built on Injective.&#x20;

* **Get Injective addresses from Metamask**

<pre class="language-typescript"><code class="lang-typescript"><strong>
</strong><strong>import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
</strong>
<strong>const getEthereum = () => {
</strong>  if (!window.ethereum) {
    throw new Error('Metamask extension not installed')
  }
  
  return window.ethereum
}
<strong>
</strong><strong>const ethereum = getEthereum()
</strong><strong>const addresses = await ethereum.request({
</strong>  method: 'eth_requestAccounts',
}) /** these are evm addresses */

const injectiveAddresses = addresses.map(getInjectiveAddress)
console.log(injectiveAddresses)
</code></pre>

* **Sign transactions using Metamask**

An example of how to prepare + sign + broadcast a transaction on Injective using Metamask can be found [here](../transactions/ethereum.md).

### Keplr

Keplr is an Cosmos native wallet and can be used to connect and interact with your dApp built on Injective.&#x20;

* **Get Injective addresses from Keplr**

<pre class="language-typescript"><code class="lang-typescript"><strong>
</strong><strong>import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
</strong><strong>import { ChainId } from '@injectivelabs/ts-types'
</strong>
<strong>const getKeplr = () => {
</strong>  if (!window.keplr) {
    throw new Error('Keplr extension not installed')
  }
  
  return window.keplr
}
<strong>
</strong><strong>(async() => {
</strong>  const keplr = getKeplr()
<strong>  const chainId = ChainId.Mainnet
</strong><strong>  await keplr.enable(chainId)
</strong><strong>  const injectiveAddresses = await keplr.getOfflineSigner(chainId).getAccounts()
</strong><strong>
</strong><strong>  console.log(injectiveAddresses)
</strong>})()
</code></pre>

* **Sign transactions using Keplr**

An example of how to prepare + sign + broadcast a transaction on Injective using Keplr can be found [here](../transactions/transactions-cosmos/).
