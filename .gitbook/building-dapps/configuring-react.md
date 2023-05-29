# Configuring React

## React - Library for building user interfaces

React is currently one of the most popular UI Frameworks. We are going to help you configure React + the Vite builder with the `@injectivelabs` packages and some polyfills since you'll need them to interact with Crypto wallets.

#### 1. Installing React

Follow the Getting Started guide at [Vite Docs](https://vitejs.dev/guide/) and setup your application.

```bash
$ npm create vite@latest
```

#### 2. Installing @injectivelabs packages

You can install the @injectivelabs packages using yarn.

```bash
$ yarn add @injectivelabs/sdk-ts @injectivelabs/networks @injectivelabs/ts-types @injectivelabs/utils

## If you need Wallet Connection
$ yarn add @injectivelabs/wallet-ts
```

These are the most commonly used packages from the `injective-ts` monorepo.

#### 3. Configuring Vite and adding polyfills

First, add the needed polyfill packages

```bash
$ yarn add @bangjelkoski/vite-plugin-node-polyfills
```

#### 4. Using a state management

React has a lot of different state managers, pick the one you are going to use and install it. You can use the build in `Context API` for state management without the need to install a third-party solution. The preffered third-party state managers are `Redux` and `Zustand`.

```bash
$ yarn add zustand
```

#### 5. vite.config.ts

The last step is to configure Vite to use the `node-polyfills` that we installed earlier.

Open up `vite.config.ts` and add `node-polyfills` inside the `plugins` array.

Your config should look like this:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true })],
});
```

#### 8. Booting our app

Finally, you can start your app locally using `yarn dev` or build for production using `yarn build` which you can deploy to any static page hosting like Netlify, Vercel, etc.
