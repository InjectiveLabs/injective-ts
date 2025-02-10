# Permissions Module

The Permissions Module facilitates the management of namespaces, roles, and permissions within the Injective ecosystem. This documentation outlines the key message types and their usage for interacting with permissions-related data.

### Messages

Let's explore (and provide examples) the Messages that the Permissions module exports and we can use to interact with the Injective chain.

### `MsgClaimVoucher`

This message is used to claim a voucher tied to a specific address within a namespace.

```ts
import {
  MsgClaimVoucher,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const denom = "inj";

const msg = MsgClaimVoucher.fromJSON({
  injectiveAddress,
  denom,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```

### `MsgCreateNamespace`

This message is used to creates a new namespace with permissions and roles.

```ts
import {
  MsgCreateNamespace,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const secondAddress = "inj2.....";
const privateKey = "0x...";
const denom = "inj";
const wasmHook = "inj3....";
const mintsPausedValue = false;
const sendsPausedValue = false;
const burnsPausedValue = false;
const role1 = "Everyone";
const permissions1 = 1;

const msg = MsgCreateNamespace.fromJSON({
  injectiveAddress,
  namespace: {
    denom,
    wasmHook,
    mintsPausedValue,
    sendsPausedValue,
    burnsPausedValue,
    rolePermissions: {
      role: role1,
      permissions: permissions1,
    },
    addressRoles: {
      address: injectiveAddress,
      roles: [role1],
    },
  },
})


const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```

### `MsgDeleteNamespace`

This message is used to delete an existing namespace.

```ts
import {
  MsgDeleteNamespace,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const denom = "inj";

const msg = MsgDeleteNamespace.fromJSON({
  injectiveAddress,
  denom
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```

### `MsgRevokeNamespaceRoles`

This message is used to revoke roles from specified addresses in a namespace.

```ts
import {
  MsgRevokeNamespaceRoles,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const denom = "inj";
const roles = ["role1","role2"];

const msg = MsgRevokeNamespaceRoles.fromJSON({
  injectiveAddress,
  denom,
  addressRolesToRevoke: {
    injectiveAddress,
    roles: roles,
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```

### `MsgUpdateNamespace`

This message is used to update namespace properties like mints, sends, and burns.

```ts
import {
  MsgUpdateNamespace,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1..."
const privateKey = "0x...";
const denom = "inj";
const wasmHookValue = "inj2...";
const mintsPausedValue = false;
const sendsPausedValue = false;
const burnsPausedValue = true;

const msg = await new MsgUpdateNamespace.fromJSON({
  injectiveAddress,
  denom,
  wasmHook: {
    newValue: wasmHookValue
  },
  mintsPaused: {
    newValue: mintsPausedValue;
  },
  sendsPaused: {
    newValue: sendsPausedValue;
  },
  burnsPaused: {
    newValue: burnsPausedValue;
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```

### `MsgUpdateNamespaceRoles`

This message is used to modify the roles and permissions for addresses in a namespace.

```ts
import {
  MsgUpdateNamespaceRoles,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const denom = "inj";
const role = "role1";
const permissions = 4;

const msg = MsgUpdateNamespaceRoles.fromJSON({
  injectiveAddress,
  denom,
  rolePermissions: {
    role,
    permissions: permissions
  },
  addressRoles: {
    injectiveAddress,
    roles: [role],
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet
}).broadcast({
  msgs: msg
});

console.log(txHash);

```
