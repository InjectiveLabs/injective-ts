# Simple HTML example with Webpack

The [example](https://github.com/InjectiveLabs/injective-ts-webpack-example) is based on the [Cosmos transaction handling section](../../transactions/transactions-cosmos/).

## Running the example

Clone the project repo:&#x20;

```
git clone https://github.com/InjectiveLabs/injective-ts-webpack-example.git
```

Ensure you have npm installed and install dependencies:

```
cd injective-ts-webpack-example && npm install
```

Run the example:

```
npm start
....
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/
....
```

Go to the http://localhost:8080/ in your browser. If you have a Kelr wallet set up and connected to the Injective testnet, you should see "Confirm Transaction" pop up window.

## How does it work?

Transaction logic is in the `src/sendTx.tx`, which is loaded by `src/index.html`  Webpack is used to put eveything together and serve on the local server endpoint.

The `webpack.config.js` file configures Webpack to bundle a TypeScript application starting from `./src/sendTx.ts`, using `ts-loader` to transpile TypeScript files, and includes rules to handle `.js` and `.json` files appropriately. It resolves browser-compatible versions of Node.js core modules using the `fallback` option, enabling modules like `buffer`, `crypto`, and `stream` in the browser environment. The configuration utilizes `HtmlWebpackPlugin` to generate an HTML file based on `src/index.html`, and `ProvidePlugin` to automatically load `Buffer` and `process` variables globally. The bundled output is named `bundle.js` and placed in the `dist` directory, and the `devServer` is set up to serve content from `./dist` for development purposes.

