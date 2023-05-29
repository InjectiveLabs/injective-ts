# Configuring Nuxt

## Nuxt3 - The Intuitive Web Framework

The preferred choice of UI framework to build decentralized applications on top of Injective at @InjectiveLabs is Nuxt3. We are going to help you configure Nuxt3 + the Vite builder with the `@injectivelabs` packages and some polyfills since you'll need them to interact with Crypto wallets.

#### 1. Installing Nuxt 3

Follow the Getting Started guide at [Nuxt3 Docs](https://nuxt.com/docs/getting-started/installation) and setup your application.

#### 2. Installing @injectivelabs packages

You can install the @injectivelabs packages using yarn.

```bash
$ yarn add @injectivelabs/sdk-ts @injectivelabs/networks @injectivelabs/ts-types @injectivelabs/utils

## If you need Wallet Connection
$ yarn add @injectivelabs/wallet-ts
```

These are the most commonly used packages from the `injective-ts` monorepo.

#### 3. Configuring Nuxt and adding polyfills

First, add the needed polyfill packages

```bash
$ yarn add @bangjelkoski/node-stdlib-browser
$ yarn add -D @bangjelkoski/vite-plugin-node-polyfills
```

Make sure you are using the `vue-tsc@^1.2.0`, `nuxt@^3.3.3`, `typescript@^4.9.5` versions.

**Buffer**

One of the main dependencies for any crypto-related decentralized application is Buffer. To make sure we add Buffer to our project, we can install it as a dependency and then make a Nuxt plugin to import it to the global/window object:

```bash
$ yarn add buffer
```

```ts
// filename - plugins/buffer.client.ts
export default defineNuxtPlugin(() => {
  import('buffer/').then((Buffer) => {
    window.Buffer = window.Buffer || Buffer.default.Buffer
    globalThis.Buffer = window.Buffer || Buffer.default.Buffer
  })
})
```

#### 4. Using a state management

If you are going to use `pinia` as state management, add it to your packages:

```bash
$ yarn add pinia @pinia/nuxt
```

#### 5. Using `vueuse`

We recommend adding `@vueuse/nuxt` as a dependency as it offers a lot of utility functions out of the box.

Then, we need to configure the `tsconfig.json` if you are using TypeScript (recommended). You can reference the following `tsconfig.json` as a base.

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "module": "esnext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": [
      "@vueuse/nuxt",
      "@pinia/nuxt",
    ]
  },
  "exclude": [
    "node_modules",
    "dist",
    ".output"
  ],
}
```

#### 6. nuxt.config.ts / packages.json

Before we boot our application, we need to set everything up in the `nuxt.config.ts`, the main configuration point for every Nuxt 3 application. Let's see a reference `nuxt.config.ts` and explain every line using comments so its easier for developers to understand.

```ts
// filename - nuxt.config.ts
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

export default defineNuxtConfig({
  ssr: false, // whether to pre-render your application
  modules: [ // nuxtjs modules
    "@pinia/nuxt", 
    "@vueuse/nuxt", 
  ],

  typescript: {
    typeCheck: "build", // we recommend build so you do typescript checks only on build type
  },
 
  imports: { // automatic imports of store definitions (if you use pinia)
    dirs: ["store/**"],
  },

  pinia: { // import pinia definitions 
    autoImports: ["defineStore"],
  },

  plugins: [{ // import the buffer plugin we've made
    src: "./plugins/buffer.client.ts", 
    ssr: false 
  }],

  // We generate only sitemaps for the client side as we don't need a server
  // Note: there is a problem with sitemaps for Vite + Nuxt3 
  // as usually is that it takes to much time/memory to generate
  // sitemaps and the build process can fail
  // on Github Actions/Netlify/Vercel/etc so we have to use another 
  // strategy like generating them locally and them pushing them to services like
  // busgnag
  sourcemap: { 
    server: false,
    client: true,
  },

  // Vite related config
  vite: {
    define: {
      "process.env": JSON.stringify({}),
      "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
    },

    plugins: [ // setting up node + crypto polyfils
      nodePolyfills({ protocolImports: false })
      ],

    build: {
      sourcemap: false, // we don't generate 

      // default rollup options
      rollupOptions: {
        cache: false,
        output: {
          manualChunks: (id: string) => {
            //
          },
        },
      },
    },

    // needed for some Vite related issue for the 
    // @bangjelkoski/vite-plugin-node-polyfills plugin
    optimizeDeps: {
      exclude: ["fsevents"],
    },
  },
});
```

There is one optimization that you can to decrease the bundle size - add these resolutions in the `packages.json`

```
"resolutions": {
  "@ethereumjs/tx": "^4.1.1",
  "**/libsodium": "npm:@bangjelkoski/noop",
  "**/libsodium-wrappers": "npm:@bangjelkoski/noop"
}
```

#### 7. Booting our app

Finally, you can start your app locally using `yarn dev` or generate static pages using `yarn generate` which you can deploy to any static page hosting like Netlify, Vercel, etc.
