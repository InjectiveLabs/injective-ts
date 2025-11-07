"use strict";
// Auto-generated index file
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatilityPb = exports.TimestampPb = exports.DmmPb = exports.InjectiveVolatilityRPCClient = exports.InjectiveDmmV2RPCClient = void 0;
// Export all client classes
var dmm_pb_client_js_1 = require("./generated/dmm_pb.client.js");
Object.defineProperty(exports, "InjectiveDmmV2RPCClient", { enumerable: true, get: function () { return dmm_pb_client_js_1.InjectiveDmmV2RPCClient; } });
var volatility_pb_client_js_1 = require("./generated/volatility_pb.client.js");
Object.defineProperty(exports, "InjectiveVolatilityRPCClient", { enumerable: true, get: function () { return volatility_pb_client_js_1.InjectiveVolatilityRPCClient; } });
// Export all types as namespaces for easy import
exports.DmmPb = __importStar(require("./generated/dmm_pb.js"));
exports.TimestampPb = __importStar(require("./generated/google/protobuf/timestamp_pb.js"));
exports.VolatilityPb = __importStar(require("./generated/volatility_pb.js"));
