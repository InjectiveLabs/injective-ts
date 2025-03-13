# Creating Tokens

The easiest way to create your own token on Injective is by using the `tokenfactory` module. The `tokenfactory` module allows any account to create a new token with the name `factory/{creator address}/{subdenom}`. Because tokens are namespaced by creator address, this allows token minting to be permissionless, due to not needing to resolve name collisions.

A single account can create multiple denoms, by providing a unique subdenom for each created denom. Once a denom is created, the original creator is given "admin" privileges over the asset. This allows them to:

* Mint their denom to any account
* Burn their denom from any account
* Create a transfer of their denom between any two accounts
* Change the admin. In the future, more admin capabilities may be added. Admins can choose to share admin privileges with other accounts using the authz module. The ChangeAdmin functionality allows changing the master admin account, or even setting it to the zero address `inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49`, meaning no account has admin privileges over the asset.
* Set their token metadata on chain

{% hint style="info" %}
One special use case for the factory denoms is the `CW20_ADAPTER`. Using this adapter, assets represented as CW20 can be converted to a bank denom which then can be used to launch a market, send easily on chain, etc.&#x20;

The denom for a CW20 asset is always in the `factory/{CW20_ADAPTER_CONTRACT_ADDRESS}/{CW20_ASSET_ADDRESS}` where `CW20_ADAPTER_CONTRACT_ADDRESS=inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk` for mainnet.&#x20;
{% endhint %}

To start creating your denoms, head to our [TokenFactory Core Module page ](../../core-modules-and-examples/token-factory.md)to see examples.
