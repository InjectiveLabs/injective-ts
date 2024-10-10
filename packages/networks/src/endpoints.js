"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointsMainnetK8s = exports.endpointsMainnetOld = exports.endpointsMainnetLB = exports.endpointsTestnetK8s = exports.endpointsTestnetOld = exports.endpointsLocal = exports.endpointsDevnet2 = exports.endpointsDevnet1 = exports.endpointsDevnet = exports.endpointsTestnet = exports.endpointsTestnetSentry = exports.endpointsInternal = exports.endpointsStaging = exports.endpointsMainnet = exports.endpointsMainnetSentry = void 0;
exports.endpointsMainnetSentry = {
    indexer: 'https://sentry.exchange.grpc-web.injective.network',
    grpc: 'https://sentry.chain.grpc-web.injective.network',
    rpc: 'https://sentry.tm.injective.network',
    rest: 'https://sentry.lcd.injective.network',
    chronos: 'https://sentry.exchange.grpc-web.injective.network',
    explorer: 'https://sentry.explorer.grpc-web.injective.network',
    cacheGrpc: 'https://sentry.chain.grpc-web.injective.network',
    cacheRest: 'https://staging.gateway.grpc-web.injective.network',
    web3gw: 'https://sentry.exchange.grpc-web.injective.network',
};
exports.endpointsMainnet = Object.assign({}, exports.endpointsMainnetSentry);
exports.endpointsStaging = {
    indexer: 'https://staging.api.injective.network',
    grpc: 'https://staging.grpc.injective.network',
    rpc: 'https://staging.tm.injective.network',
    rest: 'https://staging.lcd.injective.network',
    chronos: 'https://staging.api.injective.network',
    explorer: 'https://staging.api.injective.network',
    cacheGrpc: 'https://staging.grpc.injective.network',
    cacheRest: 'https://staging.gateway.grpc-web.injective.network',
    web3gw: 'https://staging.api.injective.network',
};
exports.endpointsInternal = {
    indexer: 'https://products.exchange.grpc-web.injective.network',
    grpc: 'https://products.chain.grpc-web.injective.network',
    rpc: 'https://products.tm.injective.network',
    rest: 'https://products.lcd.injective.network',
    chronos: 'https://products.chronos.grpc-web.injective.network',
    explorer: 'https://products.explorer.grpc-web.injective.network',
    cacheGrpc: 'https://products.chain.grpc-web.injective.network',
    cacheRest: 'https://staging.gateway.grpc-web.injective.network',
    web3gw: 'https://products.web3-gateway.injective.network',
};
exports.endpointsTestnetSentry = {
    indexer: 'https://testnet.sentry.exchange.grpc-web.injective.network',
    grpc: 'https://testnet.sentry.chain.grpc-web.injective.network',
    rpc: 'https://testnet.sentry.tm.injective.network',
    rest: 'https://testnet.sentry.lcd.injective.network',
    chronos: 'https://testnet.sentry.exchange.grpc-web.injective.network',
    explorer: 'https://testnet.sentry.exchange.grpc-web.injective.network',
    cacheGrpc: 'https://testnet.sentry.chain.grpc-web.injective.network',
    cacheRest: 'https://testnet.sentry.exchange.grpc-web.injective.network',
    web3gw: 'https://testnet.sentry.exchange.grpc-web.injective.network',
};
exports.endpointsTestnet = Object.assign({}, exports.endpointsTestnetSentry);
exports.endpointsDevnet = {
    indexer: 'https://devnet.api.injective.dev',
    grpc: 'https://devnet.grpc.injective.dev',
    rpc: 'https://devnet.tm.injective.dev',
    rest: 'https://devnet.lcd.injective.dev',
    chronos: 'https://devnet.api.injective.dev',
    explorer: 'https://devnet.api.injective.dev',
    cacheGrpc: 'https://devnet.grpc.injective.dev',
    cacheRest: 'https://devnet.api.injective.dev',
    web3gw: 'https://devnet.api.injective.dev',
};
exports.endpointsDevnet1 = {
    indexer: 'https://devnet-1.api.injective.dev',
    grpc: 'https://devnet-1.grpc.injective.dev',
    rpc: 'https://devnet-1.tm.injective.dev',
    rest: 'https://devnet-1.lcd.injective.dev',
    chronos: 'https://devnet-1.api.injective.dev',
    explorer: 'https://devnet-1.api.injective.dev',
    cacheGrpc: 'https://devnet-1.grpc.injective.dev',
    cacheRest: 'https://devnet-1.api.injective.dev',
    web3gw: 'https://devnet-1.api.injective.dev',
};
exports.endpointsDevnet2 = {
    indexer: 'https://devnet-2.api.injective.dev',
    grpc: 'https://devnet-2.grpc.injective.dev',
    rpc: 'https://devnet-2.tm.injective.dev',
    rest: 'https://devnet-2.lcd.injective.dev',
    chronos: 'https://devnet-2.api.injective.dev',
    explorer: 'https://devnet-2.api.injective.dev',
    cacheGrpc: 'https://devnet-2.grpc.injective.dev',
    cacheRest: 'https://devnet-2.api.injective.dev',
    web3gw: 'https://devnet-2.api.injective.dev',
};
exports.endpointsLocal = {
    indexer: 'https://localhost:4444',
    grpc: 'http://localhost:10337',
    rpc: 'http://localhost:9092',
    rest: 'http://localhost:10337',
    chronos: 'https://localhost:4442',
    explorer: 'http://localhost:4443',
    cacheGrpc: 'http://localhost:10337',
    cacheRest: 'https://localhost:4444',
    web3gw: 'https://localhost:4444',
};
/**
 * @deprecated use TestnetSentry instead
 */
