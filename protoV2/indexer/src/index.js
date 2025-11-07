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
exports.InjectiveTradingRpcPb = exports.InjectiveSpotExchangeRpcPb = exports.InjectiveReferralRpcPb = exports.InjectivePortfolioRpcPb = exports.InjectiveOracleRpcPb = exports.InjectiveMetaRpcPb = exports.InjectiveMegavaultRpcPb = exports.InjectiveInsuranceRpcPb = exports.InjectiveExplorerRpcPb = exports.InjectiveExchangeRpcPb = exports.InjectiveDerivativeExchangeRpcPb = exports.InjectiveChartRpcPb = exports.InjectiveCampaignRpcPb = exports.InjectiveAuctionRpcPb = exports.InjectiveArchiverRpcPb = exports.InjectiveAccountsRpcPb = exports.HealthPb = exports.EventProviderApiPb = exports.InjectiveTradingRPCClient = exports.InjectiveSpotExchangeRPCClient = exports.InjectiveReferralRPCClient = exports.InjectivePortfolioRPCClient = exports.InjectiveOracleRPCClient = exports.InjectiveMetaRPCClient = exports.InjectiveMegavaultRPCClient = exports.InjectiveInsuranceRPCClient = exports.InjectiveExplorerRPCClient = exports.InjectiveExchangeRPCClient = exports.InjectiveDerivativeExchangeRPCClient = exports.InjectiveChartRPCClient = exports.InjectiveCampaignRPCClient = exports.InjectiveAuctionRPCClient = exports.InjectiveArchiverRPCClient = exports.InjectiveAccountsRPCClient = exports.HealthClient = exports.EventProviderAPIClient = void 0;
// Export all client classes
var event_provider_api_pb_client_js_1 = require("./generated/event_provider_api_pb.client.js");
Object.defineProperty(exports, "EventProviderAPIClient", { enumerable: true, get: function () { return event_provider_api_pb_client_js_1.EventProviderAPIClient; } });
var health_pb_client_js_1 = require("./generated/health_pb.client.js");
Object.defineProperty(exports, "HealthClient", { enumerable: true, get: function () { return health_pb_client_js_1.HealthClient; } });
var injective_accounts_rpc_pb_client_js_1 = require("./generated/injective_accounts_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveAccountsRPCClient", { enumerable: true, get: function () { return injective_accounts_rpc_pb_client_js_1.InjectiveAccountsRPCClient; } });
var injective_archiver_rpc_pb_client_js_1 = require("./generated/injective_archiver_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveArchiverRPCClient", { enumerable: true, get: function () { return injective_archiver_rpc_pb_client_js_1.InjectiveArchiverRPCClient; } });
var injective_auction_rpc_pb_client_js_1 = require("./generated/injective_auction_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveAuctionRPCClient", { enumerable: true, get: function () { return injective_auction_rpc_pb_client_js_1.InjectiveAuctionRPCClient; } });
var injective_campaign_rpc_pb_client_js_1 = require("./generated/injective_campaign_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveCampaignRPCClient", { enumerable: true, get: function () { return injective_campaign_rpc_pb_client_js_1.InjectiveCampaignRPCClient; } });
var injective_chart_rpc_pb_client_js_1 = require("./generated/injective_chart_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveChartRPCClient", { enumerable: true, get: function () { return injective_chart_rpc_pb_client_js_1.InjectiveChartRPCClient; } });
var injective_derivative_exchange_rpc_pb_client_js_1 = require("./generated/injective_derivative_exchange_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveDerivativeExchangeRPCClient", { enumerable: true, get: function () { return injective_derivative_exchange_rpc_pb_client_js_1.InjectiveDerivativeExchangeRPCClient; } });
var injective_exchange_rpc_pb_client_js_1 = require("./generated/injective_exchange_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveExchangeRPCClient", { enumerable: true, get: function () { return injective_exchange_rpc_pb_client_js_1.InjectiveExchangeRPCClient; } });
var injective_explorer_rpc_pb_client_js_1 = require("./generated/injective_explorer_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveExplorerRPCClient", { enumerable: true, get: function () { return injective_explorer_rpc_pb_client_js_1.InjectiveExplorerRPCClient; } });
var injective_insurance_rpc_pb_client_js_1 = require("./generated/injective_insurance_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveInsuranceRPCClient", { enumerable: true, get: function () { return injective_insurance_rpc_pb_client_js_1.InjectiveInsuranceRPCClient; } });
var injective_megavault_rpc_pb_client_js_1 = require("./generated/injective_megavault_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveMegavaultRPCClient", { enumerable: true, get: function () { return injective_megavault_rpc_pb_client_js_1.InjectiveMegavaultRPCClient; } });
var injective_meta_rpc_pb_client_js_1 = require("./generated/injective_meta_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveMetaRPCClient", { enumerable: true, get: function () { return injective_meta_rpc_pb_client_js_1.InjectiveMetaRPCClient; } });
var injective_oracle_rpc_pb_client_js_1 = require("./generated/injective_oracle_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveOracleRPCClient", { enumerable: true, get: function () { return injective_oracle_rpc_pb_client_js_1.InjectiveOracleRPCClient; } });
var injective_portfolio_rpc_pb_client_js_1 = require("./generated/injective_portfolio_rpc_pb.client.js");
Object.defineProperty(exports, "InjectivePortfolioRPCClient", { enumerable: true, get: function () { return injective_portfolio_rpc_pb_client_js_1.InjectivePortfolioRPCClient; } });
var injective_referral_rpc_pb_client_js_1 = require("./generated/injective_referral_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveReferralRPCClient", { enumerable: true, get: function () { return injective_referral_rpc_pb_client_js_1.InjectiveReferralRPCClient; } });
var injective_spot_exchange_rpc_pb_client_js_1 = require("./generated/injective_spot_exchange_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveSpotExchangeRPCClient", { enumerable: true, get: function () { return injective_spot_exchange_rpc_pb_client_js_1.InjectiveSpotExchangeRPCClient; } });
var injective_trading_rpc_pb_client_js_1 = require("./generated/injective_trading_rpc_pb.client.js");
Object.defineProperty(exports, "InjectiveTradingRPCClient", { enumerable: true, get: function () { return injective_trading_rpc_pb_client_js_1.InjectiveTradingRPCClient; } });
// Export all types as namespaces for easy import
exports.EventProviderApiPb = __importStar(require("./generated/event_provider_api_pb.js"));
exports.HealthPb = __importStar(require("./generated/health_pb.js"));
exports.InjectiveAccountsRpcPb = __importStar(require("./generated/injective_accounts_rpc_pb.js"));
exports.InjectiveArchiverRpcPb = __importStar(require("./generated/injective_archiver_rpc_pb.js"));
exports.InjectiveAuctionRpcPb = __importStar(require("./generated/injective_auction_rpc_pb.js"));
exports.InjectiveCampaignRpcPb = __importStar(require("./generated/injective_campaign_rpc_pb.js"));
exports.InjectiveChartRpcPb = __importStar(require("./generated/injective_chart_rpc_pb.js"));
exports.InjectiveDerivativeExchangeRpcPb = __importStar(require("./generated/injective_derivative_exchange_rpc_pb.js"));
exports.InjectiveExchangeRpcPb = __importStar(require("./generated/injective_exchange_rpc_pb.js"));
exports.InjectiveExplorerRpcPb = __importStar(require("./generated/injective_explorer_rpc_pb.js"));
exports.InjectiveInsuranceRpcPb = __importStar(require("./generated/injective_insurance_rpc_pb.js"));
exports.InjectiveMegavaultRpcPb = __importStar(require("./generated/injective_megavault_rpc_pb.js"));
exports.InjectiveMetaRpcPb = __importStar(require("./generated/injective_meta_rpc_pb.js"));
exports.InjectiveOracleRpcPb = __importStar(require("./generated/injective_oracle_rpc_pb.js"));
exports.InjectivePortfolioRpcPb = __importStar(require("./generated/injective_portfolio_rpc_pb.js"));
exports.InjectiveReferralRpcPb = __importStar(require("./generated/injective_referral_rpc_pb.js"));
exports.InjectiveSpotExchangeRpcPb = __importStar(require("./generated/injective_spot_exchange_rpc_pb.js"));
exports.InjectiveTradingRpcPb = __importStar(require("./generated/injective_trading_rpc_pb.js"));
