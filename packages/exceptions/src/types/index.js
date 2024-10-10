"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = exports.HttpRequestMethod = void 0;
__exportStar(require("./modules"), exports);
__exportStar(require("./codes"), exports);
var HttpRequestMethod;
(function (HttpRequestMethod) {
    HttpRequestMethod["Get"] = "GET";
    HttpRequestMethod["Post"] = "POST";
    HttpRequestMethod["Options"] = "OPTIONS";
})(HttpRequestMethod = exports.HttpRequestMethod || (exports.HttpRequestMethod = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["Unspecified"] = "unspecified";
    ErrorType["ChainError"] = "chain-error";
    ErrorType["ExecutionError"] = "execution-error";
    ErrorType["NotFoundError"] = "not-found-error";
    ErrorType["ValidationError"] = "validation-error";
    ErrorType["WalletError"] = "wallet-error";
    ErrorType["WalletNotInstalledError"] = "wallet-not-installed-error";
    ErrorType["GrpcUnaryRequest"] = "grpc-unary-request";
    ErrorType["HttpRequest"] = "http-request";
    ErrorType["Web3"] = "web3";
    ErrorType["Web3Gateway"] = "web3-gateway";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
//# sourceMappingURL=index.js.map