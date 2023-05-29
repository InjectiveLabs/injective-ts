# Getting Started - Cosmjs

Injective is not natively supported on the `@cosmjs` packages. It's highly recommended to use our `@injectivelabs` packages to interact with Injective.

If you are familiar with the `@cosmjs` packages we are exporting similar interfaces/classes that work exactly the same as the classes on `@cosmjs` but have support for Injective as well.

#### Usage using Keplr

Here is an example on how to use the `@injectivelabs` alternatives from the `@cosmjs` packages with Keplr:

```ts
import {
  PrivateKey,
  InjectiveStargate,
} from "@injectivelabs/sdk-ts";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess } from '@cosmjs/stargate'

(async () => {
  // Enable Keplr
  await window.keplr.enable(chainId);

  // Get the offline signer
  const offlineSigner = window.getOfflineSigner(chainId);
  const [account] = await offlineSigner.getAccounts();

  // Initialize the stargate client
  const client =
    await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
      "https://lcd-cosmoshub.keplr.app/rest",
      offlineSigner,
    );
  })

  const amount = {
    denom: "inj",
    amount: amount.toString(),
  };
  const fee = {
    amount: [
      {
        denom: "inj",
        amount: "5000000000000000",
      },
    ],
    gas: "200000",
  };

  const result = await client.sendTokens(
    account.address,
    recipient,
    [amount],
    fee,
    ""
  );

  assertIsBroadcastTxSuccess(result);

  if (result.code !== undefined && result.code !== 0) {
    alert("Failed to send tx: " + result.log || result.rawLog);
  } else {
    alert("Succeed to send tx:" + result.transactionHash);
  }
})()
```

#### Usage in a CLI/Node environment

Here is an example on how to use the `@injectivelabs` alternatives from the `@cosmjs` packages in a node or CLI environment:

```ts
import {
  PrivateKey,
  InjectiveStargate,
  InjectiveDirectEthSecp256k1Wallet,
} from "@injectivelabs/sdk-ts";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { Network, getNetworkInfo } from "@injectivelabs/networks";
import { getStdFee } from "@injectivelabs/utils";

(async () => {
  const network = getNetworkInfo(Network.Testnet);
  const privateKeyHash = process.env.PRIVATE_KEY as string;
  const privateKey = PrivateKey.fromHex(privateKeyHash);
  const injectiveAddress = privateKey.toBech32();

  const wallet = (await InjectiveDirectEthSecp256k1Wallet.fromKey(
    Buffer.from(privateKeyHash, "hex")
  )) as OfflineDirectSigner;
  const [account] = await wallet.getAccounts();

  const client =
    await InjectiveStargate.InjectiveSigningStargateClient.connectWithSigner(
      network.rpc as string,
      wallet
    );

  const recipient = injectiveAddress;
  const amount = {
    denom: "inj",
    amount: "1000000000",
  };
  
  const txResponse = await client.sendTokens(
    account.address,
    recipient,
    [amount],
    getStdFee(),
    "Have fun with your star coins"
  );

  if (txResponse.code !== 0) {
    console.log(`Transaction failed: ${txResponse.rawLog}`);
  } else {
    console.log(
      `Broadcasted transaction hash: ${JSON.stringify(
        txResponse.transactionHash
      )}`
    );
  }
})();
```