exports.endpointsTestnetOld = {
    indexer: 'https://testnet.exchange.grpc-web.injective.network',
    grpc: 'https://testnet.chain.grpc-web.injective.network',
    rpc: 'https://testnet.tm.injective.network',
    rest: 'https://testnet.lcd.injective.network',
    chronos: 'https://testnet.exchange.grpc-web.injective.network',
    explorer: 'https://testnet.exchange.grpc-web.injective.network',
    web3gw: 'https://testnet.exchange.grpc-web.injective.network',
    cacheGrpc: 'https://testnet.exchange.grpc-web.injective.network/',
    cacheRest: 'https://testnet.exchange.grpc-web.injective.network',
};
/**
 * @deprecated use TestnetSentry instead
 */
exports.endpointsTestnetK8s = {
    indexer: 'https://k8s.testnet.exchange.grpc-web.injective.network',
    grpc: 'https://k8s.testnet.chain.grpc-web.injective.network',
    rpc: 'https://k8s.testnet.tm.injective.network',
    rest: 'https://k8s.testnet.lcd.injective.network',
    chronos: 'https://k8s.testnet.exchange.grpc-web.injective.network',
    explorer: 'https://k8s.testnet.explorer.grpc-web.injective.network',
    cacheGrpc: 'https://k8s.testnet.gateway.grpc.injective.network',
    cacheRest: 'https://k8s.testnet.gateway.grpc-web.injective.network',
    web3gw: 'https://k8s.testnet.exchange.grpc-web.injective.network',
};
/**
 * @deprecated use MainnetSentry instead
 */
exports.endpointsMainnetLB = {
    indexer: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
    grpc: 'https://k8s.global.mainnet.chain.grpc-web.injective.network',
    rpc: 'https://k8s.global.mainnet.tm.injective.network',
    rest: 'https://k8s.global.mainnet.lcd.injective.network',
    chronos: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
    explorer: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
    cacheGrpc: 'https://k8s.global.mainnet.chain.grpc-web.injective.network',
    cacheRest: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
    web3gw: 'https://k8s.global.mainnet.exchange.grpc-web.injective.network',
};
/**
 * @deprecated use MainnetSentry instead
 */
exports.endpointsMainnetOld = {
    indexer: 'https://api.injective.network',
    grpc: 'https://grpc.injective.network',
    cacheGrpc: 'https://grpc.injective.network',
    rpc: 'https://tm.injective.network',
    rest: 'https://lcd.injective.network',
    cacheRest: 'https://api.injective.network',
    chronos: 'https://api.injective.network',
    explorer: 'https://api.injective.network',
    web3gw: 'https://api.injective.network',
};
/**
 * @deprecated use MainnetSentry instead
 */
exports.endpointsMainnetK8s = {
    indexer: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
    grpc: 'https://k8s.mainnet.chain.grpc-web.injective.network',
    rpc: 'https://k8s.mainnet.tm.injective.network',
    rest: 'https://k8s.mainnet.lcd.injective.network',
    chronos: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
    explorer: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
    cacheGrpc: 'https://k8s.mainnet.chain.grpc-web.injective.network',
    cacheRest: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
    web3gw: 'https://k8s.mainnet.exchange.grpc-web.injective.network',
};
//# sourceMappingURL=endpoints.js.map