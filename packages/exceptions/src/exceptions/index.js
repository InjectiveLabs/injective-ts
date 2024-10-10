"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcUnaryRequestException = exports.CosmosWalletException = exports.LedgerCosmosException = exports.HttpRequestException = exports.OkxWalletException = exports.TrustWalletException = exports.TransactionException = exports.MetamaskException = exports.BitGetException = exports.GeneralException = exports.WalletException = exports.TrezorException = exports.LedgerException = exports.Web3Exception = exports.isThrownException = void 0;
const GrpcUnaryRequestException_1 = require("./GrpcUnaryRequestException");
Object.defineProperty(exports, "GrpcUnaryRequestException", { enumerable: true, get: function () { return GrpcUnaryRequestException_1.GrpcUnaryRequestException; } });
const HttpRequestException_1 = require("./HttpRequestException");
Object.defineProperty(exports, "HttpRequestException", { enumerable: true, get: function () { return HttpRequestException_1.HttpRequestException; } });
const Web3Exception_1 = require("./Web3Exception");
Object.defineProperty(exports, "Web3Exception", { enumerable: true, get: function () { return Web3Exception_1.Web3Exception; } });
const GeneralException_1 = require("./GeneralException");
Object.defineProperty(exports, "GeneralException", { enumerable: true, get: function () { return GeneralException_1.GeneralException; } });
const LedgerException_1 = require("./LedgerException");
Object.defineProperty(exports, "LedgerException", { enumerable: true, get: function () { return LedgerException_1.LedgerException; } });
const LedgerCosmosException_1 = require("./LedgerCosmosException");
Object.defineProperty(exports, "LedgerCosmosException", { enumerable: true, get: function () { return LedgerCosmosException_1.LedgerCosmosException; } });
const MetamaskException_1 = require("./MetamaskException");
Object.defineProperty(exports, "MetamaskException", { enumerable: true, get: function () { return MetamaskException_1.MetamaskException; } });
const TrustWalletException_1 = require("./TrustWalletException");
Object.defineProperty(exports, "TrustWalletException", { enumerable: true, get: function () { return TrustWalletException_1.TrustWalletException; } });
const OkxWalletException_1 = require("./OkxWalletException");
Object.defineProperty(exports, "OkxWalletException", { enumerable: true, get: function () { return OkxWalletException_1.OkxWalletException; } });
const TrezorException_1 = require("./TrezorException");
Object.defineProperty(exports, "TrezorException", { enumerable: true, get: function () { return TrezorException_1.TrezorException; } });
const CosmosWalletException_1 = require("./CosmosWalletException");
Object.defineProperty(exports, "CosmosWalletException", { enumerable: true, get: function () { return CosmosWalletException_1.CosmosWalletException; } });
const TransactionException_1 = require("./TransactionException");
Object.defineProperty(exports, "TransactionException", { enumerable: true, get: function () { return TransactionException_1.TransactionException; } });
const WalletException_1 = require("./WalletException");
Object.defineProperty(exports, "WalletException", { enumerable: true, get: function () { return WalletException_1.WalletException; } });
const exception_1 = require("../exception");
const BitGetException_1 = require("./BitGetException");
Object.defineProperty(exports, "BitGetException", { enumerable: true, get: function () { return BitGetException_1.BitGetException; } });
const isThrownException = (exception) => {
    if (exception instanceof exception_1.ConcreteException) {
        return true;
    }
    if ([
        'GrpcUnaryRequestException',
        'HttpRequestException',
        'Web3Exception',
        'GeneralException',
        'LedgerException',
        'LedgerCosmosException',
        'MetamaskException',
        'TrezorException',
        'CosmosWalletException',
        'TransactionException',
        'WalletException',
        'TrustWalletException',
        'OkxWalletException',
        'BitGetException',
    ].includes(exception.constructor.name)) {
        return true;
    }
    return false;
};
exports.isThrownException = isThrownException;
//# sourceMappingURL=index.js.map