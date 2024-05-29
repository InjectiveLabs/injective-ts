# Offchain (Arbitrary) Data

On this page, we'll provide an example of how to sign and verify arbitrary data as per the [ADR-036](https://docs.cosmos.network/main/build/architecture/adr-036-arbitrary-signature) specification on Cosmos.&#x20;

{% hint style="info" %}
You can use the `generateArbitrarySignDoc` function from `@injectivelabs/sdk-ts` to generate ADR-36 compatible `signDoc`. You can then use it to sign/verify using a browser wallet or in a CLI environment. Make sure you are using the latest package versions.&#x20;
{% endhint %}

#### Sign and verify using a browser wallet like Keplr

```typescript

(async () => {
  const message = "Offline Sign Message Example";
  const signer = 'inj1...'
  const chainId = 'injective-1'
  
  // Sign Arbitrary Data
  const signature = await window.keplr.signArbitrary(chainId, signer, message)
  
  // Verify Arbitrary Data
  const result = await window.keplr.verifyArbitrary(chainId, signer, message, signature)
  
  if (result) {
    console.log("Signature is valid");
  }
})();
```

#### Sign and verify using PrivateKey in a CLI environment

```typescript
import { config } from "dotenv";
import { PrivateKey, generateArbitrarySignDoc } from "@injectivelabs/sdk-ts";

config();

(async () => {
  const { privateKey } = PrivateKey.generate();
  const injectiveAddress = privateKey.toBech32();
  const publicKey = privateKey.toPublicKey();
  
  const message = "Offline Sign Message Example";
  const { signDocBuff } = generateArbitrarySignDoc(message, injectiveAddress);

  const signature = await privateKey.sign(signDocBuff);
  const signatureInHex = Buffer.from(signature).toString("hex");

  if (
    PrivateKey.verifyArbitrarySignature({
      signature: signatureInHex,
      signDoc: signDocBuff,
      publicKey: publicKey.toHex(),
    })
  ) {
    console.log("Signature is valid");
  }
})();

```
