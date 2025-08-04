# Configuring React

## React - Library for building user interfaces

React is currently one of the most popular UI Frameworks. We are going to help you configure React + the Vite builder with the `@injectivelabs` packages and some polyfills since you'll need them to interact with Crypto wallets.

### 1. Installing React

Follow the Getting Started guide at [Vite Docs](https://vitejs.dev/guide/) and setup your application.

```bash
$ npm create vite@latest
```

### 2. Installing @injectivelabs packages

You can install the @injectivelabs packages using pnpm.

```bash
$ pnpm install @injectivelabs/sdk-ts @injectivelabs/networks @injectivelabs/ts-types @injectivelabs/utils

## If you need Wallet Connection
$ pnpm install @injectivelabs/wallet-strategy
```

These are the most commonly used packages from the `injective-ts` monorepo.

### 3. Configuring Vite and adding polyfills

First, add the needed polyfill packages and buffer&#x20;

{% hint style="info" %}
One of the main dependencies for any crypto-related decentralized application is `Buffer`. To make sure we add `Buffer` To our project, we can install it as a dependency and then make a import it to the global/window object).

Example `vite.config.ts` is shared below.
{% endhint %}

```bash
$ pnpm install @bangjelkoski/node-stdlib-browser
$ pnpm install -D @bangjelkoski/vite-plugin-node-polyfills
$ pnpm install buffer
```

Finally, make sure to import the `buffer` in your `main.tsx` on top of the file

```typescript
import { Buffer } from 'buffer'

if (!window.Buffer) {
  window.Buffer = Buffer // Optional, for packages expecting Buffer to be global
}
```

### 4. Using a state management

React has a lot of different state managers, pick the one you are going to use and install it. You can use the build in `Context API` for state management without the need to install a third-party solution. The preferred third-party state managers are `Redux` and `Zustand`.

```bash
$ pnpm install zustand
```

### 5. vite.config.ts

The last step is to configure Vite to use the `node-polyfills` that we installed earlier.

Open up `vite.config.ts` and add `node-polyfills` inside the `plugins` array.

Your config should look like this:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true })],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // others
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
```

### 8. Booting our app

Finally, you can start your app locally using `pnpm dev` or build for production using `pnpm build` which you can deploy to any static page hosting like Netlify, Vercel, etc.
