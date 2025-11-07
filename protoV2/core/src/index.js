"use strict";
// PB Types
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
exports.InjectiveExchangeV2QueryClient = exports.InjectiveExchangeV2MsgClient = exports.InjectiveExchangeV2TxPb = exports.InjectiveExchangeV2QueryPb = exports.InjectiveExchangeV2ProposalPb = exports.InjectiveExchangeV2OrderbookPb = exports.InjectiveExchangeV2OrderPb = exports.InjectiveExchangeV2MarketPb = exports.InjectiveExchangeV2GenesisPb = exports.InjectiveExchangeV2ExchangePb = exports.InjectiveExchangeV2EventsPb = exports.InjectiveExchangeV2AuthzPb = exports.InjectiveExchangeV1Beta1QueryClient = exports.InjectiveExchangeV1Beta1MsgClient = exports.InjectiveExchangeV1Beta1TxPb = exports.InjectiveExchangeV1Beta1QueryPb = exports.InjectiveExchangeV1Beta1ProposalPb = exports.InjectiveExchangeV1Beta1GenesisPb = exports.InjectiveExchangeV1Beta1ExchangePb = exports.InjectiveExchangeV1Beta1EventsPb = exports.InjectiveExchangeV1Beta1AuthzPb = exports.InjectiveEvmV1QueryClient = exports.InjectiveEvmV1MsgClient = exports.InjectiveEvmV1TxPb = exports.InjectiveEvmV1TxResultPb = exports.InjectiveEvmV1TransactionLogsPb = exports.InjectiveEvmV1TraceConfigPb = exports.InjectiveEvmV1StatePb = exports.InjectiveEvmV1QueryPb = exports.InjectiveEvmV1ParamsPb = exports.InjectiveEvmV1LogPb = exports.InjectiveEvmV1GenesisPb = exports.InjectiveEvmV1ChainEventsPb = exports.InjectiveEvmV1ChainConfigPb = exports.InjectiveEvmV1AccessTuplePb = exports.InjectiveErc20V1Beta1QueryClient = exports.InjectiveErc20V1Beta1MsgClient = exports.InjectiveErc20V1Beta1TxPb = exports.InjectiveErc20V1Beta1QueryPb = exports.InjectiveErc20V1Beta1ParamsPb = exports.InjectiveErc20V1Beta1GenesisPb = exports.InjectiveErc20V1Beta1EventsPb = exports.InjectiveErc20V1Beta1Erc20Pb = exports.InjectiveCryptoV1Beta1Ethsecp256k1KeysPb = exports.InjectiveAuctionV1Beta1QueryClient = exports.InjectiveAuctionV1Beta1MsgClient = exports.InjectiveAuctionV1Beta1TxPb = exports.InjectiveAuctionV1Beta1QueryPb = exports.InjectiveAuctionV1Beta1GenesisPb = exports.InjectiveAuctionV1Beta1AuctionPb = void 0;
exports.InjectiveTokenFactoryV1Beta1QueryPb = exports.InjectiveTokenFactoryV1Beta1ParamsPb = exports.InjectiveTokenFactoryV1Beta1GenesisPb = exports.InjectiveTokenFactoryV1Beta1EventsPb = exports.InjectiveTokenFactoryV1Beta1AuthorityMetadataPb = exports.InjectiveStreamV2QueryClient = exports.InjectiveStreamV2QueryPb = exports.InjectiveStreamV1Beta1QueryClient = exports.InjectiveStreamV1Beta1QueryPb = exports.InjectivePermissionsV1Beta1QueryClient = exports.InjectivePermissionsV1Beta1MsgClient = exports.InjectivePermissionsV1Beta1TxPb = exports.InjectivePermissionsV1Beta1QueryPb = exports.InjectivePermissionsV1Beta1PermissionsPb = exports.InjectivePermissionsV1Beta1ParamsPb = exports.InjectivePermissionsV1Beta1GenesisPb = exports.InjectivePermissionsV1Beta1EventsPb = exports.InjectivePeggyV1QueryClient = exports.InjectivePeggyV1MsgClient = exports.InjectivePeggyV1TypesPb = exports.InjectivePeggyV1QueryPb = exports.InjectivePeggyV1PoolPb = exports.InjectivePeggyV1ParamsPb = exports.InjectivePeggyV1MsgsPb = exports.InjectivePeggyV1GenesisPb = exports.InjectivePeggyV1EventsPb = exports.InjectivePeggyV1EthereumSignerPb = exports.InjectivePeggyV1BatchPb = exports.InjectivePeggyV1AttestationPb = exports.InjectiveOracleV1Beta1QueryClient = exports.InjectiveOracleV1Beta1MsgClient = exports.InjectiveOracleV1Beta1TxPb = exports.InjectiveOracleV1Beta1QueryPb = exports.InjectiveOracleV1Beta1ProposalPb = exports.InjectiveOracleV1Beta1OraclePb = exports.InjectiveOracleV1Beta1GenesisPb = exports.InjectiveOracleV1Beta1EventsPb = exports.InjectiveOcrV1Beta1QueryClient = exports.InjectiveOcrV1Beta1MsgClient = exports.InjectiveOcrV1Beta1TxPb = exports.InjectiveOcrV1Beta1QueryPb = exports.InjectiveOcrV1Beta1OcrPb = exports.InjectiveOcrV1Beta1GenesisPb = exports.InjectiveInsuranceV1Beta1QueryClient = exports.InjectiveInsuranceV1Beta1MsgClient = exports.InjectiveInsuranceV1Beta1TxPb = exports.InjectiveInsuranceV1Beta1QueryPb = exports.InjectiveInsuranceV1Beta1InsurancePb = exports.InjectiveInsuranceV1Beta1GenesisPb = exports.InjectiveInsuranceV1Beta1EventsPb = void 0;
exports.CosmosBaseV1Beta1CoinPb = exports.CosmosBaseTendermintV1Beta1QueryPb = exports.CosmosBaseStoreV1Beta1ListeningPb = exports.CosmosBaseStoreV1Beta1CommitInfoPb = exports.CosmosBaseSnapshotsV1Beta1SnapshotPb = exports.CosmosBaseReflectionV2Alpha1ReflectionPb = exports.CosmosBaseReflectionV1Beta1ReflectionPb = exports.CosmosBaseQueryV1Beta1PaginationPb = exports.CosmosBaseKvV1Beta1KvPb = exports.CosmosBaseAbciV1Beta1AbciPb = exports.CosmosBankV1BetaMsgClient = exports.CosmosBankV1BetaQueryClient = exports.CosmosBankV1Beta1TxPb = exports.CosmosBankV1Beta1QueryPb = exports.CosmosBankV1Beta1GenesisPb = exports.CosmosBankV1Beta1BankPb = exports.CosmosAuthzV1BetaMsgClient = exports.CosmosAuthzV1BetaQueryClient = exports.CosmosAuthzV1Beta1TxPb = exports.CosmosAuthzV1Beta1QueryPb = exports.CosmosAuthzV1Beta1GenesisPb = exports.CosmosAuthzV1Beta1EventPb = exports.CosmosAuthzV1Beta1AuthzPb = exports.CosmosAuthV1BetaQueryClient = exports.CosmosAuthV1BetaMsgClient = exports.CosmosAuthV1Beta1QueryPb = exports.CosmosAuthV1Beta1GenesisPb = exports.CosmosAuthV1Beta1AuthPb = exports.InjectiveWasmV1QueryClient = exports.InjectiveWasmV1MsgClient = exports.InjectiveWasmxV1WasmxPb = exports.InjectiveWasmxV1TxPb = exports.InjectiveWasmxV1QueryPb = exports.InjectiveWasmxV1ProposalPb = exports.InjectiveWasmxV1GenesisPb = exports.InjectiveWasmxV1EventsPb = exports.InjectiveWasmxV1AuthzPb = exports.InjectiveTypesV1TxResponsePb = exports.InjectiveTypesV1Beta1TxExtPb = exports.InjectiveTypesV1Beta1IndexerPb = exports.InjectiveTypesV1Beta1AccountPb = exports.InjectiveTxFeesV1Beta1QueryClient = exports.InjectiveTxFeesV1Beta1MsgClient = exports.InjectiveTxFeesV1Beta1TxfeesPb = exports.InjectiveTxFeesV1Beta1TxPb = exports.InjectiveTxFeesV1Beta1QueryPb = exports.InjectiveTxFeesV1Beta1GenesisPb = exports.InjectiveTokenFactoryV1Beta1QueryClient = exports.InjectiveTokenFactoryV1Beta1MsgClient = exports.InjectiveTokenFactoryV1Beta1TxPb = void 0;
exports.CosmwasmWasmV1GenesisPb = exports.CosmwasmWasmV1AuthzPb = exports.CosmosVestingV1Beta1VestingPb = exports.CosmosVestingV1Beta1TxPb = exports.CosmosUpgradeV1Beta1UpgradePb = exports.CosmosUpgradeV1Beta1QueryPb = exports.CosmosTxV1Beta1TxPb = exports.CosmosTxV1Beta1ServicePb = exports.CosmosTxSigningV1Beta1SigningPb = exports.CosmosStakingV1Beta1TxPb = exports.CosmosStakingV1Beta1StakingPb = exports.CosmosStakingV1Beta1QueryPb = exports.CosmosStakingV1Beta1GenesisPb = exports.CosmosStakingV1Beta1AuthzPb = exports.CosmosSlashingV1Beta1TxPb = exports.CosmosSlashingV1Beta1SlashingPb = exports.CosmosSlashingV1Beta1QueryPb = exports.CosmosSlashingV1Beta1GenesisPb = exports.CosmosParamsV1Beta1QueryPb = exports.CosmosParamsV1Beta1ParamsPb = exports.CosmosMintV1Beta1QueryPb = exports.CosmosMintV1Beta1MintPb = exports.CosmosMintV1Beta1GenesisPb = exports.CosmosGovV1TxPb = exports.CosmosGovV1QueryPb = exports.CosmosGovV1GenesisPb = exports.CosmosGovV1GovPb = exports.CosmosGovV1Beta1TxPb = exports.CosmosGovV1Beta1QueryPb = exports.CosmosGovV1Beta1GenesisPb = exports.CosmosGovV1Beta1GovPb = exports.CosmosGenutilV1Beta1GenesisPb = exports.CosmosFeegrantV1Beta1TxPb = exports.CosmosFeegrantV1Beta1QueryPb = exports.CosmosFeegrantV1Beta1GenesisPb = exports.CosmosFeegrantV1Beta1FeegrantPb = exports.CosmosEvidenceV1Beta1TxPb = exports.CosmosEvidenceV1Beta1QueryPb = exports.CosmosEvidenceV1Beta1GenesisPb = exports.CosmosEvidenceV1Beta1EvidencePb = exports.CosmosDistributionV1Beta1TxPb = exports.CosmosDistributionV1Beta1QueryPb = exports.CosmosDistributionV1Beta1GenesisPb = exports.CosmosDistributionV1Beta1DistributionPb = exports.CosmosCryptoSecp256r1KeysPb = exports.CosmosCryptoSecp256k1KeysPb = exports.CosmosCryptoV1Beta1MultisigPb = exports.CosmosCryptoMultisigKeysPb = exports.CosmosCryptoEd255519KeysPb = exports.CosmosCrisisV1Beta1GenesisPb = void 0;
exports.ConfioProofsPb = exports.CometVersionV1TypesPb = exports.CometTypesV1ValidatorPb = exports.CometTypesV1TypesPb = exports.CometTypesV1ParamsPb = exports.CometTypesV1EvidencePb = exports.CometTypesV1BlockPb = exports.CometP2PV1TypesPb = exports.CometP2PV1ConnPb = exports.CometCryptoV1ProofPb = exports.CometCryptoV1KeysPb = exports.CometAbciV1TypesPb = exports.IbcLightcientsTendermintV1TendermintPb = exports.IbcLightcientsSolomachineV2SolomachinePb = exports.IbcCoreTypesV1GenesisPb = exports.IbcCoreConnectionV1TxPb = exports.IbcCoreConnectionV1QueryPb = exports.IbcCoreConnectionV1GenesisPb = exports.IbcCoreConnectionV1ConnectionPb = exports.IbcCoreCommitmentV1CommitmentPb = exports.IbcCoreClientV1TxPb = exports.IbcCoreClientV1QueryPb = exports.IbcCoreClientV1GenesisPb = exports.IbcCoreClientV1ClientPb = exports.IbcCoreChannelV1TxPb = exports.IbcCoreChannelV1QueryPb = exports.IbcCoreChannelV1GenesisPb = exports.IbcCoreChannelV1ChannelPb = exports.IbcApplicationsTransferV1TxPb = exports.IbcApplicationsTransferV1TransferPb = exports.IbcApplicationsTransferV1QueryPb = exports.GoogleProtobufTimestampPb = exports.GoogleProtobufDurationPb = exports.GoogleProtobufDescriptorPb = exports.GoogleProtobufAnyPb = exports.GoogleApiHttpPb = exports.CosmwasmWasmV1TypesPb = exports.CosmwasmWasmV1TxPb = exports.CosmwasmWasmV1QueryPb = exports.CosmwasmWasmV1ProposalLegacyPb = exports.CosmwasmWasmV1IbcPb = void 0;
// auction v1beta1
exports.InjectiveAuctionV1Beta1AuctionPb = __importStar(require("./generated/injective/auction/v1beta1/auction_pb.js"));
exports.InjectiveAuctionV1Beta1GenesisPb = __importStar(require("./generated/injective/auction/v1beta1/genesis_pb.js"));
exports.InjectiveAuctionV1Beta1QueryPb = __importStar(require("./generated/injective/auction/v1beta1/query_pb.js"));
exports.InjectiveAuctionV1Beta1TxPb = __importStar(require("./generated/injective/auction/v1beta1/tx_pb.js"));
// Auction clients
var tx_pb_client_js_1 = require("./generated/injective/auction/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveAuctionV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_1.MsgClient; } });
var query_pb_client_js_1 = require("./generated/injective/auction/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveAuctionV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_1.QueryClient; } });
// crypto v1beta1
exports.InjectiveCryptoV1Beta1Ethsecp256k1KeysPb = __importStar(require("./generated/injective/crypto/v1beta1/ethsecp256k1/keys_pb.js"));
// erc20 v1beta1
exports.InjectiveErc20V1Beta1Erc20Pb = __importStar(require("./generated/injective/erc20/v1beta1/erc20_pb.js"));
exports.InjectiveErc20V1Beta1EventsPb = __importStar(require("./generated/injective/erc20/v1beta1/events_pb.js"));
exports.InjectiveErc20V1Beta1GenesisPb = __importStar(require("./generated/injective/erc20/v1beta1/genesis_pb.js"));
exports.InjectiveErc20V1Beta1ParamsPb = __importStar(require("./generated/injective/erc20/v1beta1/params_pb.js"));
exports.InjectiveErc20V1Beta1QueryPb = __importStar(require("./generated/injective/erc20/v1beta1/query_pb.js"));
exports.InjectiveErc20V1Beta1TxPb = __importStar(require("./generated/injective/erc20/v1beta1/tx_pb.js"));
// Erc20 clients
var tx_pb_client_js_2 = require("./generated/injective/erc20/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveErc20V1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_2.MsgClient; } });
var query_pb_client_js_2 = require("./generated/injective/erc20/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveErc20V1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_2.QueryClient; } });
// evm v1
exports.InjectiveEvmV1AccessTuplePb = __importStar(require("./generated/injective/evm/v1/access_tuple_pb.js"));
exports.InjectiveEvmV1ChainConfigPb = __importStar(require("./generated/injective/evm/v1/chain_config_pb.js"));
exports.InjectiveEvmV1ChainEventsPb = __importStar(require("./generated/injective/evm/v1/events_pb.js"));
exports.InjectiveEvmV1GenesisPb = __importStar(require("./generated/injective/evm/v1/genesis_pb.js"));
exports.InjectiveEvmV1LogPb = __importStar(require("./generated/injective/evm/v1/log_pb.js"));
exports.InjectiveEvmV1ParamsPb = __importStar(require("./generated/injective/evm/v1/params_pb.js"));
exports.InjectiveEvmV1QueryPb = __importStar(require("./generated/injective/evm/v1/query_pb.js"));
exports.InjectiveEvmV1StatePb = __importStar(require("./generated/injective/evm/v1/state_pb.js"));
exports.InjectiveEvmV1TraceConfigPb = __importStar(require("./generated/injective/evm/v1/trace_config_pb.js"));
exports.InjectiveEvmV1TransactionLogsPb = __importStar(require("./generated/injective/evm/v1/transaction_logs_pb.js"));
exports.InjectiveEvmV1TxResultPb = __importStar(require("./generated/injective/evm/v1/tx_result_pb.js"));
exports.InjectiveEvmV1TxPb = __importStar(require("./generated/injective/evm/v1/tx_pb.js"));
// Evm clients
var tx_pb_client_js_3 = require("./generated/injective/evm/v1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveEvmV1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_3.MsgClient; } });
var query_pb_client_js_3 = require("./generated/injective/evm/v1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveEvmV1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_3.QueryClient; } });
// exchange v1beta1
exports.InjectiveExchangeV1Beta1AuthzPb = __importStar(require("./generated/injective/exchange/v1beta1/authz_pb.js"));
exports.InjectiveExchangeV1Beta1EventsPb = __importStar(require("./generated/injective/exchange/v1beta1/events_pb.js"));
exports.InjectiveExchangeV1Beta1ExchangePb = __importStar(require("./generated/injective/exchange/v1beta1/exchange_pb.js"));
exports.InjectiveExchangeV1Beta1GenesisPb = __importStar(require("./generated/injective/exchange/v1beta1/genesis_pb.js"));
exports.InjectiveExchangeV1Beta1ProposalPb = __importStar(require("./generated/injective/exchange/v1beta1/proposal_pb.js"));
exports.InjectiveExchangeV1Beta1QueryPb = __importStar(require("./generated/injective/exchange/v1beta1/query_pb.js"));
exports.InjectiveExchangeV1Beta1TxPb = __importStar(require("./generated/injective/exchange/v1beta1/tx_pb.js"));
// exchange v1beta1 clients
var tx_pb_client_js_4 = require("./generated/injective/exchange/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveExchangeV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_4.MsgClient; } });
var query_pb_client_js_4 = require("./generated/injective/exchange/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveExchangeV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_4.QueryClient; } });
// exchange v2
exports.InjectiveExchangeV2AuthzPb = __importStar(require("./generated/injective/exchange/v2/authz_pb.js"));
exports.InjectiveExchangeV2EventsPb = __importStar(require("./generated/injective/exchange/v2/events_pb.js"));
exports.InjectiveExchangeV2ExchangePb = __importStar(require("./generated/injective/exchange/v2/exchange_pb.js"));
exports.InjectiveExchangeV2GenesisPb = __importStar(require("./generated/injective/exchange/v2/genesis_pb.js"));
exports.InjectiveExchangeV2MarketPb = __importStar(require("./generated/injective/exchange/v2/market_pb.js"));
exports.InjectiveExchangeV2OrderPb = __importStar(require("./generated/injective/exchange/v2/order_pb.js"));
exports.InjectiveExchangeV2OrderbookPb = __importStar(require("./generated/injective/exchange/v2/orderbook_pb.js"));
exports.InjectiveExchangeV2ProposalPb = __importStar(require("./generated/injective/exchange/v2/proposal_pb.js"));
exports.InjectiveExchangeV2QueryPb = __importStar(require("./generated/injective/exchange/v2/query_pb.js"));
exports.InjectiveExchangeV2TxPb = __importStar(require("./generated/injective/exchange/v2/tx_pb.js"));
// exchange v2 clients
var tx_pb_client_js_5 = require("./generated/injective/exchange/v2/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveExchangeV2MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_5.MsgClient; } });
var query_pb_client_js_5 = require("./generated/injective/exchange/v2/query_pb.client.js");
Object.defineProperty(exports, "InjectiveExchangeV2QueryClient", { enumerable: true, get: function () { return query_pb_client_js_5.QueryClient; } });
// insurance v1beta1
exports.InjectiveInsuranceV1Beta1EventsPb = __importStar(require("./generated/injective/insurance/v1beta1/events_pb.js"));
exports.InjectiveInsuranceV1Beta1GenesisPb = __importStar(require("./generated/injective/insurance/v1beta1/genesis_pb.js"));
exports.InjectiveInsuranceV1Beta1InsurancePb = __importStar(require("./generated/injective/insurance/v1beta1/insurance_pb.js"));
exports.InjectiveInsuranceV1Beta1QueryPb = __importStar(require("./generated/injective/insurance/v1beta1/query_pb.js"));
exports.InjectiveInsuranceV1Beta1TxPb = __importStar(require("./generated/injective/insurance/v1beta1/tx_pb.js"));
// insurance v1beta1 clients
var tx_pb_client_js_6 = require("./generated/injective/insurance/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveInsuranceV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_6.MsgClient; } });
var query_pb_client_js_6 = require("./generated/injective/insurance/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveInsuranceV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_6.QueryClient; } });
// ocr v1beta1
exports.InjectiveOcrV1Beta1GenesisPb = __importStar(require("./generated/injective/ocr/v1beta1/genesis_pb.js"));
exports.InjectiveOcrV1Beta1OcrPb = __importStar(require("./generated/injective/ocr/v1beta1/ocr_pb.js"));
exports.InjectiveOcrV1Beta1QueryPb = __importStar(require("./generated/injective/ocr/v1beta1/query_pb.js"));
exports.InjectiveOcrV1Beta1TxPb = __importStar(require("./generated/injective/ocr/v1beta1/tx_pb.js"));
// ocr v1beta1 clients
var tx_pb_client_js_7 = require("./generated/injective/ocr/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveOcrV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_7.MsgClient; } });
var query_pb_client_js_7 = require("./generated/injective/ocr/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveOcrV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_7.QueryClient; } });
// oracle v1beta1
exports.InjectiveOracleV1Beta1EventsPb = __importStar(require("./generated/injective/oracle/v1beta1/events_pb.js"));
exports.InjectiveOracleV1Beta1GenesisPb = __importStar(require("./generated/injective/oracle/v1beta1/genesis_pb.js"));
exports.InjectiveOracleV1Beta1OraclePb = __importStar(require("./generated/injective/oracle/v1beta1/oracle_pb.js"));
exports.InjectiveOracleV1Beta1ProposalPb = __importStar(require("./generated/injective/oracle/v1beta1/proposal_pb.js"));
exports.InjectiveOracleV1Beta1QueryPb = __importStar(require("./generated/injective/oracle/v1beta1/query_pb.js"));
exports.InjectiveOracleV1Beta1TxPb = __importStar(require("./generated/injective/oracle/v1beta1/tx_pb.js"));
// oracle v1beta1 clients
var tx_pb_client_js_8 = require("./generated/injective/oracle/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveOracleV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_8.MsgClient; } });
var query_pb_client_js_8 = require("./generated/injective/oracle/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveOracleV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_8.QueryClient; } });
// peggy v1
exports.InjectivePeggyV1AttestationPb = __importStar(require("./generated/injective/peggy/v1/attestation_pb.js"));
exports.InjectivePeggyV1BatchPb = __importStar(require("./generated/injective/peggy/v1/batch_pb.js"));
exports.InjectivePeggyV1EthereumSignerPb = __importStar(require("./generated/injective/peggy/v1/ethereum_signer_pb.js"));
exports.InjectivePeggyV1EventsPb = __importStar(require("./generated/injective/peggy/v1/events_pb.js"));
exports.InjectivePeggyV1GenesisPb = __importStar(require("./generated/injective/peggy/v1/genesis_pb.js"));
exports.InjectivePeggyV1MsgsPb = __importStar(require("./generated/injective/peggy/v1/msgs_pb.js"));
exports.InjectivePeggyV1ParamsPb = __importStar(require("./generated/injective/peggy/v1/params_pb.js"));
exports.InjectivePeggyV1PoolPb = __importStar(require("./generated/injective/peggy/v1/pool_pb.js"));
exports.InjectivePeggyV1QueryPb = __importStar(require("./generated/injective/peggy/v1/query_pb.js"));
// export * as InjectivePeggyV1RateLimit from "./injective/peggy/v1/rate_limit.js";
exports.InjectivePeggyV1TypesPb = __importStar(require("./generated/injective/peggy/v1/types_pb.js"));
// peggy v1 clients
var msgs_pb_client_js_1 = require("./generated/injective/peggy/v1/msgs_pb.client.js");
Object.defineProperty(exports, "InjectivePeggyV1MsgClient", { enumerable: true, get: function () { return msgs_pb_client_js_1.MsgClient; } });
var query_pb_client_js_9 = require("./generated/injective/peggy/v1/query_pb.client.js");
Object.defineProperty(exports, "InjectivePeggyV1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_9.QueryClient; } });
// permissions v1beta1
exports.InjectivePermissionsV1Beta1EventsPb = __importStar(require("./generated/injective/permissions/v1beta1/events_pb.js"));
exports.InjectivePermissionsV1Beta1GenesisPb = __importStar(require("./generated/injective/permissions/v1beta1/genesis_pb.js"));
exports.InjectivePermissionsV1Beta1ParamsPb = __importStar(require("./generated/injective/permissions/v1beta1/params_pb.js"));
exports.InjectivePermissionsV1Beta1PermissionsPb = __importStar(require("./generated/injective/permissions/v1beta1/permissions_pb.js"));
exports.InjectivePermissionsV1Beta1QueryPb = __importStar(require("./generated/injective/permissions/v1beta1/query_pb.js"));
exports.InjectivePermissionsV1Beta1TxPb = __importStar(require("./generated/injective/permissions/v1beta1/tx_pb.js"));
// permissions v1beta1 clients
var tx_pb_client_js_9 = require("./generated/injective/permissions/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectivePermissionsV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_9.MsgClient; } });
var query_pb_client_js_10 = require("./generated/injective/permissions/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectivePermissionsV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_10.QueryClient; } });
// stream v1beta1
exports.InjectiveStreamV1Beta1QueryPb = __importStar(require("./generated/injective/stream/v1beta1/query_pb.js"));
// stream v1beta1 clients
var query_pb_client_js_11 = require("./generated/injective/stream/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveStreamV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_11.StreamClient; } });
// stream v2
exports.InjectiveStreamV2QueryPb = __importStar(require("./generated/injective/stream/v2/query_pb.js"));
// stream v2 clients
var query_pb_client_js_12 = require("./generated/injective/stream/v2/query_pb.client.js");
Object.defineProperty(exports, "InjectiveStreamV2QueryClient", { enumerable: true, get: function () { return query_pb_client_js_12.StreamClient; } });
// tokenfactory v1beta1
exports.InjectiveTokenFactoryV1Beta1AuthorityMetadataPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/authorityMetadata_pb.js"));
exports.InjectiveTokenFactoryV1Beta1EventsPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/events_pb.js"));
exports.InjectiveTokenFactoryV1Beta1GenesisPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/genesis_pb.js"));
exports.InjectiveTokenFactoryV1Beta1ParamsPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/params_pb.js"));
exports.InjectiveTokenFactoryV1Beta1QueryPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/query_pb.js"));
exports.InjectiveTokenFactoryV1Beta1TxPb = __importStar(require("./generated/injective/tokenfactory/v1beta1/tx_pb.js"));
// tokenfactory v1beta1 clients
var tx_pb_client_js_10 = require("./generated/injective/tokenfactory/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveTokenFactoryV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_10.MsgClient; } });
var query_pb_client_js_13 = require("./generated/injective/tokenfactory/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveTokenFactoryV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_13.QueryClient; } });
// txFees v1beta1
exports.InjectiveTxFeesV1Beta1GenesisPb = __importStar(require("./generated/injective/txfees/v1beta1/genesis_pb.js"));
exports.InjectiveTxFeesV1Beta1QueryPb = __importStar(require("./generated/injective/txfees/v1beta1/query_pb.js"));
exports.InjectiveTxFeesV1Beta1TxPb = __importStar(require("./generated/injective/txfees/v1beta1/tx_pb.js"));
exports.InjectiveTxFeesV1Beta1TxfeesPb = __importStar(require("./generated/injective/txfees/v1beta1/txfees_pb.js"));
// txFees v1beta1 clients
var tx_pb_client_js_11 = require("./generated/injective/txfees/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveTxFeesV1Beta1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_11.MsgClient; } });
var query_pb_client_js_14 = require("./generated/injective/txfees/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveTxFeesV1Beta1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_14.QueryClient; } });
// types v1beta1
exports.InjectiveTypesV1Beta1AccountPb = __importStar(require("./generated/injective/types/v1beta1/account_pb.js"));
exports.InjectiveTypesV1Beta1IndexerPb = __importStar(require("./generated/injective/types/v1beta1/indexer_pb.js"));
exports.InjectiveTypesV1Beta1TxExtPb = __importStar(require("./generated/injective/types/v1beta1/tx_ext_pb.js"));
exports.InjectiveTypesV1TxResponsePb = __importStar(require("./generated/injective/types/v1beta1/tx_response_pb.js"));
// wasmx v1
exports.InjectiveWasmxV1AuthzPb = __importStar(require("./generated/injective/wasmx/v1/authz_pb.js"));
exports.InjectiveWasmxV1EventsPb = __importStar(require("./generated/injective/wasmx/v1/events_pb.js"));
exports.InjectiveWasmxV1GenesisPb = __importStar(require("./generated/injective/wasmx/v1/genesis_pb.js"));
exports.InjectiveWasmxV1ProposalPb = __importStar(require("./generated/injective/wasmx/v1/proposal_pb.js"));
exports.InjectiveWasmxV1QueryPb = __importStar(require("./generated/injective/wasmx/v1/query_pb.js"));
exports.InjectiveWasmxV1TxPb = __importStar(require("./generated/injective/wasmx/v1/tx_pb.js"));
exports.InjectiveWasmxV1WasmxPb = __importStar(require("./generated/injective/wasmx/v1/wasmx_pb.js"));
// WASM clients
var tx_pb_client_js_12 = require("./generated/injective/wasmx/v1/tx_pb.client.js");
Object.defineProperty(exports, "InjectiveWasmV1MsgClient", { enumerable: true, get: function () { return tx_pb_client_js_12.MsgClient; } });
var query_pb_client_js_15 = require("./generated/injective/wasmx/v1/query_pb.client.js");
Object.defineProperty(exports, "InjectiveWasmV1QueryClient", { enumerable: true, get: function () { return query_pb_client_js_15.QueryClient; } });
// cosmos/auth
exports.CosmosAuthV1Beta1AuthPb = __importStar(require("./generated/cosmos/auth/v1beta1/auth_pb.js"));
exports.CosmosAuthV1Beta1GenesisPb = __importStar(require("./generated/cosmos/auth/v1beta1/genesis_pb.js"));
exports.CosmosAuthV1Beta1QueryPb = __importStar(require("./generated/cosmos/auth/v1beta1/query_pb.js"));
var tx_pb_client_js_13 = require("./generated/cosmos/auth/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "CosmosAuthV1BetaMsgClient", { enumerable: true, get: function () { return tx_pb_client_js_13.MsgClient; } });
var query_pb_client_js_16 = require("./generated/cosmos/auth/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "CosmosAuthV1BetaQueryClient", { enumerable: true, get: function () { return query_pb_client_js_16.QueryClient; } });
// cosmos/authz
exports.CosmosAuthzV1Beta1AuthzPb = __importStar(require("./generated/cosmos/authz/v1beta1/authz_pb.js"));
exports.CosmosAuthzV1Beta1EventPb = __importStar(require("./generated/cosmos/authz/v1beta1/event_pb.js"));
exports.CosmosAuthzV1Beta1GenesisPb = __importStar(require("./generated/cosmos/authz/v1beta1/genesis_pb.js"));
exports.CosmosAuthzV1Beta1QueryPb = __importStar(require("./generated/cosmos/authz/v1beta1/query_pb.js"));
exports.CosmosAuthzV1Beta1TxPb = __importStar(require("./generated/cosmos/authz/v1beta1/tx_pb.js"));
var query_pb_client_js_17 = require("./generated/cosmos/authz/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "CosmosAuthzV1BetaQueryClient", { enumerable: true, get: function () { return query_pb_client_js_17.QueryClient; } });
var tx_pb_client_js_14 = require("./generated/cosmos/authz/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "CosmosAuthzV1BetaMsgClient", { enumerable: true, get: function () { return tx_pb_client_js_14.MsgClient; } });
// cosmos/bank
exports.CosmosBankV1Beta1BankPb = __importStar(require("./generated/cosmos/bank/v1beta1/bank_pb.js"));
exports.CosmosBankV1Beta1GenesisPb = __importStar(require("./generated/cosmos/bank/v1beta1/genesis_pb.js"));
exports.CosmosBankV1Beta1QueryPb = __importStar(require("./generated/cosmos/bank/v1beta1/query_pb.js"));
exports.CosmosBankV1Beta1TxPb = __importStar(require("./generated/cosmos/bank/v1beta1/tx_pb"));
var query_pb_client_js_18 = require("./generated/cosmos/bank/v1beta1/query_pb.client.js");
Object.defineProperty(exports, "CosmosBankV1BetaQueryClient", { enumerable: true, get: function () { return query_pb_client_js_18.QueryClient; } });
var tx_pb_client_js_15 = require("./generated/cosmos/bank/v1beta1/tx_pb.client.js");
Object.defineProperty(exports, "CosmosBankV1BetaMsgClient", { enumerable: true, get: function () { return tx_pb_client_js_15.MsgClient; } });
// cosmos/base
exports.CosmosBaseAbciV1Beta1AbciPb = __importStar(require("./generated/cosmos/base/abci/v1beta1/abci_pb.js"));
exports.CosmosBaseKvV1Beta1KvPb = __importStar(require("./generated/cosmos/store/internal/kv/v1beta1/kv_pb.js"));
exports.CosmosBaseQueryV1Beta1PaginationPb = __importStar(require("./generated/cosmos/base/query/v1beta1/pagination_pb.js"));
exports.CosmosBaseReflectionV1Beta1ReflectionPb = __importStar(require("./generated/cosmos/base/reflection/v1beta1/reflection_pb.js"));
exports.CosmosBaseReflectionV2Alpha1ReflectionPb = __importStar(require("./generated/cosmos/base/reflection/v2alpha1/reflection_pb.js"));
exports.CosmosBaseSnapshotsV1Beta1SnapshotPb = __importStar(require("./generated/cosmos/store/snapshots/v1/snapshot_pb.js"));
exports.CosmosBaseStoreV1Beta1CommitInfoPb = __importStar(require("./generated/cosmos/store/v1beta1/commit_info_pb.js"));
exports.CosmosBaseStoreV1Beta1ListeningPb = __importStar(require("./generated/cosmos/store/v1beta1/listening_pb.js"));
exports.CosmosBaseTendermintV1Beta1QueryPb = __importStar(require("./generated/cosmos/base/tendermint/v1beta1/query_pb.js"));
exports.CosmosBaseV1Beta1CoinPb = __importStar(require("./generated/cosmos/base/v1beta1/coin_pb.js"));
// cosmos/crisis
exports.CosmosCrisisV1Beta1GenesisPb = __importStar(require("./generated/cosmos/crisis/v1beta1/genesis_pb.js"));
// cosmos/crypto
exports.CosmosCryptoEd255519KeysPb = __importStar(require("./generated/cosmos/crypto/ed25519/keys_pb.js"));
exports.CosmosCryptoMultisigKeysPb = __importStar(require("./generated/cosmos/crypto/multisig/keys_pb.js"));
exports.CosmosCryptoV1Beta1MultisigPb = __importStar(require("./generated/cosmos/crypto/multisig/v1beta1/multisig_pb.js"));
exports.CosmosCryptoSecp256k1KeysPb = __importStar(require("./generated/cosmos/crypto/secp256k1/keys_pb.js"));
exports.CosmosCryptoSecp256r1KeysPb = __importStar(require("./generated/cosmos/crypto/secp256r1/keys_pb.js"));
// cosmos/distribution
exports.CosmosDistributionV1Beta1DistributionPb = __importStar(require("./generated/cosmos/distribution/v1beta1/distribution_pb.js"));
exports.CosmosDistributionV1Beta1GenesisPb = __importStar(require("./generated/cosmos/distribution/v1beta1/genesis_pb.js"));
exports.CosmosDistributionV1Beta1QueryPb = __importStar(require("./generated/cosmos/distribution/v1beta1/query_pb.js"));
exports.CosmosDistributionV1Beta1TxPb = __importStar(require("./generated/cosmos/distribution/v1beta1/tx_pb.js"));
// cosmos/evidence
exports.CosmosEvidenceV1Beta1EvidencePb = __importStar(require("./generated/cosmos/evidence/v1beta1/evidence_pb.js"));
exports.CosmosEvidenceV1Beta1GenesisPb = __importStar(require("./generated/cosmos/evidence/v1beta1/genesis_pb.js"));
exports.CosmosEvidenceV1Beta1QueryPb = __importStar(require("./generated/cosmos/evidence/v1beta1/query_pb.js"));
exports.CosmosEvidenceV1Beta1TxPb = __importStar(require("./generated/cosmos/evidence/v1beta1/tx_pb.js"));
// cosmos/feegrant
exports.CosmosFeegrantV1Beta1FeegrantPb = __importStar(require("./generated/cosmos/feegrant/v1beta1/feegrant_pb.js"));
exports.CosmosFeegrantV1Beta1GenesisPb = __importStar(require("./generated/cosmos/feegrant/v1beta1/genesis_pb.js"));
exports.CosmosFeegrantV1Beta1QueryPb = __importStar(require("./generated/cosmos/feegrant/v1beta1/query_pb.js"));
exports.CosmosFeegrantV1Beta1TxPb = __importStar(require("./generated/cosmos/feegrant/v1beta1/tx_pb.js"));
// cosmos/genutil
exports.CosmosGenutilV1Beta1GenesisPb = __importStar(require("./generated/cosmos/genutil/v1beta1/genesis_pb.js"));
// cosmos/gov
exports.CosmosGovV1Beta1GovPb = __importStar(require("./generated/cosmos/gov/v1beta1/gov_pb.js"));
exports.CosmosGovV1Beta1GenesisPb = __importStar(require("./generated/cosmos/gov/v1beta1/genesis_pb.js"));
exports.CosmosGovV1Beta1QueryPb = __importStar(require("./generated/cosmos/gov/v1beta1/query_pb.js"));
exports.CosmosGovV1Beta1TxPb = __importStar(require("./generated/cosmos/gov/v1beta1/tx_pb.js"));
exports.CosmosGovV1GovPb = __importStar(require("./generated/cosmos/gov/v1/gov_pb.js"));
exports.CosmosGovV1GenesisPb = __importStar(require("./generated/cosmos/gov/v1/genesis_pb.js"));
exports.CosmosGovV1QueryPb = __importStar(require("./generated/cosmos/gov/v1/query_pb.js"));
exports.CosmosGovV1TxPb = __importStar(require("./generated/cosmos/gov/v1/tx_pb.js"));
// cosmos/mint
exports.CosmosMintV1Beta1GenesisPb = __importStar(require("./generated/cosmos/mint/v1beta1/genesis_pb.js"));
exports.CosmosMintV1Beta1MintPb = __importStar(require("./generated/cosmos/mint/v1beta1/mint_pb.js"));
exports.CosmosMintV1Beta1QueryPb = __importStar(require("./generated/cosmos/mint/v1beta1/query_pb.js"));
// cosmos/params
exports.CosmosParamsV1Beta1ParamsPb = __importStar(require("./generated/cosmos/params/v1beta1/params_pb.js"));
exports.CosmosParamsV1Beta1QueryPb = __importStar(require("./generated/cosmos/params/v1beta1/query_pb.js"));
// cosmos/slashing
exports.CosmosSlashingV1Beta1GenesisPb = __importStar(require("./generated/cosmos/slashing/v1beta1/genesis_pb.js"));
exports.CosmosSlashingV1Beta1QueryPb = __importStar(require("./generated/cosmos/slashing/v1beta1/query_pb.js"));
exports.CosmosSlashingV1Beta1SlashingPb = __importStar(require("./generated/cosmos/slashing/v1beta1/slashing_pb.js"));
exports.CosmosSlashingV1Beta1TxPb = __importStar(require("./generated/cosmos/slashing/v1beta1/tx_pb.js"));
// cosmos/staking
exports.CosmosStakingV1Beta1AuthzPb = __importStar(require("./generated/cosmos/staking/v1beta1/authz_pb.js"));
exports.CosmosStakingV1Beta1GenesisPb = __importStar(require("./generated/cosmos/staking/v1beta1/genesis_pb.js"));
exports.CosmosStakingV1Beta1QueryPb = __importStar(require("./generated/cosmos/staking/v1beta1/query_pb.js"));
exports.CosmosStakingV1Beta1StakingPb = __importStar(require("./generated/cosmos/staking/v1beta1/staking_pb.js"));
exports.CosmosStakingV1Beta1TxPb = __importStar(require("./generated/cosmos/staking/v1beta1/tx_pb.js"));
// cosmos/tx
exports.CosmosTxSigningV1Beta1SigningPb = __importStar(require("./generated/cosmos/tx/signing/v1beta1/signing_pb.js"));
exports.CosmosTxV1Beta1ServicePb = __importStar(require("./generated/cosmos/tx/v1beta1/service_pb.js"));
exports.CosmosTxV1Beta1TxPb = __importStar(require("./generated/cosmos/tx/v1beta1/tx_pb.js"));
// cosmos/upgrade
exports.CosmosUpgradeV1Beta1QueryPb = __importStar(require("./generated/cosmos/upgrade/v1beta1/query_pb.js"));
exports.CosmosUpgradeV1Beta1UpgradePb = __importStar(require("./generated/cosmos/upgrade/v1beta1/upgrade_pb.js"));
// cosmos/vesting
exports.CosmosVestingV1Beta1TxPb = __importStar(require("./generated/cosmos/vesting/v1beta1/tx_pb.js"));
exports.CosmosVestingV1Beta1VestingPb = __importStar(require("./generated/cosmos/vesting/v1beta1/vesting_pb.js"));
// cosmwasm/wasm
exports.CosmwasmWasmV1AuthzPb = __importStar(require("./generated/cosmwasm/wasm/v1/authz_pb.js"));
exports.CosmwasmWasmV1GenesisPb = __importStar(require("./generated/cosmwasm/wasm/v1/genesis_pb.js"));
exports.CosmwasmWasmV1IbcPb = __importStar(require("./generated/cosmwasm/wasm/v1/ibc_pb.js"));
exports.CosmwasmWasmV1ProposalLegacyPb = __importStar(require("./generated/cosmwasm/wasm/v1/proposal_legacy_pb.js"));
exports.CosmwasmWasmV1QueryPb = __importStar(require("./generated/cosmwasm/wasm/v1/query_pb.js"));
exports.CosmwasmWasmV1TxPb = __importStar(require("./generated/cosmwasm/wasm/v1/tx_pb.js"));
exports.CosmwasmWasmV1TypesPb = __importStar(require("./generated/cosmwasm/wasm/v1/types_pb.js"));
// google
exports.GoogleApiHttpPb = __importStar(require("./generated/google/api/http_pb.js"));
exports.GoogleProtobufAnyPb = __importStar(require("./generated/google/protobuf/any_pb.js"));
exports.GoogleProtobufDescriptorPb = __importStar(require("./generated/google/protobuf/descriptor_pb.js"));
exports.GoogleProtobufDurationPb = __importStar(require("./generated/google/protobuf/duration_pb.js"));
// TODO: check if we need this
// export * as GoogleProtobufStructPb from './generated/google/protobuf/struct_pb'
exports.GoogleProtobufTimestampPb = __importStar(require("./generated/google/protobuf/timestamp_pb.js"));
// ibc
exports.IbcApplicationsTransferV1QueryPb = __importStar(require("./generated/ibc/applications/transfer/v1/query_pb.js"));
exports.IbcApplicationsTransferV1TransferPb = __importStar(require("./generated/ibc/applications/transfer/v1/transfer_pb.js"));
exports.IbcApplicationsTransferV1TxPb = __importStar(require("./generated/ibc/applications/transfer/v1/tx_pb.js"));
exports.IbcCoreChannelV1ChannelPb = __importStar(require("./generated/ibc/core/channel/v1/channel_pb.js"));
exports.IbcCoreChannelV1GenesisPb = __importStar(require("./generated/ibc/core/channel/v1/genesis_pb.js"));
exports.IbcCoreChannelV1QueryPb = __importStar(require("./generated/ibc/core/channel/v1/query_pb.js"));
exports.IbcCoreChannelV1TxPb = __importStar(require("./generated/ibc/core/channel/v1/tx_pb.js"));
exports.IbcCoreClientV1ClientPb = __importStar(require("./generated/ibc/core/client/v1/client_pb.js"));
exports.IbcCoreClientV1GenesisPb = __importStar(require("./generated/ibc/core/client/v1/genesis_pb.js"));
exports.IbcCoreClientV1QueryPb = __importStar(require("./generated/ibc/core/client/v1/query_pb.js"));
exports.IbcCoreClientV1TxPb = __importStar(require("./generated/ibc/core/client/v1/tx_pb.js"));
exports.IbcCoreCommitmentV1CommitmentPb = __importStar(require("./generated/ibc/core/commitment/v1/commitment_pb.js"));
exports.IbcCoreConnectionV1ConnectionPb = __importStar(require("./generated/ibc/core/connection/v1/connection_pb.js"));
exports.IbcCoreConnectionV1GenesisPb = __importStar(require("./generated/ibc/core/connection/v1/genesis_pb.js"));
exports.IbcCoreConnectionV1QueryPb = __importStar(require("./generated/ibc/core/connection/v1/query_pb.js"));
exports.IbcCoreConnectionV1TxPb = __importStar(require("./generated/ibc/core/connection/v1/tx_pb.js"));
exports.IbcCoreTypesV1GenesisPb = __importStar(require("./generated/ibc/core/types/v1/genesis_pb.js"));
exports.IbcLightcientsSolomachineV2SolomachinePb = __importStar(require("./generated/ibc/lightclients/solomachine/v2/solomachine_pb.js"));
exports.IbcLightcientsTendermintV1TendermintPb = __importStar(require("./generated/ibc/lightclients/tendermint/v1/tendermint_pb.js"));
// cometbft
exports.CometAbciV1TypesPb = __importStar(require("./generated/cometbft/abci/v1/types_pb.js"));
// TODO: check if we need this
// export * as CometBlocksyncV1TypesPb from './generated/cometbft/blocksync/v1/types_pb'
exports.CometCryptoV1KeysPb = __importStar(require("./generated/cometbft/crypto/v1/keys_pb.js"));
exports.CometCryptoV1ProofPb = __importStar(require("./generated/cometbft/crypto/v1/proof_pb.js"));
// TODO: check if we need this
// export * as CometLibsBitsV1TypesPb from './generated/cometbft/libs/bits/v1/types_pb'
// export * as CometMempoolV1TypesPb from './generated/cometbft/mempool/v1/types_pb'
exports.CometP2PV1ConnPb = __importStar(require("./generated/cometbft/p2p/v1/types_pb.js"));
// export * as CometP2PV1Pex from "./cometbft/p2p/v1/pex.js";
exports.CometP2PV1TypesPb = __importStar(require("./generated/cometbft/p2p/v1/types_pb.js"));
// export * as CometRpcGrpcV1Beta3Types from "./cometbft/rpc/grpc/v1beta3/types.js";
// export * as CometStateV1Types from "./cometbft/state/v1/types.js";
// export * as CometStoreV1Types from "./cometbft/store/v1/types.js";
exports.CometTypesV1BlockPb = __importStar(require("./generated/cometbft/types/v1/block_pb.js"));
// export * as CometTypesV1Canonical from "./cometbft/types/v1/canonical.js";
// export * as CometTypesV1EventsPb from "./cometbft/types/v1/events.js";
exports.CometTypesV1EvidencePb = __importStar(require("./generated/cometbft/types/v1/evidence_pb.js"));
exports.CometTypesV1ParamsPb = __importStar(require("./generated/cometbft/types/v1/params_pb.js"));
exports.CometTypesV1TypesPb = __importStar(require("./generated/cometbft/types/v1/types_pb.js"));
exports.CometTypesV1ValidatorPb = __importStar(require("./generated/cometbft/types/v1/validator_pb.js"));
exports.CometVersionV1TypesPb = __importStar(require("./generated/cometbft/version/v1/types_pb.js"));
// ics23
exports.ConfioProofsPb = __importStar(require("./generated/cosmos/ics23/v1/proofs_pb.js"));
