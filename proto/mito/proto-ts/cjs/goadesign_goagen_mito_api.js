"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamVaultRequest = exports.StreamTransfersResponse = exports.StreamTransfersRequest = exports.StakingAmount = exports.StakingAmountAtHeightResponse = exports.StakingAmountAtHeightRequest = exports.StakingActivity = exports.StakingHistoryResponse = exports.StakingHistoryRequest = exports.StakingReward = exports.StakingRewardByAccountResponse = exports.StakingRewardByAccountRequest = exports.Gauge = exports.StakingPool_AprBreakdownEntry = exports.StakingPool = exports.GetStakingPoolsResponse = exports.GetStakingPoolsRequest = exports.Coin = exports.Transfer = exports.TransfersHistoryResponse = exports.TransfersHistoryRequest = exports.LeaderboardEpoch = exports.LeaderboardEpochsResponse = exports.LeaderboardEpochsRequest = exports.LeaderboardEntry = exports.LeaderboardResponse = exports.LeaderboardRequest = exports.PortfolioResponse = exports.PortfolioRequest = exports.Holders = exports.LPHoldersResponse = exports.LPHoldersRequest = exports.Subscription = exports.VaultsByHolderAddressResponse = exports.VaultsByHolderAddressRequest = exports.TVLChartResponse = exports.TVLChartRequest = exports.PriceSnapshot = exports.LPTokenPriceChartResponse = exports.LPTokenPriceChartRequest = exports.GetVaultResponse = exports.GetVaultRequest = exports.Pagination = exports.DenomBalance = exports.SubaccountBalance = exports.Changes = exports.Vault = exports.GetVaultsResponse = exports.GetVaultsRequest = exports.protobufPackage = void 0;
exports.MitoAPIGetVaultsDesc = exports.MitoAPIDesc = exports.MitoAPIClientImpl = exports.ClaimReference = exports.GetClaimReferencesResponse = exports.GetClaimReferencesRequest = exports.TokenMetadataResponse = exports.TokenMetadataRequest = exports.WhitelistAccount = exports.GetWhitelistResponse = exports.GetWhitelistRequest = exports.IDOSubscriptionActivity = exports.GetIDOActivitiesResponse = exports.GetIDOActivitiesRequest = exports.IDOClaimedCoins = exports.IDOSubscription = exports.GetIDOSubscriptionResponse = exports.GetIDOSubscriptionRequest = exports.IDOSubscriber = exports.GetIDOSubscribersResponse = exports.GetIDOSubscribersRequest = exports.GetIDOResponse = exports.GetIDORequest = exports.VestingConfig = exports.VestingConfigMap = exports.InitParams = exports.ArrayOfString = exports.IDOProgress = exports.TokenInfo = exports.IDO = exports.ListIDOsResponse = exports.ListIDOsRequest = exports.MissionLeaderboardEntry = exports.MissionLeaderboardResponse = exports.MissionLeaderboardRequest = exports.Mission = exports.MissionsResponse = exports.MissionsRequest = exports.ExecutionLog = exports.ExecutionResponse = exports.ExecutionRequest = exports.HealthResponse = exports.HealthRequest = exports.StreamHistoricalStakingResponse = exports.StreamHistoricalStakingRequest = exports.StreamStakingRewardByAccountResponse = exports.StreamStakingRewardByAccountRequest = exports.StreamHolderSubscriptionResponse = exports.StreamHolderSubscriptionRequest = exports.StreamVaultResponse = void 0;
exports.GrpcWebError = exports.GrpcWebImpl = exports.MitoAPIGetClaimReferencesDesc = exports.MitoAPITokenMetadataDesc = exports.MitoAPIGetWhitelistDesc = exports.MitoAPIGetIDOActivitiesDesc = exports.MitoAPIGetIDOSubscriptionDesc = exports.MitoAPIGetIDOSubscribersDesc = exports.MitoAPIGetIDODesc = exports.MitoAPIListIDOsDesc = exports.MitoAPIMissionLeaderboardDesc = exports.MitoAPIMissionsDesc = exports.MitoAPIExecutionDesc = exports.MitoAPIHealthDesc = exports.MitoAPIStreamHistoricalStakingDesc = exports.MitoAPIStreamStakingRewardByAccountDesc = exports.MitoAPIStreamHolderSubscriptionDesc = exports.MitoAPIStreamVaultDesc = exports.MitoAPIStreamTransfersDesc = exports.MitoAPIStakingAmountAtHeightDesc = exports.MitoAPIStakingHistoryDesc = exports.MitoAPIStakingRewardByAccountDesc = exports.MitoAPIGetStakingPoolsDesc = exports.MitoAPITransfersHistoryDesc = exports.MitoAPILeaderboardEpochsDesc = exports.MitoAPILeaderboardDesc = exports.MitoAPIPortfolioDesc = exports.MitoAPILPHoldersDesc = exports.MitoAPIVaultsByHolderAddressDesc = exports.MitoAPITVLChartDesc = exports.MitoAPILPTokenPriceChartDesc = exports.MitoAPIGetVaultDesc = void 0;
/* eslint-disable */
const grpc_web_1 = require("@injectivelabs/grpc-web");
const browser_headers_1 = require("browser-headers");
const long_1 = __importDefault(require("long"));
const minimal_js_1 = __importDefault(require("protobufjs/minimal.js"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
exports.protobufPackage = "mito_api";
function createBaseGetVaultsRequest() {
    return { limit: undefined, pageIndex: undefined, codeId: undefined };
}
exports.GetVaultsRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.limit !== undefined) {
            writer.uint32(8).uint32(message.limit);
        }
        if (message.pageIndex !== undefined) {
            writer.uint32(16).uint32(message.pageIndex);
        }
        if (message.codeId !== undefined) {
            writer.uint32(24).uint64(message.codeId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVaultsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.limit = reader.uint32();
                    break;
                case 2:
                    message.pageIndex = reader.uint32();
                    break;
                case 3:
                    message.codeId = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            pageIndex: isSet(object.pageIndex) ? Number(object.pageIndex) : undefined,
            codeId: isSet(object.codeId) ? String(object.codeId) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.pageIndex !== undefined && (obj.pageIndex = Math.round(message.pageIndex));
        message.codeId !== undefined && (obj.codeId = message.codeId);
        return obj;
    },
    create(base) {
        return exports.GetVaultsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseGetVaultsRequest();
        message.limit = (_a = object.limit) !== null && _a !== void 0 ? _a : undefined;
        message.pageIndex = (_b = object.pageIndex) !== null && _b !== void 0 ? _b : undefined;
        message.codeId = (_c = object.codeId) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseGetVaultsResponse() {
    return { vaults: [], pagination: undefined };
}
exports.GetVaultsResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.vaults) {
            exports.Vault.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVaultsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaults.push(exports.Vault.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaults: Array.isArray(object === null || object === void 0 ? void 0 : object.vaults) ? object.vaults.map((e) => exports.Vault.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.vaults) {
            obj.vaults = message.vaults.map((e) => e ? exports.Vault.toJSON(e) : undefined);
        }
        else {
            obj.vaults = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetVaultsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetVaultsResponse();
        message.vaults = ((_a = object.vaults) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Vault.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseVault() {
    return {
        contractAddress: "",
        codeId: "0",
        vaultName: "",
        marketId: "",
        currentTvl: 0,
        profits: undefined,
        updatedAt: "0",
        vaultType: "",
        lpTokenPrice: 0,
        subaccountInfo: undefined,
        masterContractAddress: "",
        totalLpAmount: "",
        slug: "",
        createdAt: "0",
        notionalValueCap: "",
        tvlChanges: undefined,
        apy: 0,
        apy7D: 0,
        apy7DFq: 0,
        apyue: 0,
        apyV3: 0,
        registrationMode: "",
    };
}
exports.Vault = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.codeId !== "0") {
            writer.uint32(16).uint64(message.codeId);
        }
        if (message.vaultName !== "") {
            writer.uint32(26).string(message.vaultName);
        }
        if (message.marketId !== "") {
            writer.uint32(34).string(message.marketId);
        }
        if (message.currentTvl !== 0) {
            writer.uint32(41).double(message.currentTvl);
        }
        if (message.profits !== undefined) {
            exports.Changes.encode(message.profits, writer.uint32(50).fork()).ldelim();
        }
        if (message.updatedAt !== "0") {
            writer.uint32(56).uint64(message.updatedAt);
        }
        if (message.vaultType !== "") {
            writer.uint32(66).string(message.vaultType);
        }
        if (message.lpTokenPrice !== 0) {
            writer.uint32(73).double(message.lpTokenPrice);
        }
        if (message.subaccountInfo !== undefined) {
            exports.SubaccountBalance.encode(message.subaccountInfo, writer.uint32(82).fork()).ldelim();
        }
        if (message.masterContractAddress !== "") {
            writer.uint32(90).string(message.masterContractAddress);
        }
        if (message.totalLpAmount !== "") {
            writer.uint32(98).string(message.totalLpAmount);
        }
        if (message.slug !== "") {
            writer.uint32(106).string(message.slug);
        }
        if (message.createdAt !== "0") {
            writer.uint32(112).sint64(message.createdAt);
        }
        if (message.notionalValueCap !== "") {
            writer.uint32(122).string(message.notionalValueCap);
        }
        if (message.tvlChanges !== undefined) {
            exports.Changes.encode(message.tvlChanges, writer.uint32(130).fork()).ldelim();
        }
        if (message.apy !== 0) {
            writer.uint32(137).double(message.apy);
        }
        if (message.apy7D !== 0) {
            writer.uint32(145).double(message.apy7D);
        }
        if (message.apy7DFq !== 0) {
            writer.uint32(153).double(message.apy7DFq);
        }
        if (message.apyue !== 0) {
            writer.uint32(161).double(message.apyue);
        }
        if (message.apyV3 !== 0) {
            writer.uint32(169).double(message.apyV3);
        }
        if (message.registrationMode !== "") {
            writer.uint32(178).string(message.registrationMode);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVault();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 3:
                    message.vaultName = reader.string();
                    break;
                case 4:
                    message.marketId = reader.string();
                    break;
                case 5:
                    message.currentTvl = reader.double();
                    break;
                case 6:
                    message.profits = exports.Changes.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.updatedAt = longToString(reader.uint64());
                    break;
                case 8:
                    message.vaultType = reader.string();
                    break;
                case 9:
                    message.lpTokenPrice = reader.double();
                    break;
                case 10:
                    message.subaccountInfo = exports.SubaccountBalance.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.masterContractAddress = reader.string();
                    break;
                case 12:
                    message.totalLpAmount = reader.string();
                    break;
                case 13:
                    message.slug = reader.string();
                    break;
                case 14:
                    message.createdAt = longToString(reader.sint64());
                    break;
                case 15:
                    message.notionalValueCap = reader.string();
                    break;
                case 16:
                    message.tvlChanges = exports.Changes.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.apy = reader.double();
                    break;
                case 18:
                    message.apy7D = reader.double();
                    break;
                case 19:
                    message.apy7DFq = reader.double();
                    break;
                case 20:
                    message.apyue = reader.double();
                    break;
                case 21:
                    message.apyV3 = reader.double();
                    break;
                case 22:
                    message.registrationMode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            vaultName: isSet(object.vaultName) ? String(object.vaultName) : "",
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            currentTvl: isSet(object.currentTvl) ? Number(object.currentTvl) : 0,
            profits: isSet(object.profits) ? exports.Changes.fromJSON(object.profits) : undefined,
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            vaultType: isSet(object.vaultType) ? String(object.vaultType) : "",
            lpTokenPrice: isSet(object.lpTokenPrice) ? Number(object.lpTokenPrice) : 0,
            subaccountInfo: isSet(object.subaccountInfo) ? exports.SubaccountBalance.fromJSON(object.subaccountInfo) : undefined,
            masterContractAddress: isSet(object.masterContractAddress) ? String(object.masterContractAddress) : "",
            totalLpAmount: isSet(object.totalLpAmount) ? String(object.totalLpAmount) : "",
            slug: isSet(object.slug) ? String(object.slug) : "",
            createdAt: isSet(object.createdAt) ? String(object.createdAt) : "0",
            notionalValueCap: isSet(object.notionalValueCap) ? String(object.notionalValueCap) : "",
            tvlChanges: isSet(object.tvlChanges) ? exports.Changes.fromJSON(object.tvlChanges) : undefined,
            apy: isSet(object.apy) ? Number(object.apy) : 0,
            apy7D: isSet(object.apy7D) ? Number(object.apy7D) : 0,
            apy7DFq: isSet(object.apy7DFq) ? Number(object.apy7DFq) : 0,
            apyue: isSet(object.apyue) ? Number(object.apyue) : 0,
            apyV3: isSet(object.apyV3) ? Number(object.apyV3) : 0,
            registrationMode: isSet(object.registrationMode) ? String(object.registrationMode) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.vaultName !== undefined && (obj.vaultName = message.vaultName);
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.currentTvl !== undefined && (obj.currentTvl = message.currentTvl);
        message.profits !== undefined && (obj.profits = message.profits ? exports.Changes.toJSON(message.profits) : undefined);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.vaultType !== undefined && (obj.vaultType = message.vaultType);
        message.lpTokenPrice !== undefined && (obj.lpTokenPrice = message.lpTokenPrice);
        message.subaccountInfo !== undefined &&
            (obj.subaccountInfo = message.subaccountInfo ? exports.SubaccountBalance.toJSON(message.subaccountInfo) : undefined);
        message.masterContractAddress !== undefined && (obj.masterContractAddress = message.masterContractAddress);
        message.totalLpAmount !== undefined && (obj.totalLpAmount = message.totalLpAmount);
        message.slug !== undefined && (obj.slug = message.slug);
        message.createdAt !== undefined && (obj.createdAt = message.createdAt);
        message.notionalValueCap !== undefined && (obj.notionalValueCap = message.notionalValueCap);
        message.tvlChanges !== undefined &&
            (obj.tvlChanges = message.tvlChanges ? exports.Changes.toJSON(message.tvlChanges) : undefined);
        message.apy !== undefined && (obj.apy = message.apy);
        message.apy7D !== undefined && (obj.apy7D = message.apy7D);
        message.apy7DFq !== undefined && (obj.apy7DFq = message.apy7DFq);
        message.apyue !== undefined && (obj.apyue = message.apyue);
        message.apyV3 !== undefined && (obj.apyV3 = message.apyV3);
        message.registrationMode !== undefined && (obj.registrationMode = message.registrationMode);
        return obj;
    },
    create(base) {
        return exports.Vault.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        const message = createBaseVault();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        message.codeId = (_b = object.codeId) !== null && _b !== void 0 ? _b : "0";
        message.vaultName = (_c = object.vaultName) !== null && _c !== void 0 ? _c : "";
        message.marketId = (_d = object.marketId) !== null && _d !== void 0 ? _d : "";
        message.currentTvl = (_e = object.currentTvl) !== null && _e !== void 0 ? _e : 0;
        message.profits = (object.profits !== undefined && object.profits !== null)
            ? exports.Changes.fromPartial(object.profits)
            : undefined;
        message.updatedAt = (_f = object.updatedAt) !== null && _f !== void 0 ? _f : "0";
        message.vaultType = (_g = object.vaultType) !== null && _g !== void 0 ? _g : "";
        message.lpTokenPrice = (_h = object.lpTokenPrice) !== null && _h !== void 0 ? _h : 0;
        message.subaccountInfo = (object.subaccountInfo !== undefined && object.subaccountInfo !== null)
            ? exports.SubaccountBalance.fromPartial(object.subaccountInfo)
            : undefined;
        message.masterContractAddress = (_j = object.masterContractAddress) !== null && _j !== void 0 ? _j : "";
        message.totalLpAmount = (_k = object.totalLpAmount) !== null && _k !== void 0 ? _k : "";
        message.slug = (_l = object.slug) !== null && _l !== void 0 ? _l : "";
        message.createdAt = (_m = object.createdAt) !== null && _m !== void 0 ? _m : "0";
        message.notionalValueCap = (_o = object.notionalValueCap) !== null && _o !== void 0 ? _o : "";
        message.tvlChanges = (object.tvlChanges !== undefined && object.tvlChanges !== null)
            ? exports.Changes.fromPartial(object.tvlChanges)
            : undefined;
        message.apy = (_p = object.apy) !== null && _p !== void 0 ? _p : 0;
        message.apy7D = (_q = object.apy7D) !== null && _q !== void 0 ? _q : 0;
        message.apy7DFq = (_r = object.apy7DFq) !== null && _r !== void 0 ? _r : 0;
        message.apyue = (_s = object.apyue) !== null && _s !== void 0 ? _s : 0;
        message.apyV3 = (_t = object.apyV3) !== null && _t !== void 0 ? _t : 0;
        message.registrationMode = (_u = object.registrationMode) !== null && _u !== void 0 ? _u : "";
        return message;
    },
};
function createBaseChanges() {
    return {
        allTimeChange: 0,
        threeMonthsChange: undefined,
        oneMonthChange: undefined,
        oneDayChange: undefined,
        oneWeekChange: undefined,
        oneYearChange: undefined,
        threeYearsChange: undefined,
        sixMonthsChange: undefined,
    };
}
exports.Changes = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.allTimeChange !== 0) {
            writer.uint32(9).double(message.allTimeChange);
        }
        if (message.threeMonthsChange !== undefined) {
            writer.uint32(17).double(message.threeMonthsChange);
        }
        if (message.oneMonthChange !== undefined) {
            writer.uint32(25).double(message.oneMonthChange);
        }
        if (message.oneDayChange !== undefined) {
            writer.uint32(33).double(message.oneDayChange);
        }
        if (message.oneWeekChange !== undefined) {
            writer.uint32(41).double(message.oneWeekChange);
        }
        if (message.oneYearChange !== undefined) {
            writer.uint32(49).double(message.oneYearChange);
        }
        if (message.threeYearsChange !== undefined) {
            writer.uint32(57).double(message.threeYearsChange);
        }
        if (message.sixMonthsChange !== undefined) {
            writer.uint32(65).double(message.sixMonthsChange);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseChanges();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.allTimeChange = reader.double();
                    break;
                case 2:
                    message.threeMonthsChange = reader.double();
                    break;
                case 3:
                    message.oneMonthChange = reader.double();
                    break;
                case 4:
                    message.oneDayChange = reader.double();
                    break;
                case 5:
                    message.oneWeekChange = reader.double();
                    break;
                case 6:
                    message.oneYearChange = reader.double();
                    break;
                case 7:
                    message.threeYearsChange = reader.double();
                    break;
                case 8:
                    message.sixMonthsChange = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            allTimeChange: isSet(object.allTimeChange) ? Number(object.allTimeChange) : 0,
            threeMonthsChange: isSet(object.threeMonthsChange) ? Number(object.threeMonthsChange) : undefined,
            oneMonthChange: isSet(object.oneMonthChange) ? Number(object.oneMonthChange) : undefined,
            oneDayChange: isSet(object.oneDayChange) ? Number(object.oneDayChange) : undefined,
            oneWeekChange: isSet(object.oneWeekChange) ? Number(object.oneWeekChange) : undefined,
            oneYearChange: isSet(object.oneYearChange) ? Number(object.oneYearChange) : undefined,
            threeYearsChange: isSet(object.threeYearsChange) ? Number(object.threeYearsChange) : undefined,
            sixMonthsChange: isSet(object.sixMonthsChange) ? Number(object.sixMonthsChange) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.allTimeChange !== undefined && (obj.allTimeChange = message.allTimeChange);
        message.threeMonthsChange !== undefined && (obj.threeMonthsChange = message.threeMonthsChange);
        message.oneMonthChange !== undefined && (obj.oneMonthChange = message.oneMonthChange);
        message.oneDayChange !== undefined && (obj.oneDayChange = message.oneDayChange);
        message.oneWeekChange !== undefined && (obj.oneWeekChange = message.oneWeekChange);
        message.oneYearChange !== undefined && (obj.oneYearChange = message.oneYearChange);
        message.threeYearsChange !== undefined && (obj.threeYearsChange = message.threeYearsChange);
        message.sixMonthsChange !== undefined && (obj.sixMonthsChange = message.sixMonthsChange);
        return obj;
    },
    create(base) {
        return exports.Changes.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseChanges();
        message.allTimeChange = (_a = object.allTimeChange) !== null && _a !== void 0 ? _a : 0;
        message.threeMonthsChange = (_b = object.threeMonthsChange) !== null && _b !== void 0 ? _b : undefined;
        message.oneMonthChange = (_c = object.oneMonthChange) !== null && _c !== void 0 ? _c : undefined;
        message.oneDayChange = (_d = object.oneDayChange) !== null && _d !== void 0 ? _d : undefined;
        message.oneWeekChange = (_e = object.oneWeekChange) !== null && _e !== void 0 ? _e : undefined;
        message.oneYearChange = (_f = object.oneYearChange) !== null && _f !== void 0 ? _f : undefined;
        message.threeYearsChange = (_g = object.threeYearsChange) !== null && _g !== void 0 ? _g : undefined;
        message.sixMonthsChange = (_h = object.sixMonthsChange) !== null && _h !== void 0 ? _h : undefined;
        return message;
    },
};
function createBaseSubaccountBalance() {
    return { subaccountId: "", balances: [] };
}
exports.SubaccountBalance = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.subaccountId !== "") {
            writer.uint32(10).string(message.subaccountId);
        }
        for (const v of message.balances) {
            exports.DenomBalance.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubaccountBalance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.subaccountId = reader.string();
                    break;
                case 2:
                    message.balances.push(exports.DenomBalance.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            subaccountId: isSet(object.subaccountId) ? String(object.subaccountId) : "",
            balances: Array.isArray(object === null || object === void 0 ? void 0 : object.balances) ? object.balances.map((e) => exports.DenomBalance.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.subaccountId !== undefined && (obj.subaccountId = message.subaccountId);
        if (message.balances) {
            obj.balances = message.balances.map((e) => e ? exports.DenomBalance.toJSON(e) : undefined);
        }
        else {
            obj.balances = [];
        }
        return obj;
    },
    create(base) {
        return exports.SubaccountBalance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseSubaccountBalance();
        message.subaccountId = (_a = object.subaccountId) !== null && _a !== void 0 ? _a : "";
        message.balances = ((_b = object.balances) === null || _b === void 0 ? void 0 : _b.map((e) => exports.DenomBalance.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDenomBalance() {
    return { denom: "", totalBalance: "", price: undefined, updatedAt: undefined, source: undefined };
}
exports.DenomBalance = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.totalBalance !== "") {
            writer.uint32(18).string(message.totalBalance);
        }
        if (message.price !== undefined) {
            writer.uint32(26).string(message.price);
        }
        if (message.updatedAt !== undefined) {
            writer.uint32(32).sint64(message.updatedAt);
        }
        if (message.source !== undefined) {
            writer.uint32(42).string(message.source);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDenomBalance();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.totalBalance = reader.string();
                    break;
                case 3:
                    message.price = reader.string();
                    break;
                case 4:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 5:
                    message.source = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            totalBalance: isSet(object.totalBalance) ? String(object.totalBalance) : "",
            price: isSet(object.price) ? String(object.price) : undefined,
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : undefined,
            source: isSet(object.source) ? String(object.source) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.totalBalance !== undefined && (obj.totalBalance = message.totalBalance);
        message.price !== undefined && (obj.price = message.price);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.source !== undefined && (obj.source = message.source);
        return obj;
    },
    create(base) {
        return exports.DenomBalance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseDenomBalance();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.totalBalance = (_b = object.totalBalance) !== null && _b !== void 0 ? _b : "";
        message.price = (_c = object.price) !== null && _c !== void 0 ? _c : undefined;
        message.updatedAt = (_d = object.updatedAt) !== null && _d !== void 0 ? _d : undefined;
        message.source = (_e = object.source) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBasePagination() {
    return { total: 0 };
}
exports.Pagination = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.total !== 0) {
            writer.uint32(8).uint32(message.total);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePagination();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.total = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { total: isSet(object.total) ? Number(object.total) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.total !== undefined && (obj.total = Math.round(message.total));
        return obj;
    },
    create(base) {
        return exports.Pagination.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasePagination();
        message.total = (_a = object.total) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseGetVaultRequest() {
    return { contractAddress: undefined, slug: undefined };
}
exports.GetVaultRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== undefined) {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.slug !== undefined) {
            writer.uint32(18).string(message.slug);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVaultRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.slug = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : undefined,
            slug: isSet(object.slug) ? String(object.slug) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.slug !== undefined && (obj.slug = message.slug);
        return obj;
    },
    create(base) {
        return exports.GetVaultRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetVaultRequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : undefined;
        message.slug = (_b = object.slug) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseGetVaultResponse() {
    return { vault: [] };
}
exports.GetVaultResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.vault) {
            exports.Vault.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetVaultResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vault.push(exports.Vault.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { vault: Array.isArray(object === null || object === void 0 ? void 0 : object.vault) ? object.vault.map((e) => exports.Vault.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.vault) {
            obj.vault = message.vault.map((e) => e ? exports.Vault.toJSON(e) : undefined);
        }
        else {
            obj.vault = [];
        }
        return obj;
    },
    create(base) {
        return exports.GetVaultResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetVaultResponse();
        message.vault = ((_a = object.vault) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Vault.fromPartial(e))) || [];
        return message;
    },
};
function createBaseLPTokenPriceChartRequest() {
    return { vaultAddress: "", fromTime: undefined, toTime: undefined };
}
exports.LPTokenPriceChartRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vaultAddress !== "") {
            writer.uint32(10).string(message.vaultAddress);
        }
        if (message.fromTime !== undefined) {
            writer.uint32(16).uint64(message.fromTime);
        }
        if (message.toTime !== undefined) {
            writer.uint32(24).uint64(message.toTime);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLPTokenPriceChartRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaultAddress = reader.string();
                    break;
                case 2:
                    message.fromTime = longToString(reader.uint64());
                    break;
                case 3:
                    message.toTime = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            fromTime: isSet(object.fromTime) ? String(object.fromTime) : undefined,
            toTime: isSet(object.toTime) ? String(object.toTime) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.fromTime !== undefined && (obj.fromTime = message.fromTime);
        message.toTime !== undefined && (obj.toTime = message.toTime);
        return obj;
    },
    create(base) {
        return exports.LPTokenPriceChartRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseLPTokenPriceChartRequest();
        message.vaultAddress = (_a = object.vaultAddress) !== null && _a !== void 0 ? _a : "";
        message.fromTime = (_b = object.fromTime) !== null && _b !== void 0 ? _b : undefined;
        message.toTime = (_c = object.toTime) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseLPTokenPriceChartResponse() {
    return { prices: [] };
}
exports.LPTokenPriceChartResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.prices) {
            exports.PriceSnapshot.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLPTokenPriceChartResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.prices.push(exports.PriceSnapshot.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { prices: Array.isArray(object === null || object === void 0 ? void 0 : object.prices) ? object.prices.map((e) => exports.PriceSnapshot.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.prices) {
            obj.prices = message.prices.map((e) => e ? exports.PriceSnapshot.toJSON(e) : undefined);
        }
        else {
            obj.prices = [];
        }
        return obj;
    },
    create(base) {
        return exports.LPTokenPriceChartResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseLPTokenPriceChartResponse();
        message.prices = ((_a = object.prices) === null || _a === void 0 ? void 0 : _a.map((e) => exports.PriceSnapshot.fromPartial(e))) || [];
        return message;
    },
};
function createBasePriceSnapshot() {
    return { price: 0, updatedAt: "0" };
}
exports.PriceSnapshot = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.price !== 0) {
            writer.uint32(9).double(message.price);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(16).uint64(message.updatedAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePriceSnapshot();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.price = reader.double();
                    break;
                case 2:
                    message.updatedAt = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            price: isSet(object.price) ? Number(object.price) : 0,
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.price !== undefined && (obj.price = message.price);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        return obj;
    },
    create(base) {
        return exports.PriceSnapshot.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePriceSnapshot();
        message.price = (_a = object.price) !== null && _a !== void 0 ? _a : 0;
        message.updatedAt = (_b = object.updatedAt) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseTVLChartRequest() {
    return { vaultAddress: "", fromTime: undefined, toTime: undefined };
}
exports.TVLChartRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vaultAddress !== "") {
            writer.uint32(10).string(message.vaultAddress);
        }
        if (message.fromTime !== undefined) {
            writer.uint32(16).uint64(message.fromTime);
        }
        if (message.toTime !== undefined) {
            writer.uint32(24).uint64(message.toTime);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTVLChartRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaultAddress = reader.string();
                    break;
                case 2:
                    message.fromTime = longToString(reader.uint64());
                    break;
                case 3:
                    message.toTime = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            fromTime: isSet(object.fromTime) ? String(object.fromTime) : undefined,
            toTime: isSet(object.toTime) ? String(object.toTime) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.fromTime !== undefined && (obj.fromTime = message.fromTime);
        message.toTime !== undefined && (obj.toTime = message.toTime);
        return obj;
    },
    create(base) {
        return exports.TVLChartRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseTVLChartRequest();
        message.vaultAddress = (_a = object.vaultAddress) !== null && _a !== void 0 ? _a : "";
        message.fromTime = (_b = object.fromTime) !== null && _b !== void 0 ? _b : undefined;
        message.toTime = (_c = object.toTime) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseTVLChartResponse() {
    return { prices: [] };
}
exports.TVLChartResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.prices) {
            exports.PriceSnapshot.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTVLChartResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.prices.push(exports.PriceSnapshot.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { prices: Array.isArray(object === null || object === void 0 ? void 0 : object.prices) ? object.prices.map((e) => exports.PriceSnapshot.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.prices) {
            obj.prices = message.prices.map((e) => e ? exports.PriceSnapshot.toJSON(e) : undefined);
        }
        else {
            obj.prices = [];
        }
        return obj;
    },
    create(base) {
        return exports.TVLChartResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTVLChartResponse();
        message.prices = ((_a = object.prices) === null || _a === void 0 ? void 0 : _a.map((e) => exports.PriceSnapshot.fromPartial(e))) || [];
        return message;
    },
};
function createBaseVaultsByHolderAddressRequest() {
    return { limit: undefined, pageIndex: undefined, holderAddress: "", vaultAddress: undefined, skip: undefined };
}
exports.VaultsByHolderAddressRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.limit !== undefined) {
            writer.uint32(8).uint32(message.limit);
        }
        if (message.pageIndex !== undefined) {
            writer.uint32(16).uint32(message.pageIndex);
        }
        if (message.holderAddress !== "") {
            writer.uint32(26).string(message.holderAddress);
        }
        if (message.vaultAddress !== undefined) {
            writer.uint32(34).string(message.vaultAddress);
        }
        if (message.skip !== undefined) {
            writer.uint32(40).sint32(message.skip);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVaultsByHolderAddressRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.limit = reader.uint32();
                    break;
                case 2:
                    message.pageIndex = reader.uint32();
                    break;
                case 3:
                    message.holderAddress = reader.string();
                    break;
                case 4:
                    message.vaultAddress = reader.string();
                    break;
                case 5:
                    message.skip = reader.sint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            pageIndex: isSet(object.pageIndex) ? Number(object.pageIndex) : undefined,
            holderAddress: isSet(object.holderAddress) ? String(object.holderAddress) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : undefined,
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.pageIndex !== undefined && (obj.pageIndex = Math.round(message.pageIndex));
        message.holderAddress !== undefined && (obj.holderAddress = message.holderAddress);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        return obj;
    },
    create(base) {
        return exports.VaultsByHolderAddressRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseVaultsByHolderAddressRequest();
        message.limit = (_a = object.limit) !== null && _a !== void 0 ? _a : undefined;
        message.pageIndex = (_b = object.pageIndex) !== null && _b !== void 0 ? _b : undefined;
        message.holderAddress = (_c = object.holderAddress) !== null && _c !== void 0 ? _c : "";
        message.vaultAddress = (_d = object.vaultAddress) !== null && _d !== void 0 ? _d : undefined;
        message.skip = (_e = object.skip) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseVaultsByHolderAddressResponse() {
    return { subscriptions: [], pagination: undefined };
}
exports.VaultsByHolderAddressResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.subscriptions) {
            exports.Subscription.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVaultsByHolderAddressResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.subscriptions.push(exports.Subscription.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            subscriptions: Array.isArray(object === null || object === void 0 ? void 0 : object.subscriptions)
                ? object.subscriptions.map((e) => exports.Subscription.fromJSON(e))
                : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.subscriptions) {
            obj.subscriptions = message.subscriptions.map((e) => e ? exports.Subscription.toJSON(e) : undefined);
        }
        else {
            obj.subscriptions = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.VaultsByHolderAddressResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseVaultsByHolderAddressResponse();
        message.subscriptions = ((_a = object.subscriptions) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Subscription.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseSubscription() {
    return { vaultInfo: undefined, lpAmount: "", holderAddress: "", lpAmountPercentage: 0 };
}
exports.Subscription = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vaultInfo !== undefined) {
            exports.Vault.encode(message.vaultInfo, writer.uint32(10).fork()).ldelim();
        }
        if (message.lpAmount !== "") {
            writer.uint32(18).string(message.lpAmount);
        }
        if (message.holderAddress !== "") {
            writer.uint32(26).string(message.holderAddress);
        }
        if (message.lpAmountPercentage !== 0) {
            writer.uint32(33).double(message.lpAmountPercentage);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubscription();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaultInfo = exports.Vault.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.lpAmount = reader.string();
                    break;
                case 3:
                    message.holderAddress = reader.string();
                    break;
                case 4:
                    message.lpAmountPercentage = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaultInfo: isSet(object.vaultInfo) ? exports.Vault.fromJSON(object.vaultInfo) : undefined,
            lpAmount: isSet(object.lpAmount) ? String(object.lpAmount) : "",
            holderAddress: isSet(object.holderAddress) ? String(object.holderAddress) : "",
            lpAmountPercentage: isSet(object.lpAmountPercentage) ? Number(object.lpAmountPercentage) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vaultInfo !== undefined &&
            (obj.vaultInfo = message.vaultInfo ? exports.Vault.toJSON(message.vaultInfo) : undefined);
        message.lpAmount !== undefined && (obj.lpAmount = message.lpAmount);
        message.holderAddress !== undefined && (obj.holderAddress = message.holderAddress);
        message.lpAmountPercentage !== undefined && (obj.lpAmountPercentage = message.lpAmountPercentage);
        return obj;
    },
    create(base) {
        return exports.Subscription.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseSubscription();
        message.vaultInfo = (object.vaultInfo !== undefined && object.vaultInfo !== null)
            ? exports.Vault.fromPartial(object.vaultInfo)
            : undefined;
        message.lpAmount = (_a = object.lpAmount) !== null && _a !== void 0 ? _a : "";
        message.holderAddress = (_b = object.holderAddress) !== null && _b !== void 0 ? _b : "";
        message.lpAmountPercentage = (_c = object.lpAmountPercentage) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseLPHoldersRequest() {
    return {
        limit: undefined,
        pageIndex: undefined,
        vaultAddress: "",
        stakingContractAddress: undefined,
        skip: undefined,
    };
}
exports.LPHoldersRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.limit !== undefined) {
            writer.uint32(8).uint32(message.limit);
        }
        if (message.pageIndex !== undefined) {
            writer.uint32(16).uint32(message.pageIndex);
        }
        if (message.vaultAddress !== "") {
            writer.uint32(26).string(message.vaultAddress);
        }
        if (message.stakingContractAddress !== undefined) {
            writer.uint32(34).string(message.stakingContractAddress);
        }
        if (message.skip !== undefined) {
            writer.uint32(40).sint32(message.skip);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLPHoldersRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.limit = reader.uint32();
                    break;
                case 2:
                    message.pageIndex = reader.uint32();
                    break;
                case 3:
                    message.vaultAddress = reader.string();
                    break;
                case 4:
                    message.stakingContractAddress = reader.string();
                    break;
                case 5:
                    message.skip = reader.sint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            pageIndex: isSet(object.pageIndex) ? Number(object.pageIndex) : undefined,
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : undefined,
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.pageIndex !== undefined && (obj.pageIndex = Math.round(message.pageIndex));
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        return obj;
    },
    create(base) {
        return exports.LPHoldersRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseLPHoldersRequest();
        message.limit = (_a = object.limit) !== null && _a !== void 0 ? _a : undefined;
        message.pageIndex = (_b = object.pageIndex) !== null && _b !== void 0 ? _b : undefined;
        message.vaultAddress = (_c = object.vaultAddress) !== null && _c !== void 0 ? _c : "";
        message.stakingContractAddress = (_d = object.stakingContractAddress) !== null && _d !== void 0 ? _d : undefined;
        message.skip = (_e = object.skip) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseLPHoldersResponse() {
    return { holders: [], pagination: undefined };
}
exports.LPHoldersResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.holders) {
            exports.Holders.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLPHoldersResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.holders.push(exports.Holders.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            holders: Array.isArray(object === null || object === void 0 ? void 0 : object.holders) ? object.holders.map((e) => exports.Holders.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.holders) {
            obj.holders = message.holders.map((e) => e ? exports.Holders.toJSON(e) : undefined);
        }
        else {
            obj.holders = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.LPHoldersResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseLPHoldersResponse();
        message.holders = ((_a = object.holders) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Holders.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseHolders() {
    return {
        holderAddress: "",
        vaultAddress: "",
        amount: "",
        updatedAt: "0",
        lpAmountPercentage: 0,
        redemptionLockTime: "0",
        stakedAmount: "",
    };
}
exports.Holders = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.holderAddress !== "") {
            writer.uint32(10).string(message.holderAddress);
        }
        if (message.vaultAddress !== "") {
            writer.uint32(18).string(message.vaultAddress);
        }
        if (message.amount !== "") {
            writer.uint32(26).string(message.amount);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(32).sint64(message.updatedAt);
        }
        if (message.lpAmountPercentage !== 0) {
            writer.uint32(41).double(message.lpAmountPercentage);
        }
        if (message.redemptionLockTime !== "0") {
            writer.uint32(48).sint64(message.redemptionLockTime);
        }
        if (message.stakedAmount !== "") {
            writer.uint32(58).string(message.stakedAmount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHolders();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.holderAddress = reader.string();
                    break;
                case 2:
                    message.vaultAddress = reader.string();
                    break;
                case 3:
                    message.amount = reader.string();
                    break;
                case 4:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 5:
                    message.lpAmountPercentage = reader.double();
                    break;
                case 6:
                    message.redemptionLockTime = longToString(reader.sint64());
                    break;
                case 7:
                    message.stakedAmount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            holderAddress: isSet(object.holderAddress) ? String(object.holderAddress) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            amount: isSet(object.amount) ? String(object.amount) : "",
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            lpAmountPercentage: isSet(object.lpAmountPercentage) ? Number(object.lpAmountPercentage) : 0,
            redemptionLockTime: isSet(object.redemptionLockTime) ? String(object.redemptionLockTime) : "0",
            stakedAmount: isSet(object.stakedAmount) ? String(object.stakedAmount) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.holderAddress !== undefined && (obj.holderAddress = message.holderAddress);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.amount !== undefined && (obj.amount = message.amount);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.lpAmountPercentage !== undefined && (obj.lpAmountPercentage = message.lpAmountPercentage);
        message.redemptionLockTime !== undefined && (obj.redemptionLockTime = message.redemptionLockTime);
        message.stakedAmount !== undefined && (obj.stakedAmount = message.stakedAmount);
        return obj;
    },
    create(base) {
        return exports.Holders.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseHolders();
        message.holderAddress = (_a = object.holderAddress) !== null && _a !== void 0 ? _a : "";
        message.vaultAddress = (_b = object.vaultAddress) !== null && _b !== void 0 ? _b : "";
        message.amount = (_c = object.amount) !== null && _c !== void 0 ? _c : "";
        message.updatedAt = (_d = object.updatedAt) !== null && _d !== void 0 ? _d : "0";
        message.lpAmountPercentage = (_e = object.lpAmountPercentage) !== null && _e !== void 0 ? _e : 0;
        message.redemptionLockTime = (_f = object.redemptionLockTime) !== null && _f !== void 0 ? _f : "0";
        message.stakedAmount = (_g = object.stakedAmount) !== null && _g !== void 0 ? _g : "";
        return message;
    },
};
function createBasePortfolioRequest() {
    return { holderAddress: "", stakingContractAddress: undefined };
}
exports.PortfolioRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.holderAddress !== "") {
            writer.uint32(10).string(message.holderAddress);
        }
        if (message.stakingContractAddress !== undefined) {
            writer.uint32(18).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePortfolioRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.holderAddress = reader.string();
                    break;
                case 2:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            holderAddress: isSet(object.holderAddress) ? String(object.holderAddress) : "",
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.holderAddress !== undefined && (obj.holderAddress = message.holderAddress);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.PortfolioRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePortfolioRequest();
        message.holderAddress = (_a = object.holderAddress) !== null && _a !== void 0 ? _a : "";
        message.stakingContractAddress = (_b = object.stakingContractAddress) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBasePortfolioResponse() {
    return { totalValue: 0, pnl: 0, totalValueChart: [], pnlChart: [], pnlUpdatedAt: "0" };
}
exports.PortfolioResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.totalValue !== 0) {
            writer.uint32(9).double(message.totalValue);
        }
        if (message.pnl !== 0) {
            writer.uint32(17).double(message.pnl);
        }
        for (const v of message.totalValueChart) {
            exports.PriceSnapshot.encode(v, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.pnlChart) {
            exports.PriceSnapshot.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.pnlUpdatedAt !== "0") {
            writer.uint32(40).sint64(message.pnlUpdatedAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePortfolioResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.totalValue = reader.double();
                    break;
                case 2:
                    message.pnl = reader.double();
                    break;
                case 3:
                    message.totalValueChart.push(exports.PriceSnapshot.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.pnlChart.push(exports.PriceSnapshot.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.pnlUpdatedAt = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            totalValue: isSet(object.totalValue) ? Number(object.totalValue) : 0,
            pnl: isSet(object.pnl) ? Number(object.pnl) : 0,
            totalValueChart: Array.isArray(object === null || object === void 0 ? void 0 : object.totalValueChart)
                ? object.totalValueChart.map((e) => exports.PriceSnapshot.fromJSON(e))
                : [],
            pnlChart: Array.isArray(object === null || object === void 0 ? void 0 : object.pnlChart) ? object.pnlChart.map((e) => exports.PriceSnapshot.fromJSON(e)) : [],
            pnlUpdatedAt: isSet(object.pnlUpdatedAt) ? String(object.pnlUpdatedAt) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.totalValue !== undefined && (obj.totalValue = message.totalValue);
        message.pnl !== undefined && (obj.pnl = message.pnl);
        if (message.totalValueChart) {
            obj.totalValueChart = message.totalValueChart.map((e) => e ? exports.PriceSnapshot.toJSON(e) : undefined);
        }
        else {
            obj.totalValueChart = [];
        }
        if (message.pnlChart) {
            obj.pnlChart = message.pnlChart.map((e) => e ? exports.PriceSnapshot.toJSON(e) : undefined);
        }
        else {
            obj.pnlChart = [];
        }
        message.pnlUpdatedAt !== undefined && (obj.pnlUpdatedAt = message.pnlUpdatedAt);
        return obj;
    },
    create(base) {
        return exports.PortfolioResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBasePortfolioResponse();
        message.totalValue = (_a = object.totalValue) !== null && _a !== void 0 ? _a : 0;
        message.pnl = (_b = object.pnl) !== null && _b !== void 0 ? _b : 0;
        message.totalValueChart = ((_c = object.totalValueChart) === null || _c === void 0 ? void 0 : _c.map((e) => exports.PriceSnapshot.fromPartial(e))) || [];
        message.pnlChart = ((_d = object.pnlChart) === null || _d === void 0 ? void 0 : _d.map((e) => exports.PriceSnapshot.fromPartial(e))) || [];
        message.pnlUpdatedAt = (_e = object.pnlUpdatedAt) !== null && _e !== void 0 ? _e : "0";
        return message;
    },
};
function createBaseLeaderboardRequest() {
    return { epochId: undefined };
}
exports.LeaderboardRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.epochId !== undefined) {
            writer.uint32(8).uint32(message.epochId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.epochId = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { epochId: isSet(object.epochId) ? Number(object.epochId) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.epochId !== undefined && (obj.epochId = Math.round(message.epochId));
        return obj;
    },
    create(base) {
        return exports.LeaderboardRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseLeaderboardRequest();
        message.epochId = (_a = object.epochId) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseLeaderboardResponse() {
    return { entries: [], snapshotBlock: "0", updatedAt: "0", epochId: 0 };
}
exports.LeaderboardResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.entries) {
            exports.LeaderboardEntry.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.snapshotBlock !== "0") {
            writer.uint32(16).sint64(message.snapshotBlock);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(24).sint64(message.updatedAt);
        }
        if (message.epochId !== 0) {
            writer.uint32(32).uint32(message.epochId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.entries.push(exports.LeaderboardEntry.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.snapshotBlock = longToString(reader.sint64());
                    break;
                case 3:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 4:
                    message.epochId = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            entries: Array.isArray(object === null || object === void 0 ? void 0 : object.entries) ? object.entries.map((e) => exports.LeaderboardEntry.fromJSON(e)) : [],
            snapshotBlock: isSet(object.snapshotBlock) ? String(object.snapshotBlock) : "0",
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            epochId: isSet(object.epochId) ? Number(object.epochId) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.entries) {
            obj.entries = message.entries.map((e) => e ? exports.LeaderboardEntry.toJSON(e) : undefined);
        }
        else {
            obj.entries = [];
        }
        message.snapshotBlock !== undefined && (obj.snapshotBlock = message.snapshotBlock);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.epochId !== undefined && (obj.epochId = Math.round(message.epochId));
        return obj;
    },
    create(base) {
        return exports.LeaderboardResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseLeaderboardResponse();
        message.entries = ((_a = object.entries) === null || _a === void 0 ? void 0 : _a.map((e) => exports.LeaderboardEntry.fromPartial(e))) || [];
        message.snapshotBlock = (_b = object.snapshotBlock) !== null && _b !== void 0 ? _b : "0";
        message.updatedAt = (_c = object.updatedAt) !== null && _c !== void 0 ? _c : "0";
        message.epochId = (_d = object.epochId) !== null && _d !== void 0 ? _d : 0;
        return message;
    },
};
function createBaseLeaderboardEntry() {
    return { address: "", pnl: 0 };
}
exports.LeaderboardEntry = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.pnl !== 0) {
            writer.uint32(17).double(message.pnl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.pnl = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            pnl: isSet(object.pnl) ? Number(object.pnl) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.pnl !== undefined && (obj.pnl = message.pnl);
        return obj;
    },
    create(base) {
        return exports.LeaderboardEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseLeaderboardEntry();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.pnl = (_b = object.pnl) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseLeaderboardEpochsRequest() {
    return { fromEpochId: undefined, toEpochId: undefined, limit: undefined };
}
exports.LeaderboardEpochsRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.fromEpochId !== undefined) {
            writer.uint32(8).uint32(message.fromEpochId);
        }
        if (message.toEpochId !== undefined) {
            writer.uint32(16).uint32(message.toEpochId);
        }
        if (message.limit !== undefined) {
            writer.uint32(24).uint32(message.limit);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardEpochsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.fromEpochId = reader.uint32();
                    break;
                case 2:
                    message.toEpochId = reader.uint32();
                    break;
                case 3:
                    message.limit = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            fromEpochId: isSet(object.fromEpochId) ? Number(object.fromEpochId) : undefined,
            toEpochId: isSet(object.toEpochId) ? Number(object.toEpochId) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.fromEpochId !== undefined && (obj.fromEpochId = Math.round(message.fromEpochId));
        message.toEpochId !== undefined && (obj.toEpochId = Math.round(message.toEpochId));
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        return obj;
    },
    create(base) {
        return exports.LeaderboardEpochsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseLeaderboardEpochsRequest();
        message.fromEpochId = (_a = object.fromEpochId) !== null && _a !== void 0 ? _a : undefined;
        message.toEpochId = (_b = object.toEpochId) !== null && _b !== void 0 ? _b : undefined;
        message.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseLeaderboardEpochsResponse() {
    return { epochs: [], pagination: undefined };
}
exports.LeaderboardEpochsResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.epochs) {
            exports.LeaderboardEpoch.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardEpochsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.epochs.push(exports.LeaderboardEpoch.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            epochs: Array.isArray(object === null || object === void 0 ? void 0 : object.epochs) ? object.epochs.map((e) => exports.LeaderboardEpoch.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.epochs) {
            obj.epochs = message.epochs.map((e) => e ? exports.LeaderboardEpoch.toJSON(e) : undefined);
        }
        else {
            obj.epochs = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.LeaderboardEpochsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseLeaderboardEpochsResponse();
        message.epochs = ((_a = object.epochs) === null || _a === void 0 ? void 0 : _a.map((e) => exports.LeaderboardEpoch.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseLeaderboardEpoch() {
    return { epochId: 0, startAt: "0", endAt: "0", isLive: false };
}
exports.LeaderboardEpoch = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.epochId !== 0) {
            writer.uint32(8).uint32(message.epochId);
        }
        if (message.startAt !== "0") {
            writer.uint32(16).sint64(message.startAt);
        }
        if (message.endAt !== "0") {
            writer.uint32(24).sint64(message.endAt);
        }
        if (message.isLive === true) {
            writer.uint32(32).bool(message.isLive);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLeaderboardEpoch();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.epochId = reader.uint32();
                    break;
                case 2:
                    message.startAt = longToString(reader.sint64());
                    break;
                case 3:
                    message.endAt = longToString(reader.sint64());
                    break;
                case 4:
                    message.isLive = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            epochId: isSet(object.epochId) ? Number(object.epochId) : 0,
            startAt: isSet(object.startAt) ? String(object.startAt) : "0",
            endAt: isSet(object.endAt) ? String(object.endAt) : "0",
            isLive: isSet(object.isLive) ? Boolean(object.isLive) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.epochId !== undefined && (obj.epochId = Math.round(message.epochId));
        message.startAt !== undefined && (obj.startAt = message.startAt);
        message.endAt !== undefined && (obj.endAt = message.endAt);
        message.isLive !== undefined && (obj.isLive = message.isLive);
        return obj;
    },
    create(base) {
        return exports.LeaderboardEpoch.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseLeaderboardEpoch();
        message.epochId = (_a = object.epochId) !== null && _a !== void 0 ? _a : 0;
        message.startAt = (_b = object.startAt) !== null && _b !== void 0 ? _b : "0";
        message.endAt = (_c = object.endAt) !== null && _c !== void 0 ? _c : "0";
        message.isLive = (_d = object.isLive) !== null && _d !== void 0 ? _d : false;
        return message;
    },
};
function createBaseTransfersHistoryRequest() {
    return { vault: undefined, account: undefined, limit: undefined, fromNumber: undefined, toNumber: undefined };
}
exports.TransfersHistoryRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vault !== undefined) {
            writer.uint32(10).string(message.vault);
        }
        if (message.account !== undefined) {
            writer.uint32(18).string(message.account);
        }
        if (message.limit !== undefined) {
            writer.uint32(24).uint32(message.limit);
        }
        if (message.fromNumber !== undefined) {
            writer.uint32(32).uint32(message.fromNumber);
        }
        if (message.toNumber !== undefined) {
            writer.uint32(40).uint32(message.toNumber);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransfersHistoryRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vault = reader.string();
                    break;
                case 2:
                    message.account = reader.string();
                    break;
                case 3:
                    message.limit = reader.uint32();
                    break;
                case 4:
                    message.fromNumber = reader.uint32();
                    break;
                case 5:
                    message.toNumber = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vault: isSet(object.vault) ? String(object.vault) : undefined,
            account: isSet(object.account) ? String(object.account) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            fromNumber: isSet(object.fromNumber) ? Number(object.fromNumber) : undefined,
            toNumber: isSet(object.toNumber) ? Number(object.toNumber) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vault !== undefined && (obj.vault = message.vault);
        message.account !== undefined && (obj.account = message.account);
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.fromNumber !== undefined && (obj.fromNumber = Math.round(message.fromNumber));
        message.toNumber !== undefined && (obj.toNumber = Math.round(message.toNumber));
        return obj;
    },
    create(base) {
        return exports.TransfersHistoryRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseTransfersHistoryRequest();
        message.vault = (_a = object.vault) !== null && _a !== void 0 ? _a : undefined;
        message.account = (_b = object.account) !== null && _b !== void 0 ? _b : undefined;
        message.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : undefined;
        message.fromNumber = (_d = object.fromNumber) !== null && _d !== void 0 ? _d : undefined;
        message.toNumber = (_e = object.toNumber) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseTransfersHistoryResponse() {
    return { transfers: [], pagination: undefined };
}
exports.TransfersHistoryResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.transfers) {
            exports.Transfer.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransfersHistoryResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.transfers.push(exports.Transfer.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            transfers: Array.isArray(object === null || object === void 0 ? void 0 : object.transfers) ? object.transfers.map((e) => exports.Transfer.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.transfers) {
            obj.transfers = message.transfers.map((e) => e ? exports.Transfer.toJSON(e) : undefined);
        }
        else {
            obj.transfers = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.TransfersHistoryResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTransfersHistoryResponse();
        message.transfers = ((_a = object.transfers) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Transfer.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseTransfer() {
    return {
        lpAmount: "",
        coins: [],
        usdValue: "",
        isDeposit: false,
        executedAt: "0",
        account: "",
        vault: "",
        txHash: "",
        tidByVault: 0,
        tidByAccount: 0,
    };
}
exports.Transfer = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.lpAmount !== "") {
            writer.uint32(10).string(message.lpAmount);
        }
        for (const v of message.coins) {
            exports.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.usdValue !== "") {
            writer.uint32(26).string(message.usdValue);
        }
        if (message.isDeposit === true) {
            writer.uint32(32).bool(message.isDeposit);
        }
        if (message.executedAt !== "0") {
            writer.uint32(40).sint64(message.executedAt);
        }
        if (message.account !== "") {
            writer.uint32(50).string(message.account);
        }
        if (message.vault !== "") {
            writer.uint32(58).string(message.vault);
        }
        if (message.txHash !== "") {
            writer.uint32(66).string(message.txHash);
        }
        if (message.tidByVault !== 0) {
            writer.uint32(72).uint32(message.tidByVault);
        }
        if (message.tidByAccount !== 0) {
            writer.uint32(80).uint32(message.tidByAccount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransfer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.lpAmount = reader.string();
                    break;
                case 2:
                    message.coins.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.usdValue = reader.string();
                    break;
                case 4:
                    message.isDeposit = reader.bool();
                    break;
                case 5:
                    message.executedAt = longToString(reader.sint64());
                    break;
                case 6:
                    message.account = reader.string();
                    break;
                case 7:
                    message.vault = reader.string();
                    break;
                case 8:
                    message.txHash = reader.string();
                    break;
                case 9:
                    message.tidByVault = reader.uint32();
                    break;
                case 10:
                    message.tidByAccount = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            lpAmount: isSet(object.lpAmount) ? String(object.lpAmount) : "",
            coins: Array.isArray(object === null || object === void 0 ? void 0 : object.coins) ? object.coins.map((e) => exports.Coin.fromJSON(e)) : [],
            usdValue: isSet(object.usdValue) ? String(object.usdValue) : "",
            isDeposit: isSet(object.isDeposit) ? Boolean(object.isDeposit) : false,
            executedAt: isSet(object.executedAt) ? String(object.executedAt) : "0",
            account: isSet(object.account) ? String(object.account) : "",
            vault: isSet(object.vault) ? String(object.vault) : "",
            txHash: isSet(object.txHash) ? String(object.txHash) : "",
            tidByVault: isSet(object.tidByVault) ? Number(object.tidByVault) : 0,
            tidByAccount: isSet(object.tidByAccount) ? Number(object.tidByAccount) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.lpAmount !== undefined && (obj.lpAmount = message.lpAmount);
        if (message.coins) {
            obj.coins = message.coins.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.coins = [];
        }
        message.usdValue !== undefined && (obj.usdValue = message.usdValue);
        message.isDeposit !== undefined && (obj.isDeposit = message.isDeposit);
        message.executedAt !== undefined && (obj.executedAt = message.executedAt);
        message.account !== undefined && (obj.account = message.account);
        message.vault !== undefined && (obj.vault = message.vault);
        message.txHash !== undefined && (obj.txHash = message.txHash);
        message.tidByVault !== undefined && (obj.tidByVault = Math.round(message.tidByVault));
        message.tidByAccount !== undefined && (obj.tidByAccount = Math.round(message.tidByAccount));
        return obj;
    },
    create(base) {
        return exports.Transfer.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseTransfer();
        message.lpAmount = (_a = object.lpAmount) !== null && _a !== void 0 ? _a : "";
        message.coins = ((_b = object.coins) === null || _b === void 0 ? void 0 : _b.map((e) => exports.Coin.fromPartial(e))) || [];
        message.usdValue = (_c = object.usdValue) !== null && _c !== void 0 ? _c : "";
        message.isDeposit = (_d = object.isDeposit) !== null && _d !== void 0 ? _d : false;
        message.executedAt = (_e = object.executedAt) !== null && _e !== void 0 ? _e : "0";
        message.account = (_f = object.account) !== null && _f !== void 0 ? _f : "";
        message.vault = (_g = object.vault) !== null && _g !== void 0 ? _g : "";
        message.txHash = (_h = object.txHash) !== null && _h !== void 0 ? _h : "";
        message.tidByVault = (_j = object.tidByVault) !== null && _j !== void 0 ? _j : 0;
        message.tidByAccount = (_k = object.tidByAccount) !== null && _k !== void 0 ? _k : 0;
        return message;
    },
};
function createBaseCoin() {
    return { amount: "", denom: "" };
}
exports.Coin = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.amount !== "") {
            writer.uint32(10).string(message.amount);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCoin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.amount = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            amount: isSet(object.amount) ? String(object.amount) : "",
            denom: isSet(object.denom) ? String(object.denom) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.amount !== undefined && (obj.amount = message.amount);
        message.denom !== undefined && (obj.denom = message.denom);
        return obj;
    },
    create(base) {
        return exports.Coin.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCoin();
        message.amount = (_a = object.amount) !== null && _a !== void 0 ? _a : "";
        message.denom = (_b = object.denom) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseGetStakingPoolsRequest() {
    return { staker: undefined, stakingContractAddress: "" };
}
exports.GetStakingPoolsRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.staker !== undefined) {
            writer.uint32(10).string(message.staker);
        }
        if (message.stakingContractAddress !== "") {
            writer.uint32(18).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetStakingPoolsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staker = reader.string();
                    break;
                case 2:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            staker: isSet(object.staker) ? String(object.staker) : undefined,
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.staker !== undefined && (obj.staker = message.staker);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.GetStakingPoolsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetStakingPoolsRequest();
        message.staker = (_a = object.staker) !== null && _a !== void 0 ? _a : undefined;
        message.stakingContractAddress = (_b = object.stakingContractAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseGetStakingPoolsResponse() {
    return { pools: [], pagination: undefined };
}
exports.GetStakingPoolsResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.pools) {
            exports.StakingPool.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetStakingPoolsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pools.push(exports.StakingPool.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pools: Array.isArray(object === null || object === void 0 ? void 0 : object.pools) ? object.pools.map((e) => exports.StakingPool.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.pools) {
            obj.pools = message.pools.map((e) => e ? exports.StakingPool.toJSON(e) : undefined);
        }
        else {
            obj.pools = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetStakingPoolsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetStakingPoolsResponse();
        message.pools = ((_a = object.pools) === null || _a === void 0 ? void 0 : _a.map((e) => exports.StakingPool.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseStakingPool() {
    return {
        vaultName: "",
        vaultAddress: "",
        stakeDenom: "",
        gauges: [],
        apr: 0,
        totalLiquidity: 0,
        stakingAddress: "",
        aprBreakdown: {},
    };
}
exports.StakingPool = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vaultName !== "") {
            writer.uint32(10).string(message.vaultName);
        }
        if (message.vaultAddress !== "") {
            writer.uint32(18).string(message.vaultAddress);
        }
        if (message.stakeDenom !== "") {
            writer.uint32(26).string(message.stakeDenom);
        }
        for (const v of message.gauges) {
            exports.Gauge.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.apr !== 0) {
            writer.uint32(41).double(message.apr);
        }
        if (message.totalLiquidity !== 0) {
            writer.uint32(49).double(message.totalLiquidity);
        }
        if (message.stakingAddress !== "") {
            writer.uint32(58).string(message.stakingAddress);
        }
        Object.entries(message.aprBreakdown).forEach(([key, value]) => {
            exports.StakingPool_AprBreakdownEntry.encode({ key: key, value }, writer.uint32(66).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingPool();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaultName = reader.string();
                    break;
                case 2:
                    message.vaultAddress = reader.string();
                    break;
                case 3:
                    message.stakeDenom = reader.string();
                    break;
                case 4:
                    message.gauges.push(exports.Gauge.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.apr = reader.double();
                    break;
                case 6:
                    message.totalLiquidity = reader.double();
                    break;
                case 7:
                    message.stakingAddress = reader.string();
                    break;
                case 8:
                    const entry8 = exports.StakingPool_AprBreakdownEntry.decode(reader, reader.uint32());
                    if (entry8.value !== undefined) {
                        message.aprBreakdown[entry8.key] = entry8.value;
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaultName: isSet(object.vaultName) ? String(object.vaultName) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            stakeDenom: isSet(object.stakeDenom) ? String(object.stakeDenom) : "",
            gauges: Array.isArray(object === null || object === void 0 ? void 0 : object.gauges) ? object.gauges.map((e) => exports.Gauge.fromJSON(e)) : [],
            apr: isSet(object.apr) ? Number(object.apr) : 0,
            totalLiquidity: isSet(object.totalLiquidity) ? Number(object.totalLiquidity) : 0,
            stakingAddress: isSet(object.stakingAddress) ? String(object.stakingAddress) : "",
            aprBreakdown: isObject(object.aprBreakdown)
                ? Object.entries(object.aprBreakdown).reduce((acc, [key, value]) => {
                    acc[key] = Number(value);
                    return acc;
                }, {})
                : {},
        };
    },
    toJSON(message) {
        const obj = {};
        message.vaultName !== undefined && (obj.vaultName = message.vaultName);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.stakeDenom !== undefined && (obj.stakeDenom = message.stakeDenom);
        if (message.gauges) {
            obj.gauges = message.gauges.map((e) => e ? exports.Gauge.toJSON(e) : undefined);
        }
        else {
            obj.gauges = [];
        }
        message.apr !== undefined && (obj.apr = message.apr);
        message.totalLiquidity !== undefined && (obj.totalLiquidity = message.totalLiquidity);
        message.stakingAddress !== undefined && (obj.stakingAddress = message.stakingAddress);
        obj.aprBreakdown = {};
        if (message.aprBreakdown) {
            Object.entries(message.aprBreakdown).forEach(([k, v]) => {
                obj.aprBreakdown[k] = v;
            });
        }
        return obj;
    },
    create(base) {
        return exports.StakingPool.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseStakingPool();
        message.vaultName = (_a = object.vaultName) !== null && _a !== void 0 ? _a : "";
        message.vaultAddress = (_b = object.vaultAddress) !== null && _b !== void 0 ? _b : "";
        message.stakeDenom = (_c = object.stakeDenom) !== null && _c !== void 0 ? _c : "";
        message.gauges = ((_d = object.gauges) === null || _d === void 0 ? void 0 : _d.map((e) => exports.Gauge.fromPartial(e))) || [];
        message.apr = (_e = object.apr) !== null && _e !== void 0 ? _e : 0;
        message.totalLiquidity = (_f = object.totalLiquidity) !== null && _f !== void 0 ? _f : 0;
        message.stakingAddress = (_g = object.stakingAddress) !== null && _g !== void 0 ? _g : "";
        message.aprBreakdown = Object.entries((_h = object.aprBreakdown) !== null && _h !== void 0 ? _h : {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = Number(value);
            }
            return acc;
        }, {});
        return message;
    },
};
function createBaseStakingPool_AprBreakdownEntry() {
    return { key: "", value: 0 };
}
exports.StakingPool_AprBreakdownEntry = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(17).double(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingPool_AprBreakdownEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    create(base) {
        return exports.StakingPool_AprBreakdownEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStakingPool_AprBreakdownEntry();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBaseGauge() {
    return {
        id: "",
        owner: "",
        startTimestamp: "0",
        endTimestamp: "0",
        rewardTokens: [],
        lastDistribution: 0,
        status: "",
    };
}
exports.Gauge = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.owner !== "") {
            writer.uint32(18).string(message.owner);
        }
        if (message.startTimestamp !== "0") {
            writer.uint32(24).sint64(message.startTimestamp);
        }
        if (message.endTimestamp !== "0") {
            writer.uint32(32).sint64(message.endTimestamp);
        }
        for (const v of message.rewardTokens) {
            exports.Coin.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.lastDistribution !== 0) {
            writer.uint32(48).uint32(message.lastDistribution);
        }
        if (message.status !== "") {
            writer.uint32(58).string(message.status);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGauge();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.owner = reader.string();
                    break;
                case 3:
                    message.startTimestamp = longToString(reader.sint64());
                    break;
                case 4:
                    message.endTimestamp = longToString(reader.sint64());
                    break;
                case 5:
                    message.rewardTokens.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.lastDistribution = reader.uint32();
                    break;
                case 7:
                    message.status = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            owner: isSet(object.owner) ? String(object.owner) : "",
            startTimestamp: isSet(object.startTimestamp) ? String(object.startTimestamp) : "0",
            endTimestamp: isSet(object.endTimestamp) ? String(object.endTimestamp) : "0",
            rewardTokens: Array.isArray(object === null || object === void 0 ? void 0 : object.rewardTokens) ? object.rewardTokens.map((e) => exports.Coin.fromJSON(e)) : [],
            lastDistribution: isSet(object.lastDistribution) ? Number(object.lastDistribution) : 0,
            status: isSet(object.status) ? String(object.status) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.owner !== undefined && (obj.owner = message.owner);
        message.startTimestamp !== undefined && (obj.startTimestamp = message.startTimestamp);
        message.endTimestamp !== undefined && (obj.endTimestamp = message.endTimestamp);
        if (message.rewardTokens) {
            obj.rewardTokens = message.rewardTokens.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.rewardTokens = [];
        }
        message.lastDistribution !== undefined && (obj.lastDistribution = Math.round(message.lastDistribution));
        message.status !== undefined && (obj.status = message.status);
        return obj;
    },
    create(base) {
        return exports.Gauge.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseGauge();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.owner = (_b = object.owner) !== null && _b !== void 0 ? _b : "";
        message.startTimestamp = (_c = object.startTimestamp) !== null && _c !== void 0 ? _c : "0";
        message.endTimestamp = (_d = object.endTimestamp) !== null && _d !== void 0 ? _d : "0";
        message.rewardTokens = ((_e = object.rewardTokens) === null || _e === void 0 ? void 0 : _e.map((e) => exports.Coin.fromPartial(e))) || [];
        message.lastDistribution = (_f = object.lastDistribution) !== null && _f !== void 0 ? _f : 0;
        message.status = (_g = object.status) !== null && _g !== void 0 ? _g : "";
        return message;
    },
};
function createBaseStakingRewardByAccountRequest() {
    return { staker: "", stakingContractAddress: "" };
}
exports.StakingRewardByAccountRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.staker !== "") {
            writer.uint32(10).string(message.staker);
        }
        if (message.stakingContractAddress !== "") {
            writer.uint32(18).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingRewardByAccountRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staker = reader.string();
                    break;
                case 2:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            staker: isSet(object.staker) ? String(object.staker) : "",
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.staker !== undefined && (obj.staker = message.staker);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.StakingRewardByAccountRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStakingRewardByAccountRequest();
        message.staker = (_a = object.staker) !== null && _a !== void 0 ? _a : "";
        message.stakingContractAddress = (_b = object.stakingContractAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseStakingRewardByAccountResponse() {
    return { rewards: [], pagination: undefined };
}
exports.StakingRewardByAccountResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.rewards) {
            exports.StakingReward.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingRewardByAccountResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.rewards.push(exports.StakingReward.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            rewards: Array.isArray(object === null || object === void 0 ? void 0 : object.rewards) ? object.rewards.map((e) => exports.StakingReward.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.rewards) {
            obj.rewards = message.rewards.map((e) => e ? exports.StakingReward.toJSON(e) : undefined);
        }
        else {
            obj.rewards = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.StakingRewardByAccountResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStakingRewardByAccountResponse();
        message.rewards = ((_a = object.rewards) === null || _a === void 0 ? void 0 : _a.map((e) => exports.StakingReward.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseStakingReward() {
    return {
        vaultName: "",
        vaultAddress: "",
        stakedAmount: undefined,
        apr: 0,
        claimableRewards: [],
        lockTimestamp: "0",
        lockedAmount: undefined,
    };
}
exports.StakingReward = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vaultName !== "") {
            writer.uint32(10).string(message.vaultName);
        }
        if (message.vaultAddress !== "") {
            writer.uint32(18).string(message.vaultAddress);
        }
        if (message.stakedAmount !== undefined) {
            exports.Coin.encode(message.stakedAmount, writer.uint32(26).fork()).ldelim();
        }
        if (message.apr !== 0) {
            writer.uint32(33).double(message.apr);
        }
        for (const v of message.claimableRewards) {
            exports.Coin.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.lockTimestamp !== "0") {
            writer.uint32(48).sint64(message.lockTimestamp);
        }
        if (message.lockedAmount !== undefined) {
            exports.Coin.encode(message.lockedAmount, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingReward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vaultName = reader.string();
                    break;
                case 2:
                    message.vaultAddress = reader.string();
                    break;
                case 3:
                    message.stakedAmount = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.apr = reader.double();
                    break;
                case 5:
                    message.claimableRewards.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.lockTimestamp = longToString(reader.sint64());
                    break;
                case 7:
                    message.lockedAmount = exports.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vaultName: isSet(object.vaultName) ? String(object.vaultName) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            stakedAmount: isSet(object.stakedAmount) ? exports.Coin.fromJSON(object.stakedAmount) : undefined,
            apr: isSet(object.apr) ? Number(object.apr) : 0,
            claimableRewards: Array.isArray(object === null || object === void 0 ? void 0 : object.claimableRewards)
                ? object.claimableRewards.map((e) => exports.Coin.fromJSON(e))
                : [],
            lockTimestamp: isSet(object.lockTimestamp) ? String(object.lockTimestamp) : "0",
            lockedAmount: isSet(object.lockedAmount) ? exports.Coin.fromJSON(object.lockedAmount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vaultName !== undefined && (obj.vaultName = message.vaultName);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.stakedAmount !== undefined &&
            (obj.stakedAmount = message.stakedAmount ? exports.Coin.toJSON(message.stakedAmount) : undefined);
        message.apr !== undefined && (obj.apr = message.apr);
        if (message.claimableRewards) {
            obj.claimableRewards = message.claimableRewards.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.claimableRewards = [];
        }
        message.lockTimestamp !== undefined && (obj.lockTimestamp = message.lockTimestamp);
        message.lockedAmount !== undefined &&
            (obj.lockedAmount = message.lockedAmount ? exports.Coin.toJSON(message.lockedAmount) : undefined);
        return obj;
    },
    create(base) {
        return exports.StakingReward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseStakingReward();
        message.vaultName = (_a = object.vaultName) !== null && _a !== void 0 ? _a : "";
        message.vaultAddress = (_b = object.vaultAddress) !== null && _b !== void 0 ? _b : "";
        message.stakedAmount = (object.stakedAmount !== undefined && object.stakedAmount !== null)
            ? exports.Coin.fromPartial(object.stakedAmount)
            : undefined;
        message.apr = (_c = object.apr) !== null && _c !== void 0 ? _c : 0;
        message.claimableRewards = ((_d = object.claimableRewards) === null || _d === void 0 ? void 0 : _d.map((e) => exports.Coin.fromPartial(e))) || [];
        message.lockTimestamp = (_e = object.lockTimestamp) !== null && _e !== void 0 ? _e : "0";
        message.lockedAmount = (object.lockedAmount !== undefined && object.lockedAmount !== null)
            ? exports.Coin.fromPartial(object.lockedAmount)
            : undefined;
        return message;
    },
};
function createBaseStakingHistoryRequest() {
    return { fromNumber: undefined, toNumber: undefined, limit: undefined, staker: undefined };
}
exports.StakingHistoryRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.fromNumber !== undefined) {
            writer.uint32(8).uint32(message.fromNumber);
        }
        if (message.toNumber !== undefined) {
            writer.uint32(16).uint32(message.toNumber);
        }
        if (message.limit !== undefined) {
            writer.uint32(24).uint32(message.limit);
        }
        if (message.staker !== undefined) {
            writer.uint32(34).string(message.staker);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingHistoryRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.fromNumber = reader.uint32();
                    break;
                case 2:
                    message.toNumber = reader.uint32();
                    break;
                case 3:
                    message.limit = reader.uint32();
                    break;
                case 4:
                    message.staker = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            fromNumber: isSet(object.fromNumber) ? Number(object.fromNumber) : undefined,
            toNumber: isSet(object.toNumber) ? Number(object.toNumber) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            staker: isSet(object.staker) ? String(object.staker) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.fromNumber !== undefined && (obj.fromNumber = Math.round(message.fromNumber));
        message.toNumber !== undefined && (obj.toNumber = Math.round(message.toNumber));
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.staker !== undefined && (obj.staker = message.staker);
        return obj;
    },
    create(base) {
        return exports.StakingHistoryRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseStakingHistoryRequest();
        message.fromNumber = (_a = object.fromNumber) !== null && _a !== void 0 ? _a : undefined;
        message.toNumber = (_b = object.toNumber) !== null && _b !== void 0 ? _b : undefined;
        message.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : undefined;
        message.staker = (_d = object.staker) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseStakingHistoryResponse() {
    return { activities: [], pagination: undefined };
}
exports.StakingHistoryResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.activities) {
            exports.StakingActivity.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingHistoryResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.activities.push(exports.StakingActivity.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            activities: Array.isArray(object === null || object === void 0 ? void 0 : object.activities)
                ? object.activities.map((e) => exports.StakingActivity.fromJSON(e))
                : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.activities) {
            obj.activities = message.activities.map((e) => e ? exports.StakingActivity.toJSON(e) : undefined);
        }
        else {
            obj.activities = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.StakingHistoryResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStakingHistoryResponse();
        message.activities = ((_a = object.activities) === null || _a === void 0 ? void 0 : _a.map((e) => exports.StakingActivity.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseStakingActivity() {
    return {
        stakeAmount: undefined,
        vaultAddress: "",
        action: "",
        txHash: "",
        rewardedTokens: [],
        timestamp: "0",
        staker: "",
        numberByAccount: 0,
    };
}
exports.StakingActivity = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.stakeAmount !== undefined) {
            exports.Coin.encode(message.stakeAmount, writer.uint32(10).fork()).ldelim();
        }
        if (message.vaultAddress !== "") {
            writer.uint32(18).string(message.vaultAddress);
        }
        if (message.action !== "") {
            writer.uint32(26).string(message.action);
        }
        if (message.txHash !== "") {
            writer.uint32(34).string(message.txHash);
        }
        for (const v of message.rewardedTokens) {
            exports.Coin.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.timestamp !== "0") {
            writer.uint32(48).sint64(message.timestamp);
        }
        if (message.staker !== "") {
            writer.uint32(58).string(message.staker);
        }
        if (message.numberByAccount !== 0) {
            writer.uint32(64).uint32(message.numberByAccount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingActivity();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.stakeAmount = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.vaultAddress = reader.string();
                    break;
                case 3:
                    message.action = reader.string();
                    break;
                case 4:
                    message.txHash = reader.string();
                    break;
                case 5:
                    message.rewardedTokens.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.timestamp = longToString(reader.sint64());
                    break;
                case 7:
                    message.staker = reader.string();
                    break;
                case 8:
                    message.numberByAccount = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            stakeAmount: isSet(object.stakeAmount) ? exports.Coin.fromJSON(object.stakeAmount) : undefined,
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            action: isSet(object.action) ? String(object.action) : "",
            txHash: isSet(object.txHash) ? String(object.txHash) : "",
            rewardedTokens: Array.isArray(object === null || object === void 0 ? void 0 : object.rewardedTokens)
                ? object.rewardedTokens.map((e) => exports.Coin.fromJSON(e))
                : [],
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
            staker: isSet(object.staker) ? String(object.staker) : "",
            numberByAccount: isSet(object.numberByAccount) ? Number(object.numberByAccount) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.stakeAmount !== undefined &&
            (obj.stakeAmount = message.stakeAmount ? exports.Coin.toJSON(message.stakeAmount) : undefined);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.action !== undefined && (obj.action = message.action);
        message.txHash !== undefined && (obj.txHash = message.txHash);
        if (message.rewardedTokens) {
            obj.rewardedTokens = message.rewardedTokens.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.rewardedTokens = [];
        }
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.staker !== undefined && (obj.staker = message.staker);
        message.numberByAccount !== undefined && (obj.numberByAccount = Math.round(message.numberByAccount));
        return obj;
    },
    create(base) {
        return exports.StakingActivity.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseStakingActivity();
        message.stakeAmount = (object.stakeAmount !== undefined && object.stakeAmount !== null)
            ? exports.Coin.fromPartial(object.stakeAmount)
            : undefined;
        message.vaultAddress = (_a = object.vaultAddress) !== null && _a !== void 0 ? _a : "";
        message.action = (_b = object.action) !== null && _b !== void 0 ? _b : "";
        message.txHash = (_c = object.txHash) !== null && _c !== void 0 ? _c : "";
        message.rewardedTokens = ((_d = object.rewardedTokens) === null || _d === void 0 ? void 0 : _d.map((e) => exports.Coin.fromPartial(e))) || [];
        message.timestamp = (_e = object.timestamp) !== null && _e !== void 0 ? _e : "0";
        message.staker = (_f = object.staker) !== null && _f !== void 0 ? _f : "";
        message.numberByAccount = (_g = object.numberByAccount) !== null && _g !== void 0 ? _g : 0;
        return message;
    },
};
function createBaseStakingAmountAtHeightRequest() {
    return {
        stakingContractAddress: "",
        denom: "",
        height: undefined,
        staker: undefined,
        skip: undefined,
        limit: undefined,
    };
}
exports.StakingAmountAtHeightRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.stakingContractAddress !== "") {
            writer.uint32(10).string(message.stakingContractAddress);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        if (message.height !== undefined) {
            writer.uint32(24).uint64(message.height);
        }
        if (message.staker !== undefined) {
            writer.uint32(34).string(message.staker);
        }
        if (message.skip !== undefined) {
            writer.uint32(40).sint32(message.skip);
        }
        if (message.limit !== undefined) {
            writer.uint32(48).uint32(message.limit);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingAmountAtHeightRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.stakingContractAddress = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                case 3:
                    message.height = longToString(reader.uint64());
                    break;
                case 4:
                    message.staker = reader.string();
                    break;
                case 5:
                    message.skip = reader.sint32();
                    break;
                case 6:
                    message.limit = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
            denom: isSet(object.denom) ? String(object.denom) : "",
            height: isSet(object.height) ? String(object.height) : undefined,
            staker: isSet(object.staker) ? String(object.staker) : undefined,
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        message.denom !== undefined && (obj.denom = message.denom);
        message.height !== undefined && (obj.height = message.height);
        message.staker !== undefined && (obj.staker = message.staker);
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        return obj;
    },
    create(base) {
        return exports.StakingAmountAtHeightRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseStakingAmountAtHeightRequest();
        message.stakingContractAddress = (_a = object.stakingContractAddress) !== null && _a !== void 0 ? _a : "";
        message.denom = (_b = object.denom) !== null && _b !== void 0 ? _b : "";
        message.height = (_c = object.height) !== null && _c !== void 0 ? _c : undefined;
        message.staker = (_d = object.staker) !== null && _d !== void 0 ? _d : undefined;
        message.skip = (_e = object.skip) !== null && _e !== void 0 ? _e : undefined;
        message.limit = (_f = object.limit) !== null && _f !== void 0 ? _f : undefined;
        return message;
    },
};
function createBaseStakingAmountAtHeightResponse() {
    return { stakers: [] };
}
exports.StakingAmountAtHeightResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.stakers) {
            exports.StakingAmount.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingAmountAtHeightResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.stakers.push(exports.StakingAmount.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { stakers: Array.isArray(object === null || object === void 0 ? void 0 : object.stakers) ? object.stakers.map((e) => exports.StakingAmount.fromJSON(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.stakers) {
            obj.stakers = message.stakers.map((e) => e ? exports.StakingAmount.toJSON(e) : undefined);
        }
        else {
            obj.stakers = [];
        }
        return obj;
    },
    create(base) {
        return exports.StakingAmountAtHeightResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStakingAmountAtHeightResponse();
        message.stakers = ((_a = object.stakers) === null || _a === void 0 ? void 0 : _a.map((e) => exports.StakingAmount.fromPartial(e))) || [];
        return message;
    },
};
function createBaseStakingAmount() {
    return { staker: "", amount: undefined, latestHeight: "0" };
}
exports.StakingAmount = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.staker !== "") {
            writer.uint32(10).string(message.staker);
        }
        if (message.amount !== undefined) {
            exports.Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
        }
        if (message.latestHeight !== "0") {
            writer.uint32(24).uint64(message.latestHeight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakingAmount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staker = reader.string();
                    break;
                case 2:
                    message.amount = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.latestHeight = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            staker: isSet(object.staker) ? String(object.staker) : "",
            amount: isSet(object.amount) ? exports.Coin.fromJSON(object.amount) : undefined,
            latestHeight: isSet(object.latestHeight) ? String(object.latestHeight) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.staker !== undefined && (obj.staker = message.staker);
        message.amount !== undefined && (obj.amount = message.amount ? exports.Coin.toJSON(message.amount) : undefined);
        message.latestHeight !== undefined && (obj.latestHeight = message.latestHeight);
        return obj;
    },
    create(base) {
        return exports.StakingAmount.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStakingAmount();
        message.staker = (_a = object.staker) !== null && _a !== void 0 ? _a : "";
        message.amount = (object.amount !== undefined && object.amount !== null)
            ? exports.Coin.fromPartial(object.amount)
            : undefined;
        message.latestHeight = (_b = object.latestHeight) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseStreamTransfersRequest() {
    return { vault: undefined, account: undefined };
}
exports.StreamTransfersRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vault !== undefined) {
            writer.uint32(10).string(message.vault);
        }
        if (message.account !== undefined) {
            writer.uint32(18).string(message.account);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamTransfersRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vault = reader.string();
                    break;
                case 2:
                    message.account = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vault: isSet(object.vault) ? String(object.vault) : undefined,
            account: isSet(object.account) ? String(object.account) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vault !== undefined && (obj.vault = message.vault);
        message.account !== undefined && (obj.account = message.account);
        return obj;
    },
    create(base) {
        return exports.StreamTransfersRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStreamTransfersRequest();
        message.vault = (_a = object.vault) !== null && _a !== void 0 ? _a : undefined;
        message.account = (_b = object.account) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseStreamTransfersResponse() {
    return { data: undefined, opType: undefined };
}
exports.StreamTransfersResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== undefined) {
            exports.Transfer.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.opType !== undefined) {
            writer.uint32(18).string(message.opType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamTransfersResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = exports.Transfer.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.opType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? exports.Transfer.fromJSON(object.data) : undefined,
            opType: isSet(object.opType) ? String(object.opType) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? exports.Transfer.toJSON(message.data) : undefined);
        message.opType !== undefined && (obj.opType = message.opType);
        return obj;
    },
    create(base) {
        return exports.StreamTransfersResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamTransfersResponse();
        message.data = (object.data !== undefined && object.data !== null) ? exports.Transfer.fromPartial(object.data) : undefined;
        message.opType = (_a = object.opType) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseStreamVaultRequest() {
    return { vault: "" };
}
exports.StreamVaultRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vault !== "") {
            writer.uint32(10).string(message.vault);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamVaultRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vault = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { vault: isSet(object.vault) ? String(object.vault) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.vault !== undefined && (obj.vault = message.vault);
        return obj;
    },
    create(base) {
        return exports.StreamVaultRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamVaultRequest();
        message.vault = (_a = object.vault) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseStreamVaultResponse() {
    return { data: undefined, opType: undefined };
}
exports.StreamVaultResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== undefined) {
            exports.Vault.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.opType !== undefined) {
            writer.uint32(18).string(message.opType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamVaultResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = exports.Vault.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.opType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? exports.Vault.fromJSON(object.data) : undefined,
            opType: isSet(object.opType) ? String(object.opType) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? exports.Vault.toJSON(message.data) : undefined);
        message.opType !== undefined && (obj.opType = message.opType);
        return obj;
    },
    create(base) {
        return exports.StreamVaultResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamVaultResponse();
        message.data = (object.data !== undefined && object.data !== null) ? exports.Vault.fromPartial(object.data) : undefined;
        message.opType = (_a = object.opType) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseStreamHolderSubscriptionRequest() {
    return { holderAddress: "", vaultAddress: undefined, stakingContractAddress: "" };
}
exports.StreamHolderSubscriptionRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.holderAddress !== "") {
            writer.uint32(10).string(message.holderAddress);
        }
        if (message.vaultAddress !== undefined) {
            writer.uint32(18).string(message.vaultAddress);
        }
        if (message.stakingContractAddress !== "") {
            writer.uint32(26).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamHolderSubscriptionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.holderAddress = reader.string();
                    break;
                case 2:
                    message.vaultAddress = reader.string();
                    break;
                case 3:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            holderAddress: isSet(object.holderAddress) ? String(object.holderAddress) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : undefined,
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.holderAddress !== undefined && (obj.holderAddress = message.holderAddress);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.StreamHolderSubscriptionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseStreamHolderSubscriptionRequest();
        message.holderAddress = (_a = object.holderAddress) !== null && _a !== void 0 ? _a : "";
        message.vaultAddress = (_b = object.vaultAddress) !== null && _b !== void 0 ? _b : undefined;
        message.stakingContractAddress = (_c = object.stakingContractAddress) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseStreamHolderSubscriptionResponse() {
    return { data: undefined, opType: undefined };
}
exports.StreamHolderSubscriptionResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== undefined) {
            exports.Subscription.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.opType !== undefined) {
            writer.uint32(18).string(message.opType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamHolderSubscriptionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = exports.Subscription.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.opType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? exports.Subscription.fromJSON(object.data) : undefined,
            opType: isSet(object.opType) ? String(object.opType) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? exports.Subscription.toJSON(message.data) : undefined);
        message.opType !== undefined && (obj.opType = message.opType);
        return obj;
    },
    create(base) {
        return exports.StreamHolderSubscriptionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamHolderSubscriptionResponse();
        message.data = (object.data !== undefined && object.data !== null)
            ? exports.Subscription.fromPartial(object.data)
            : undefined;
        message.opType = (_a = object.opType) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseStreamStakingRewardByAccountRequest() {
    return { staker: "", stakingContractAddress: "" };
}
exports.StreamStakingRewardByAccountRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.staker !== "") {
            writer.uint32(10).string(message.staker);
        }
        if (message.stakingContractAddress !== "") {
            writer.uint32(18).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamStakingRewardByAccountRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staker = reader.string();
                    break;
                case 2:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            staker: isSet(object.staker) ? String(object.staker) : "",
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.staker !== undefined && (obj.staker = message.staker);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.StreamStakingRewardByAccountRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStreamStakingRewardByAccountRequest();
        message.staker = (_a = object.staker) !== null && _a !== void 0 ? _a : "";
        message.stakingContractAddress = (_b = object.stakingContractAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseStreamStakingRewardByAccountResponse() {
    return { data: undefined, opType: undefined };
}
exports.StreamStakingRewardByAccountResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== undefined) {
            exports.StakingReward.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.opType !== undefined) {
            writer.uint32(18).string(message.opType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamStakingRewardByAccountResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = exports.StakingReward.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.opType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? exports.StakingReward.fromJSON(object.data) : undefined,
            opType: isSet(object.opType) ? String(object.opType) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? exports.StakingReward.toJSON(message.data) : undefined);
        message.opType !== undefined && (obj.opType = message.opType);
        return obj;
    },
    create(base) {
        return exports.StreamStakingRewardByAccountResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamStakingRewardByAccountResponse();
        message.data = (object.data !== undefined && object.data !== null)
            ? exports.StakingReward.fromPartial(object.data)
            : undefined;
        message.opType = (_a = object.opType) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseStreamHistoricalStakingRequest() {
    return { staker: "", stakingContractAddress: "" };
}
exports.StreamHistoricalStakingRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.staker !== "") {
            writer.uint32(10).string(message.staker);
        }
        if (message.stakingContractAddress !== "") {
            writer.uint32(18).string(message.stakingContractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamHistoricalStakingRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.staker = reader.string();
                    break;
                case 2:
                    message.stakingContractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            staker: isSet(object.staker) ? String(object.staker) : "",
            stakingContractAddress: isSet(object.stakingContractAddress) ? String(object.stakingContractAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.staker !== undefined && (obj.staker = message.staker);
        message.stakingContractAddress !== undefined && (obj.stakingContractAddress = message.stakingContractAddress);
        return obj;
    },
    create(base) {
        return exports.StreamHistoricalStakingRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseStreamHistoricalStakingRequest();
        message.staker = (_a = object.staker) !== null && _a !== void 0 ? _a : "";
        message.stakingContractAddress = (_b = object.stakingContractAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseStreamHistoricalStakingResponse() {
    return { data: undefined, opType: undefined };
}
exports.StreamHistoricalStakingResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== undefined) {
            exports.StakingActivity.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.opType !== undefined) {
            writer.uint32(18).string(message.opType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamHistoricalStakingResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = exports.StakingActivity.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.opType = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? exports.StakingActivity.fromJSON(object.data) : undefined,
            opType: isSet(object.opType) ? String(object.opType) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? exports.StakingActivity.toJSON(message.data) : undefined);
        message.opType !== undefined && (obj.opType = message.opType);
        return obj;
    },
    create(base) {
        return exports.StreamHistoricalStakingResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStreamHistoricalStakingResponse();
        message.data = (object.data !== undefined && object.data !== null)
            ? exports.StakingActivity.fromPartial(object.data)
            : undefined;
        message.opType = (_a = object.opType) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseHealthRequest() {
    return {};
}
exports.HealthRequest = {
    encode(_, writer = minimal_js_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHealthRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.HealthRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseHealthRequest();
        return message;
    },
};
function createBaseHealthResponse() {
    return { version: "", commit: "", lastestSyncedBlock: "0", chainHeight: "0", status: "", blockDiffThreshold: 0 };
}
exports.HealthResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.version !== "") {
            writer.uint32(10).string(message.version);
        }
        if (message.commit !== "") {
            writer.uint32(18).string(message.commit);
        }
        if (message.lastestSyncedBlock !== "0") {
            writer.uint32(24).sint64(message.lastestSyncedBlock);
        }
        if (message.chainHeight !== "0") {
            writer.uint32(32).sint64(message.chainHeight);
        }
        if (message.status !== "") {
            writer.uint32(42).string(message.status);
        }
        if (message.blockDiffThreshold !== 0) {
            writer.uint32(48).sint32(message.blockDiffThreshold);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHealthResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.version = reader.string();
                    break;
                case 2:
                    message.commit = reader.string();
                    break;
                case 3:
                    message.lastestSyncedBlock = longToString(reader.sint64());
                    break;
                case 4:
                    message.chainHeight = longToString(reader.sint64());
                    break;
                case 5:
                    message.status = reader.string();
                    break;
                case 6:
                    message.blockDiffThreshold = reader.sint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            version: isSet(object.version) ? String(object.version) : "",
            commit: isSet(object.commit) ? String(object.commit) : "",
            lastestSyncedBlock: isSet(object.lastestSyncedBlock) ? String(object.lastestSyncedBlock) : "0",
            chainHeight: isSet(object.chainHeight) ? String(object.chainHeight) : "0",
            status: isSet(object.status) ? String(object.status) : "",
            blockDiffThreshold: isSet(object.blockDiffThreshold) ? Number(object.blockDiffThreshold) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.version !== undefined && (obj.version = message.version);
        message.commit !== undefined && (obj.commit = message.commit);
        message.lastestSyncedBlock !== undefined && (obj.lastestSyncedBlock = message.lastestSyncedBlock);
        message.chainHeight !== undefined && (obj.chainHeight = message.chainHeight);
        message.status !== undefined && (obj.status = message.status);
        message.blockDiffThreshold !== undefined && (obj.blockDiffThreshold = Math.round(message.blockDiffThreshold));
        return obj;
    },
    create(base) {
        return exports.HealthResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseHealthResponse();
        message.version = (_a = object.version) !== null && _a !== void 0 ? _a : "";
        message.commit = (_b = object.commit) !== null && _b !== void 0 ? _b : "";
        message.lastestSyncedBlock = (_c = object.lastestSyncedBlock) !== null && _c !== void 0 ? _c : "0";
        message.chainHeight = (_d = object.chainHeight) !== null && _d !== void 0 ? _d : "0";
        message.status = (_e = object.status) !== null && _e !== void 0 ? _e : "";
        message.blockDiffThreshold = (_f = object.blockDiffThreshold) !== null && _f !== void 0 ? _f : 0;
        return message;
    },
};
function createBaseExecutionRequest() {
    return { contractAddress: "" };
}
exports.ExecutionRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExecutionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        return obj;
    },
    create(base) {
        return exports.ExecutionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseExecutionRequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseExecutionResponse() {
    return {
        contractAddress: "",
        currentBlock: "0",
        lastExecutedBlock: "0",
        lastErrorBlock: "0",
        executionLogs: [],
        lastErrorLog: undefined,
    };
}
exports.ExecutionResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.currentBlock !== "0") {
            writer.uint32(16).sint64(message.currentBlock);
        }
        if (message.lastExecutedBlock !== "0") {
            writer.uint32(24).sint64(message.lastExecutedBlock);
        }
        if (message.lastErrorBlock !== "0") {
            writer.uint32(32).sint64(message.lastErrorBlock);
        }
        for (const v of message.executionLogs) {
            exports.ExecutionLog.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.lastErrorLog !== undefined) {
            exports.ExecutionLog.encode(message.lastErrorLog, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExecutionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.currentBlock = longToString(reader.sint64());
                    break;
                case 3:
                    message.lastExecutedBlock = longToString(reader.sint64());
                    break;
                case 4:
                    message.lastErrorBlock = longToString(reader.sint64());
                    break;
                case 5:
                    message.executionLogs.push(exports.ExecutionLog.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.lastErrorLog = exports.ExecutionLog.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            currentBlock: isSet(object.currentBlock) ? String(object.currentBlock) : "0",
            lastExecutedBlock: isSet(object.lastExecutedBlock) ? String(object.lastExecutedBlock) : "0",
            lastErrorBlock: isSet(object.lastErrorBlock) ? String(object.lastErrorBlock) : "0",
            executionLogs: Array.isArray(object === null || object === void 0 ? void 0 : object.executionLogs)
                ? object.executionLogs.map((e) => exports.ExecutionLog.fromJSON(e))
                : [],
            lastErrorLog: isSet(object.lastErrorLog) ? exports.ExecutionLog.fromJSON(object.lastErrorLog) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.currentBlock !== undefined && (obj.currentBlock = message.currentBlock);
        message.lastExecutedBlock !== undefined && (obj.lastExecutedBlock = message.lastExecutedBlock);
        message.lastErrorBlock !== undefined && (obj.lastErrorBlock = message.lastErrorBlock);
        if (message.executionLogs) {
            obj.executionLogs = message.executionLogs.map((e) => e ? exports.ExecutionLog.toJSON(e) : undefined);
        }
        else {
            obj.executionLogs = [];
        }
        message.lastErrorLog !== undefined &&
            (obj.lastErrorLog = message.lastErrorLog ? exports.ExecutionLog.toJSON(message.lastErrorLog) : undefined);
        return obj;
    },
    create(base) {
        return exports.ExecutionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseExecutionResponse();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        message.currentBlock = (_b = object.currentBlock) !== null && _b !== void 0 ? _b : "0";
        message.lastExecutedBlock = (_c = object.lastExecutedBlock) !== null && _c !== void 0 ? _c : "0";
        message.lastErrorBlock = (_d = object.lastErrorBlock) !== null && _d !== void 0 ? _d : "0";
        message.executionLogs = ((_e = object.executionLogs) === null || _e === void 0 ? void 0 : _e.map((e) => exports.ExecutionLog.fromPartial(e))) || [];
        message.lastErrorLog = (object.lastErrorLog !== undefined && object.lastErrorLog !== null)
            ? exports.ExecutionLog.fromPartial(object.lastErrorLog)
            : undefined;
        return message;
    },
};
function createBaseExecutionLog() {
    return { block: "0", response: "", error: "" };
}
exports.ExecutionLog = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.block !== "0") {
            writer.uint32(8).sint64(message.block);
        }
        if (message.response !== "") {
            writer.uint32(18).string(message.response);
        }
        if (message.error !== "") {
            writer.uint32(26).string(message.error);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExecutionLog();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.block = longToString(reader.sint64());
                    break;
                case 2:
                    message.response = reader.string();
                    break;
                case 3:
                    message.error = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            block: isSet(object.block) ? String(object.block) : "0",
            response: isSet(object.response) ? String(object.response) : "",
            error: isSet(object.error) ? String(object.error) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.block !== undefined && (obj.block = message.block);
        message.response !== undefined && (obj.response = message.response);
        message.error !== undefined && (obj.error = message.error);
        return obj;
    },
    create(base) {
        return exports.ExecutionLog.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseExecutionLog();
        message.block = (_a = object.block) !== null && _a !== void 0 ? _a : "0";
        message.response = (_b = object.response) !== null && _b !== void 0 ? _b : "";
        message.error = (_c = object.error) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseMissionsRequest() {
    return { accountAddress: "" };
}
exports.MissionsRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.accountAddress !== "") {
            writer.uint32(10).string(message.accountAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMissionsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        return obj;
    },
    create(base) {
        return exports.MissionsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMissionsRequest();
        message.accountAddress = (_a = object.accountAddress) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseMissionsResponse() {
    return { data: [], rank: undefined };
}
exports.MissionsResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.data) {
            exports.Mission.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.rank !== undefined) {
            writer.uint32(16).sint64(message.rank);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMissionsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data.push(exports.Mission.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.rank = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: Array.isArray(object === null || object === void 0 ? void 0 : object.data) ? object.data.map((e) => exports.Mission.fromJSON(e)) : [],
            rank: isSet(object.rank) ? String(object.rank) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.data) {
            obj.data = message.data.map((e) => e ? exports.Mission.toJSON(e) : undefined);
        }
        else {
            obj.data = [];
        }
        message.rank !== undefined && (obj.rank = message.rank);
        return obj;
    },
    create(base) {
        return exports.MissionsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMissionsResponse();
        message.data = ((_a = object.data) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Mission.fromPartial(e))) || [];
        message.rank = (_b = object.rank) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseMission() {
    return { id: "", points: "0", completed: false, accruedPoints: "0", updatedAt: "0", progress: 0, expected: 0 };
}
exports.Mission = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.points !== "0") {
            writer.uint32(16).sint64(message.points);
        }
        if (message.completed === true) {
            writer.uint32(24).bool(message.completed);
        }
        if (message.accruedPoints !== "0") {
            writer.uint32(32).sint64(message.accruedPoints);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(40).sint64(message.updatedAt);
        }
        if (message.progress !== 0) {
            writer.uint32(49).double(message.progress);
        }
        if (message.expected !== 0) {
            writer.uint32(57).double(message.expected);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMission();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.points = longToString(reader.sint64());
                    break;
                case 3:
                    message.completed = reader.bool();
                    break;
                case 4:
                    message.accruedPoints = longToString(reader.sint64());
                    break;
                case 5:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 6:
                    message.progress = reader.double();
                    break;
                case 7:
                    message.expected = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            points: isSet(object.points) ? String(object.points) : "0",
            completed: isSet(object.completed) ? Boolean(object.completed) : false,
            accruedPoints: isSet(object.accruedPoints) ? String(object.accruedPoints) : "0",
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            progress: isSet(object.progress) ? Number(object.progress) : 0,
            expected: isSet(object.expected) ? Number(object.expected) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.points !== undefined && (obj.points = message.points);
        message.completed !== undefined && (obj.completed = message.completed);
        message.accruedPoints !== undefined && (obj.accruedPoints = message.accruedPoints);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.progress !== undefined && (obj.progress = message.progress);
        message.expected !== undefined && (obj.expected = message.expected);
        return obj;
    },
    create(base) {
        return exports.Mission.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseMission();
        message.id = (_a = object.id) !== null && _a !== void 0 ? _a : "";
        message.points = (_b = object.points) !== null && _b !== void 0 ? _b : "0";
        message.completed = (_c = object.completed) !== null && _c !== void 0 ? _c : false;
        message.accruedPoints = (_d = object.accruedPoints) !== null && _d !== void 0 ? _d : "0";
        message.updatedAt = (_e = object.updatedAt) !== null && _e !== void 0 ? _e : "0";
        message.progress = (_f = object.progress) !== null && _f !== void 0 ? _f : 0;
        message.expected = (_g = object.expected) !== null && _g !== void 0 ? _g : 0;
        return message;
    },
};
function createBaseMissionLeaderboardRequest() {
    return { userAddress: undefined };
}
exports.MissionLeaderboardRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.userAddress !== undefined) {
            writer.uint32(10).string(message.userAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMissionLeaderboardRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.userAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { userAddress: isSet(object.userAddress) ? String(object.userAddress) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.userAddress !== undefined && (obj.userAddress = message.userAddress);
        return obj;
    },
    create(base) {
        return exports.MissionLeaderboardRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMissionLeaderboardRequest();
        message.userAddress = (_a = object.userAddress) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMissionLeaderboardResponse() {
    return { data: [], updatedAt: "0", userRank: undefined };
}
exports.MissionLeaderboardResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.data) {
            exports.MissionLeaderboardEntry.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.updatedAt !== "0") {
            writer.uint32(16).sint64(message.updatedAt);
        }
        if (message.userRank !== undefined) {
            writer.uint32(24).sint64(message.userRank);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMissionLeaderboardResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data.push(exports.MissionLeaderboardEntry.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 3:
                    message.userRank = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: Array.isArray(object === null || object === void 0 ? void 0 : object.data) ? object.data.map((e) => exports.MissionLeaderboardEntry.fromJSON(e)) : [],
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            userRank: isSet(object.userRank) ? String(object.userRank) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.data) {
            obj.data = message.data.map((e) => e ? exports.MissionLeaderboardEntry.toJSON(e) : undefined);
        }
        else {
            obj.data = [];
        }
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.userRank !== undefined && (obj.userRank = message.userRank);
        return obj;
    },
    create(base) {
        return exports.MissionLeaderboardResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMissionLeaderboardResponse();
        message.data = ((_a = object.data) === null || _a === void 0 ? void 0 : _a.map((e) => exports.MissionLeaderboardEntry.fromPartial(e))) || [];
        message.updatedAt = (_b = object.updatedAt) !== null && _b !== void 0 ? _b : "0";
        message.userRank = (_c = object.userRank) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseMissionLeaderboardEntry() {
    return { address: "", accruedPoints: "0" };
}
exports.MissionLeaderboardEntry = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.accruedPoints !== "0") {
            writer.uint32(16).sint64(message.accruedPoints);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMissionLeaderboardEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.accruedPoints = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            accruedPoints: isSet(object.accruedPoints) ? String(object.accruedPoints) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.accruedPoints !== undefined && (obj.accruedPoints = message.accruedPoints);
        return obj;
    },
    create(base) {
        return exports.MissionLeaderboardEntry.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMissionLeaderboardEntry();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.accruedPoints = (_b = object.accruedPoints) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseListIDOsRequest() {
    return {
        status: undefined,
        limit: undefined,
        toNumber: undefined,
        accountAddress: undefined,
        ownerAddress: undefined,
    };
}
exports.ListIDOsRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.status !== undefined) {
            writer.uint32(10).string(message.status);
        }
        if (message.limit !== undefined) {
            writer.uint32(16).sint32(message.limit);
        }
        if (message.toNumber !== undefined) {
            writer.uint32(24).sint32(message.toNumber);
        }
        if (message.accountAddress !== undefined) {
            writer.uint32(34).string(message.accountAddress);
        }
        if (message.ownerAddress !== undefined) {
            writer.uint32(42).string(message.ownerAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListIDOsRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.status = reader.string();
                    break;
                case 2:
                    message.limit = reader.sint32();
                    break;
                case 3:
                    message.toNumber = reader.sint32();
                    break;
                case 4:
                    message.accountAddress = reader.string();
                    break;
                case 5:
                    message.ownerAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            status: isSet(object.status) ? String(object.status) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            toNumber: isSet(object.toNumber) ? Number(object.toNumber) : undefined,
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : undefined,
            ownerAddress: isSet(object.ownerAddress) ? String(object.ownerAddress) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.status !== undefined && (obj.status = message.status);
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.toNumber !== undefined && (obj.toNumber = Math.round(message.toNumber));
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        message.ownerAddress !== undefined && (obj.ownerAddress = message.ownerAddress);
        return obj;
    },
    create(base) {
        return exports.ListIDOsRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseListIDOsRequest();
        message.status = (_a = object.status) !== null && _a !== void 0 ? _a : undefined;
        message.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : undefined;
        message.toNumber = (_c = object.toNumber) !== null && _c !== void 0 ? _c : undefined;
        message.accountAddress = (_d = object.accountAddress) !== null && _d !== void 0 ? _d : undefined;
        message.ownerAddress = (_e = object.ownerAddress) !== null && _e !== void 0 ? _e : undefined;
        return message;
    },
};
function createBaseListIDOsResponse() {
    return { idos: [], pagination: undefined };
}
exports.ListIDOsResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.idos) {
            exports.IDO.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseListIDOsResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.idos.push(exports.IDO.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            idos: Array.isArray(object === null || object === void 0 ? void 0 : object.idos) ? object.idos.map((e) => exports.IDO.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.idos) {
            obj.idos = message.idos.map((e) => e ? exports.IDO.toJSON(e) : undefined);
        }
        else {
            obj.idos = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.ListIDOsResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseListIDOsResponse();
        message.idos = ((_a = object.idos) === null || _a === void 0 ? void 0 : _a.map((e) => exports.IDO.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseIDO() {
    return {
        startTime: "0",
        endTime: "0",
        owner: "",
        status: "",
        tokenInfo: undefined,
        projectTokenAmount: "",
        quoteDenom: "",
        targetAmountInQuoteDenom: "",
        targetAmountInUsd: "",
        capPerAddress: "",
        contractAddress: "",
        subscribedAmount: "",
        tokenPrice: 0,
        isAccountWhiteListed: false,
        name: "",
        progress: [],
        stakeToSubscription: [],
        secondBeforeStartToSetQuotePrice: "0",
        useWhitelist: false,
        marketId: "",
        vaultAddress: "",
        isLaunchWithVault: false,
        isVestingScheduleEnabled: false,
        initParams: undefined,
    };
}
exports.IDO = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.startTime !== "0") {
            writer.uint32(8).sint64(message.startTime);
        }
        if (message.endTime !== "0") {
            writer.uint32(16).sint64(message.endTime);
        }
        if (message.owner !== "") {
            writer.uint32(26).string(message.owner);
        }
        if (message.status !== "") {
            writer.uint32(34).string(message.status);
        }
        if (message.tokenInfo !== undefined) {
            exports.TokenInfo.encode(message.tokenInfo, writer.uint32(42).fork()).ldelim();
        }
        if (message.projectTokenAmount !== "") {
            writer.uint32(50).string(message.projectTokenAmount);
        }
        if (message.quoteDenom !== "") {
            writer.uint32(58).string(message.quoteDenom);
        }
        if (message.targetAmountInQuoteDenom !== "") {
            writer.uint32(66).string(message.targetAmountInQuoteDenom);
        }
        if (message.targetAmountInUsd !== "") {
            writer.uint32(74).string(message.targetAmountInUsd);
        }
        if (message.capPerAddress !== "") {
            writer.uint32(82).string(message.capPerAddress);
        }
        if (message.contractAddress !== "") {
            writer.uint32(90).string(message.contractAddress);
        }
        if (message.subscribedAmount !== "") {
            writer.uint32(98).string(message.subscribedAmount);
        }
        if (message.tokenPrice !== 0) {
            writer.uint32(105).double(message.tokenPrice);
        }
        if (message.isAccountWhiteListed === true) {
            writer.uint32(112).bool(message.isAccountWhiteListed);
        }
        if (message.name !== "") {
            writer.uint32(122).string(message.name);
        }
        for (const v of message.progress) {
            exports.IDOProgress.encode(v, writer.uint32(130).fork()).ldelim();
        }
        for (const v of message.stakeToSubscription) {
            exports.ArrayOfString.encode(v, writer.uint32(138).fork()).ldelim();
        }
        if (message.secondBeforeStartToSetQuotePrice !== "0") {
            writer.uint32(144).sint64(message.secondBeforeStartToSetQuotePrice);
        }
        if (message.useWhitelist === true) {
            writer.uint32(152).bool(message.useWhitelist);
        }
        if (message.marketId !== "") {
            writer.uint32(162).string(message.marketId);
        }
        if (message.vaultAddress !== "") {
            writer.uint32(170).string(message.vaultAddress);
        }
        if (message.isLaunchWithVault === true) {
            writer.uint32(176).bool(message.isLaunchWithVault);
        }
        if (message.isVestingScheduleEnabled === true) {
            writer.uint32(184).bool(message.isVestingScheduleEnabled);
        }
        if (message.initParams !== undefined) {
            exports.InitParams.encode(message.initParams, writer.uint32(194).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.startTime = longToString(reader.sint64());
                    break;
                case 2:
                    message.endTime = longToString(reader.sint64());
                    break;
                case 3:
                    message.owner = reader.string();
                    break;
                case 4:
                    message.status = reader.string();
                    break;
                case 5:
                    message.tokenInfo = exports.TokenInfo.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.projectTokenAmount = reader.string();
                    break;
                case 7:
                    message.quoteDenom = reader.string();
                    break;
                case 8:
                    message.targetAmountInQuoteDenom = reader.string();
                    break;
                case 9:
                    message.targetAmountInUsd = reader.string();
                    break;
                case 10:
                    message.capPerAddress = reader.string();
                    break;
                case 11:
                    message.contractAddress = reader.string();
                    break;
                case 12:
                    message.subscribedAmount = reader.string();
                    break;
                case 13:
                    message.tokenPrice = reader.double();
                    break;
                case 14:
                    message.isAccountWhiteListed = reader.bool();
                    break;
                case 15:
                    message.name = reader.string();
                    break;
                case 16:
                    message.progress.push(exports.IDOProgress.decode(reader, reader.uint32()));
                    break;
                case 17:
                    message.stakeToSubscription.push(exports.ArrayOfString.decode(reader, reader.uint32()));
                    break;
                case 18:
                    message.secondBeforeStartToSetQuotePrice = longToString(reader.sint64());
                    break;
                case 19:
                    message.useWhitelist = reader.bool();
                    break;
                case 20:
                    message.marketId = reader.string();
                    break;
                case 21:
                    message.vaultAddress = reader.string();
                    break;
                case 22:
                    message.isLaunchWithVault = reader.bool();
                    break;
                case 23:
                    message.isVestingScheduleEnabled = reader.bool();
                    break;
                case 24:
                    message.initParams = exports.InitParams.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            startTime: isSet(object.startTime) ? String(object.startTime) : "0",
            endTime: isSet(object.endTime) ? String(object.endTime) : "0",
            owner: isSet(object.owner) ? String(object.owner) : "",
            status: isSet(object.status) ? String(object.status) : "",
            tokenInfo: isSet(object.tokenInfo) ? exports.TokenInfo.fromJSON(object.tokenInfo) : undefined,
            projectTokenAmount: isSet(object.projectTokenAmount) ? String(object.projectTokenAmount) : "",
            quoteDenom: isSet(object.quoteDenom) ? String(object.quoteDenom) : "",
            targetAmountInQuoteDenom: isSet(object.targetAmountInQuoteDenom) ? String(object.targetAmountInQuoteDenom) : "",
            targetAmountInUsd: isSet(object.targetAmountInUsd) ? String(object.targetAmountInUsd) : "",
            capPerAddress: isSet(object.capPerAddress) ? String(object.capPerAddress) : "",
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            subscribedAmount: isSet(object.subscribedAmount) ? String(object.subscribedAmount) : "",
            tokenPrice: isSet(object.tokenPrice) ? Number(object.tokenPrice) : 0,
            isAccountWhiteListed: isSet(object.isAccountWhiteListed) ? Boolean(object.isAccountWhiteListed) : false,
            name: isSet(object.name) ? String(object.name) : "",
            progress: Array.isArray(object === null || object === void 0 ? void 0 : object.progress) ? object.progress.map((e) => exports.IDOProgress.fromJSON(e)) : [],
            stakeToSubscription: Array.isArray(object === null || object === void 0 ? void 0 : object.stakeToSubscription)
                ? object.stakeToSubscription.map((e) => exports.ArrayOfString.fromJSON(e))
                : [],
            secondBeforeStartToSetQuotePrice: isSet(object.secondBeforeStartToSetQuotePrice)
                ? String(object.secondBeforeStartToSetQuotePrice)
                : "0",
            useWhitelist: isSet(object.useWhitelist) ? Boolean(object.useWhitelist) : false,
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            vaultAddress: isSet(object.vaultAddress) ? String(object.vaultAddress) : "",
            isLaunchWithVault: isSet(object.isLaunchWithVault) ? Boolean(object.isLaunchWithVault) : false,
            isVestingScheduleEnabled: isSet(object.isVestingScheduleEnabled)
                ? Boolean(object.isVestingScheduleEnabled)
                : false,
            initParams: isSet(object.initParams) ? exports.InitParams.fromJSON(object.initParams) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.startTime !== undefined && (obj.startTime = message.startTime);
        message.endTime !== undefined && (obj.endTime = message.endTime);
        message.owner !== undefined && (obj.owner = message.owner);
        message.status !== undefined && (obj.status = message.status);
        message.tokenInfo !== undefined &&
            (obj.tokenInfo = message.tokenInfo ? exports.TokenInfo.toJSON(message.tokenInfo) : undefined);
        message.projectTokenAmount !== undefined && (obj.projectTokenAmount = message.projectTokenAmount);
        message.quoteDenom !== undefined && (obj.quoteDenom = message.quoteDenom);
        message.targetAmountInQuoteDenom !== undefined && (obj.targetAmountInQuoteDenom = message.targetAmountInQuoteDenom);
        message.targetAmountInUsd !== undefined && (obj.targetAmountInUsd = message.targetAmountInUsd);
        message.capPerAddress !== undefined && (obj.capPerAddress = message.capPerAddress);
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.subscribedAmount !== undefined && (obj.subscribedAmount = message.subscribedAmount);
        message.tokenPrice !== undefined && (obj.tokenPrice = message.tokenPrice);
        message.isAccountWhiteListed !== undefined && (obj.isAccountWhiteListed = message.isAccountWhiteListed);
        message.name !== undefined && (obj.name = message.name);
        if (message.progress) {
            obj.progress = message.progress.map((e) => e ? exports.IDOProgress.toJSON(e) : undefined);
        }
        else {
            obj.progress = [];
        }
        if (message.stakeToSubscription) {
            obj.stakeToSubscription = message.stakeToSubscription.map((e) => e ? exports.ArrayOfString.toJSON(e) : undefined);
        }
        else {
            obj.stakeToSubscription = [];
        }
        message.secondBeforeStartToSetQuotePrice !== undefined &&
            (obj.secondBeforeStartToSetQuotePrice = message.secondBeforeStartToSetQuotePrice);
        message.useWhitelist !== undefined && (obj.useWhitelist = message.useWhitelist);
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.vaultAddress !== undefined && (obj.vaultAddress = message.vaultAddress);
        message.isLaunchWithVault !== undefined && (obj.isLaunchWithVault = message.isLaunchWithVault);
        message.isVestingScheduleEnabled !== undefined && (obj.isVestingScheduleEnabled = message.isVestingScheduleEnabled);
        message.initParams !== undefined &&
            (obj.initParams = message.initParams ? exports.InitParams.toJSON(message.initParams) : undefined);
        return obj;
    },
    create(base) {
        return exports.IDO.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const message = createBaseIDO();
        message.startTime = (_a = object.startTime) !== null && _a !== void 0 ? _a : "0";
        message.endTime = (_b = object.endTime) !== null && _b !== void 0 ? _b : "0";
        message.owner = (_c = object.owner) !== null && _c !== void 0 ? _c : "";
        message.status = (_d = object.status) !== null && _d !== void 0 ? _d : "";
        message.tokenInfo = (object.tokenInfo !== undefined && object.tokenInfo !== null)
            ? exports.TokenInfo.fromPartial(object.tokenInfo)
            : undefined;
        message.projectTokenAmount = (_e = object.projectTokenAmount) !== null && _e !== void 0 ? _e : "";
        message.quoteDenom = (_f = object.quoteDenom) !== null && _f !== void 0 ? _f : "";
        message.targetAmountInQuoteDenom = (_g = object.targetAmountInQuoteDenom) !== null && _g !== void 0 ? _g : "";
        message.targetAmountInUsd = (_h = object.targetAmountInUsd) !== null && _h !== void 0 ? _h : "";
        message.capPerAddress = (_j = object.capPerAddress) !== null && _j !== void 0 ? _j : "";
        message.contractAddress = (_k = object.contractAddress) !== null && _k !== void 0 ? _k : "";
        message.subscribedAmount = (_l = object.subscribedAmount) !== null && _l !== void 0 ? _l : "";
        message.tokenPrice = (_m = object.tokenPrice) !== null && _m !== void 0 ? _m : 0;
        message.isAccountWhiteListed = (_o = object.isAccountWhiteListed) !== null && _o !== void 0 ? _o : false;
        message.name = (_p = object.name) !== null && _p !== void 0 ? _p : "";
        message.progress = ((_q = object.progress) === null || _q === void 0 ? void 0 : _q.map((e) => exports.IDOProgress.fromPartial(e))) || [];
        message.stakeToSubscription = ((_r = object.stakeToSubscription) === null || _r === void 0 ? void 0 : _r.map((e) => exports.ArrayOfString.fromPartial(e))) || [];
        message.secondBeforeStartToSetQuotePrice = (_s = object.secondBeforeStartToSetQuotePrice) !== null && _s !== void 0 ? _s : "0";
        message.useWhitelist = (_t = object.useWhitelist) !== null && _t !== void 0 ? _t : false;
        message.marketId = (_u = object.marketId) !== null && _u !== void 0 ? _u : "";
        message.vaultAddress = (_v = object.vaultAddress) !== null && _v !== void 0 ? _v : "";
        message.isLaunchWithVault = (_w = object.isLaunchWithVault) !== null && _w !== void 0 ? _w : false;
        message.isVestingScheduleEnabled = (_x = object.isVestingScheduleEnabled) !== null && _x !== void 0 ? _x : false;
        message.initParams = (object.initParams !== undefined && object.initParams !== null)
            ? exports.InitParams.fromPartial(object.initParams)
            : undefined;
        return message;
    },
};
function createBaseTokenInfo() {
    return { denom: "", supply: "", symbol: "", decimal: 0, logoUrl: "" };
}
exports.TokenInfo = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.supply !== "") {
            writer.uint32(18).string(message.supply);
        }
        if (message.symbol !== "") {
            writer.uint32(26).string(message.symbol);
        }
        if (message.decimal !== 0) {
            writer.uint32(32).sint32(message.decimal);
        }
        if (message.logoUrl !== "") {
            writer.uint32(42).string(message.logoUrl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTokenInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.supply = reader.string();
                    break;
                case 3:
                    message.symbol = reader.string();
                    break;
                case 4:
                    message.decimal = reader.sint32();
                    break;
                case 5:
                    message.logoUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            supply: isSet(object.supply) ? String(object.supply) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
            decimal: isSet(object.decimal) ? Number(object.decimal) : 0,
            logoUrl: isSet(object.logoUrl) ? String(object.logoUrl) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.supply !== undefined && (obj.supply = message.supply);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.decimal !== undefined && (obj.decimal = Math.round(message.decimal));
        message.logoUrl !== undefined && (obj.logoUrl = message.logoUrl);
        return obj;
    },
    create(base) {
        return exports.TokenInfo.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseTokenInfo();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.supply = (_b = object.supply) !== null && _b !== void 0 ? _b : "";
        message.symbol = (_c = object.symbol) !== null && _c !== void 0 ? _c : "";
        message.decimal = (_d = object.decimal) !== null && _d !== void 0 ? _d : 0;
        message.logoUrl = (_e = object.logoUrl) !== null && _e !== void 0 ? _e : "";
        return message;
    },
};
function createBaseIDOProgress() {
    return { status: "", timestamp: "0" };
}
exports.IDOProgress = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.status !== "") {
            writer.uint32(10).string(message.status);
        }
        if (message.timestamp !== "0") {
            writer.uint32(16).sint64(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDOProgress();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.status = reader.string();
                    break;
                case 2:
                    message.timestamp = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            status: isSet(object.status) ? String(object.status) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.status !== undefined && (obj.status = message.status);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        return obj;
    },
    create(base) {
        return exports.IDOProgress.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseIDOProgress();
        message.status = (_a = object.status) !== null && _a !== void 0 ? _a : "";
        message.timestamp = (_b = object.timestamp) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseArrayOfString() {
    return { field: [] };
}
exports.ArrayOfString = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.field) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseArrayOfString();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.field.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { field: Array.isArray(object === null || object === void 0 ? void 0 : object.field) ? object.field.map((e) => String(e)) : [] };
    },
    toJSON(message) {
        const obj = {};
        if (message.field) {
            obj.field = message.field.map((e) => e);
        }
        else {
            obj.field = [];
        }
        return obj;
    },
    create(base) {
        return exports.ArrayOfString.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseArrayOfString();
        message.field = ((_a = object.field) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseInitParams() {
    return { vestingConfig: undefined };
}
exports.InitParams = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vestingConfig !== undefined) {
            exports.VestingConfigMap.encode(message.vestingConfig, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInitParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vestingConfig = exports.VestingConfigMap.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { vestingConfig: isSet(object.vestingConfig) ? exports.VestingConfigMap.fromJSON(object.vestingConfig) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.vestingConfig !== undefined &&
            (obj.vestingConfig = message.vestingConfig ? exports.VestingConfigMap.toJSON(message.vestingConfig) : undefined);
        return obj;
    },
    create(base) {
        return exports.InitParams.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseInitParams();
        message.vestingConfig = (object.vestingConfig !== undefined && object.vestingConfig !== null)
            ? exports.VestingConfigMap.fromPartial(object.vestingConfig)
            : undefined;
        return message;
    },
};
function createBaseVestingConfigMap() {
    return { projectOwnerQuote: undefined, projectOwnerLpTokens: undefined, usersProjectToken: undefined };
}
exports.VestingConfigMap = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.projectOwnerQuote !== undefined) {
            exports.VestingConfig.encode(message.projectOwnerQuote, writer.uint32(10).fork()).ldelim();
        }
        if (message.projectOwnerLpTokens !== undefined) {
            exports.VestingConfig.encode(message.projectOwnerLpTokens, writer.uint32(18).fork()).ldelim();
        }
        if (message.usersProjectToken !== undefined) {
            exports.VestingConfig.encode(message.usersProjectToken, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVestingConfigMap();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.projectOwnerQuote = exports.VestingConfig.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.projectOwnerLpTokens = exports.VestingConfig.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.usersProjectToken = exports.VestingConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            projectOwnerQuote: isSet(object.projectOwnerQuote) ? exports.VestingConfig.fromJSON(object.projectOwnerQuote) : undefined,
            projectOwnerLpTokens: isSet(object.projectOwnerLpTokens)
                ? exports.VestingConfig.fromJSON(object.projectOwnerLpTokens)
                : undefined,
            usersProjectToken: isSet(object.usersProjectToken) ? exports.VestingConfig.fromJSON(object.usersProjectToken) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.projectOwnerQuote !== undefined &&
            (obj.projectOwnerQuote = message.projectOwnerQuote ? exports.VestingConfig.toJSON(message.projectOwnerQuote) : undefined);
        message.projectOwnerLpTokens !== undefined && (obj.projectOwnerLpTokens = message.projectOwnerLpTokens
            ? exports.VestingConfig.toJSON(message.projectOwnerLpTokens)
            : undefined);
        message.usersProjectToken !== undefined &&
            (obj.usersProjectToken = message.usersProjectToken ? exports.VestingConfig.toJSON(message.usersProjectToken) : undefined);
        return obj;
    },
    create(base) {
        return exports.VestingConfigMap.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseVestingConfigMap();
        message.projectOwnerQuote = (object.projectOwnerQuote !== undefined && object.projectOwnerQuote !== null)
            ? exports.VestingConfig.fromPartial(object.projectOwnerQuote)
            : undefined;
        message.projectOwnerLpTokens = (object.projectOwnerLpTokens !== undefined && object.projectOwnerLpTokens !== null)
            ? exports.VestingConfig.fromPartial(object.projectOwnerLpTokens)
            : undefined;
        message.usersProjectToken = (object.usersProjectToken !== undefined && object.usersProjectToken !== null)
            ? exports.VestingConfig.fromPartial(object.usersProjectToken)
            : undefined;
        return message;
    },
};
function createBaseVestingConfig() {
    return { vestingDurationSeconds: undefined, vestingStartDelaySeconds: undefined, schedule: undefined };
}
exports.VestingConfig = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.vestingDurationSeconds !== undefined) {
            writer.uint32(8).sint64(message.vestingDurationSeconds);
        }
        if (message.vestingStartDelaySeconds !== undefined) {
            writer.uint32(16).sint64(message.vestingStartDelaySeconds);
        }
        if (message.schedule !== undefined) {
            writer.uint32(26).string(message.schedule);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVestingConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.vestingDurationSeconds = longToString(reader.sint64());
                    break;
                case 2:
                    message.vestingStartDelaySeconds = longToString(reader.sint64());
                    break;
                case 3:
                    message.schedule = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            vestingDurationSeconds: isSet(object.vestingDurationSeconds) ? String(object.vestingDurationSeconds) : undefined,
            vestingStartDelaySeconds: isSet(object.vestingStartDelaySeconds)
                ? String(object.vestingStartDelaySeconds)
                : undefined,
            schedule: isSet(object.schedule) ? String(object.schedule) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.vestingDurationSeconds !== undefined && (obj.vestingDurationSeconds = message.vestingDurationSeconds);
        message.vestingStartDelaySeconds !== undefined && (obj.vestingStartDelaySeconds = message.vestingStartDelaySeconds);
        message.schedule !== undefined && (obj.schedule = message.schedule);
        return obj;
    },
    create(base) {
        return exports.VestingConfig.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseVestingConfig();
        message.vestingDurationSeconds = (_a = object.vestingDurationSeconds) !== null && _a !== void 0 ? _a : undefined;
        message.vestingStartDelaySeconds = (_b = object.vestingStartDelaySeconds) !== null && _b !== void 0 ? _b : undefined;
        message.schedule = (_c = object.schedule) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseGetIDORequest() {
    return { contractAddress: "", accountAddress: undefined };
}
exports.GetIDORequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.accountAddress !== undefined) {
            writer.uint32(18).string(message.accountAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDORequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.accountAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        return obj;
    },
    create(base) {
        return exports.GetIDORequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetIDORequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        message.accountAddress = (_b = object.accountAddress) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseGetIDOResponse() {
    return { ido: undefined };
}
exports.GetIDOResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.ido !== undefined) {
            exports.IDO.encode(message.ido, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ido = exports.IDO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { ido: isSet(object.ido) ? exports.IDO.fromJSON(object.ido) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.ido !== undefined && (obj.ido = message.ido ? exports.IDO.toJSON(message.ido) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetIDOResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseGetIDOResponse();
        message.ido = (object.ido !== undefined && object.ido !== null) ? exports.IDO.fromPartial(object.ido) : undefined;
        return message;
    },
};
function createBaseGetIDOSubscribersRequest() {
    return { contractAddress: "", limit: undefined, skip: undefined, sortBy: undefined };
}
exports.GetIDOSubscribersRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.limit !== undefined) {
            writer.uint32(16).sint32(message.limit);
        }
        if (message.skip !== undefined) {
            writer.uint32(24).sint32(message.skip);
        }
        if (message.sortBy !== undefined) {
            writer.uint32(34).string(message.sortBy);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOSubscribersRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.limit = reader.sint32();
                    break;
                case 3:
                    message.skip = reader.sint32();
                    break;
                case 4:
                    message.sortBy = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
            sortBy: isSet(object.sortBy) ? String(object.sortBy) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        message.sortBy !== undefined && (obj.sortBy = message.sortBy);
        return obj;
    },
    create(base) {
        return exports.GetIDOSubscribersRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseGetIDOSubscribersRequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        message.limit = (_b = object.limit) !== null && _b !== void 0 ? _b : undefined;
        message.skip = (_c = object.skip) !== null && _c !== void 0 ? _c : undefined;
        message.sortBy = (_d = object.sortBy) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseGetIDOSubscribersResponse() {
    return { subscribers: [], pagination: undefined, tokenInfo: undefined, quoteDenom: "", marketId: "" };
}
exports.GetIDOSubscribersResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.subscribers) {
            exports.IDOSubscriber.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        if (message.tokenInfo !== undefined) {
            exports.TokenInfo.encode(message.tokenInfo, writer.uint32(26).fork()).ldelim();
        }
        if (message.quoteDenom !== "") {
            writer.uint32(34).string(message.quoteDenom);
        }
        if (message.marketId !== "") {
            writer.uint32(42).string(message.marketId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOSubscribersResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.subscribers.push(exports.IDOSubscriber.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.tokenInfo = exports.TokenInfo.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.quoteDenom = reader.string();
                    break;
                case 5:
                    message.marketId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            subscribers: Array.isArray(object === null || object === void 0 ? void 0 : object.subscribers)
                ? object.subscribers.map((e) => exports.IDOSubscriber.fromJSON(e))
                : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
            tokenInfo: isSet(object.tokenInfo) ? exports.TokenInfo.fromJSON(object.tokenInfo) : undefined,
            quoteDenom: isSet(object.quoteDenom) ? String(object.quoteDenom) : "",
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.subscribers) {
            obj.subscribers = message.subscribers.map((e) => e ? exports.IDOSubscriber.toJSON(e) : undefined);
        }
        else {
            obj.subscribers = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        message.tokenInfo !== undefined &&
            (obj.tokenInfo = message.tokenInfo ? exports.TokenInfo.toJSON(message.tokenInfo) : undefined);
        message.quoteDenom !== undefined && (obj.quoteDenom = message.quoteDenom);
        message.marketId !== undefined && (obj.marketId = message.marketId);
        return obj;
    },
    create(base) {
        return exports.GetIDOSubscribersResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseGetIDOSubscribersResponse();
        message.subscribers = ((_a = object.subscribers) === null || _a === void 0 ? void 0 : _a.map((e) => exports.IDOSubscriber.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        message.tokenInfo = (object.tokenInfo !== undefined && object.tokenInfo !== null)
            ? exports.TokenInfo.fromPartial(object.tokenInfo)
            : undefined;
        message.quoteDenom = (_b = object.quoteDenom) !== null && _b !== void 0 ? _b : "";
        message.marketId = (_c = object.marketId) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseIDOSubscriber() {
    return {
        address: "",
        subscribedCoin: undefined,
        lastSubscribeTime: "0",
        estimateTokenReceived: undefined,
        estimateLpAmount: undefined,
        estimateRefundAmount: undefined,
        createdAt: "0",
    };
}
exports.IDOSubscriber = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.subscribedCoin !== undefined) {
            exports.Coin.encode(message.subscribedCoin, writer.uint32(18).fork()).ldelim();
        }
        if (message.lastSubscribeTime !== "0") {
            writer.uint32(24).sint64(message.lastSubscribeTime);
        }
        if (message.estimateTokenReceived !== undefined) {
            exports.Coin.encode(message.estimateTokenReceived, writer.uint32(34).fork()).ldelim();
        }
        if (message.estimateLpAmount !== undefined) {
            exports.Coin.encode(message.estimateLpAmount, writer.uint32(42).fork()).ldelim();
        }
        if (message.estimateRefundAmount !== undefined) {
            exports.Coin.encode(message.estimateRefundAmount, writer.uint32(50).fork()).ldelim();
        }
        if (message.createdAt !== "0") {
            writer.uint32(56).sint64(message.createdAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDOSubscriber();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.subscribedCoin = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.lastSubscribeTime = longToString(reader.sint64());
                    break;
                case 4:
                    message.estimateTokenReceived = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.estimateLpAmount = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.estimateRefundAmount = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.createdAt = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            subscribedCoin: isSet(object.subscribedCoin) ? exports.Coin.fromJSON(object.subscribedCoin) : undefined,
            lastSubscribeTime: isSet(object.lastSubscribeTime) ? String(object.lastSubscribeTime) : "0",
            estimateTokenReceived: isSet(object.estimateTokenReceived)
                ? exports.Coin.fromJSON(object.estimateTokenReceived)
                : undefined,
            estimateLpAmount: isSet(object.estimateLpAmount) ? exports.Coin.fromJSON(object.estimateLpAmount) : undefined,
            estimateRefundAmount: isSet(object.estimateRefundAmount) ? exports.Coin.fromJSON(object.estimateRefundAmount) : undefined,
            createdAt: isSet(object.createdAt) ? String(object.createdAt) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.subscribedCoin !== undefined &&
            (obj.subscribedCoin = message.subscribedCoin ? exports.Coin.toJSON(message.subscribedCoin) : undefined);
        message.lastSubscribeTime !== undefined && (obj.lastSubscribeTime = message.lastSubscribeTime);
        message.estimateTokenReceived !== undefined && (obj.estimateTokenReceived = message.estimateTokenReceived
            ? exports.Coin.toJSON(message.estimateTokenReceived)
            : undefined);
        message.estimateLpAmount !== undefined &&
            (obj.estimateLpAmount = message.estimateLpAmount ? exports.Coin.toJSON(message.estimateLpAmount) : undefined);
        message.estimateRefundAmount !== undefined &&
            (obj.estimateRefundAmount = message.estimateRefundAmount ? exports.Coin.toJSON(message.estimateRefundAmount) : undefined);
        message.createdAt !== undefined && (obj.createdAt = message.createdAt);
        return obj;
    },
    create(base) {
        return exports.IDOSubscriber.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseIDOSubscriber();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.subscribedCoin = (object.subscribedCoin !== undefined && object.subscribedCoin !== null)
            ? exports.Coin.fromPartial(object.subscribedCoin)
            : undefined;
        message.lastSubscribeTime = (_b = object.lastSubscribeTime) !== null && _b !== void 0 ? _b : "0";
        message.estimateTokenReceived =
            (object.estimateTokenReceived !== undefined && object.estimateTokenReceived !== null)
                ? exports.Coin.fromPartial(object.estimateTokenReceived)
                : undefined;
        message.estimateLpAmount = (object.estimateLpAmount !== undefined && object.estimateLpAmount !== null)
            ? exports.Coin.fromPartial(object.estimateLpAmount)
            : undefined;
        message.estimateRefundAmount = (object.estimateRefundAmount !== undefined && object.estimateRefundAmount !== null)
            ? exports.Coin.fromPartial(object.estimateRefundAmount)
            : undefined;
        message.createdAt = (_c = object.createdAt) !== null && _c !== void 0 ? _c : "0";
        return message;
    },
};
function createBaseGetIDOSubscriptionRequest() {
    return { contractAddress: "", accountAddress: "" };
}
exports.GetIDOSubscriptionRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== "") {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.accountAddress !== "") {
            writer.uint32(18).string(message.accountAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOSubscriptionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.accountAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        return obj;
    },
    create(base) {
        return exports.GetIDOSubscriptionRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetIDOSubscriptionRequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : "";
        message.accountAddress = (_b = object.accountAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseGetIDOSubscriptionResponse() {
    return { subscription: undefined };
}
exports.GetIDOSubscriptionResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.subscription !== undefined) {
            exports.IDOSubscription.encode(message.subscription, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOSubscriptionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.subscription = exports.IDOSubscription.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { subscription: isSet(object.subscription) ? exports.IDOSubscription.fromJSON(object.subscription) : undefined };
    },
    toJSON(message) {
        const obj = {};
        message.subscription !== undefined &&
            (obj.subscription = message.subscription ? exports.IDOSubscription.toJSON(message.subscription) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetIDOSubscriptionResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseGetIDOSubscriptionResponse();
        message.subscription = (object.subscription !== undefined && object.subscription !== null)
            ? exports.IDOSubscription.fromPartial(object.subscription)
            : undefined;
        return message;
    },
};
function createBaseIDOSubscription() {
    return {
        maxSubscriptionCoin: undefined,
        committedAmount: "",
        price: 0,
        claimableCoins: [],
        updatedAt: "0",
        rewardClaimed: false,
        tokenInfo: undefined,
        quoteDenom: "",
        stakedAmount: "",
        claimTxHash: undefined,
        ownerClaimableCoins: [],
        marketId: "",
        weight: "",
        claimedCoins: undefined,
    };
}
exports.IDOSubscription = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.maxSubscriptionCoin !== undefined) {
            exports.Coin.encode(message.maxSubscriptionCoin, writer.uint32(10).fork()).ldelim();
        }
        if (message.committedAmount !== "") {
            writer.uint32(18).string(message.committedAmount);
        }
        if (message.price !== 0) {
            writer.uint32(25).double(message.price);
        }
        for (const v of message.claimableCoins) {
            exports.Coin.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.updatedAt !== "0") {
            writer.uint32(40).sint64(message.updatedAt);
        }
        if (message.rewardClaimed === true) {
            writer.uint32(48).bool(message.rewardClaimed);
        }
        if (message.tokenInfo !== undefined) {
            exports.TokenInfo.encode(message.tokenInfo, writer.uint32(58).fork()).ldelim();
        }
        if (message.quoteDenom !== "") {
            writer.uint32(66).string(message.quoteDenom);
        }
        if (message.stakedAmount !== "") {
            writer.uint32(74).string(message.stakedAmount);
        }
        if (message.claimTxHash !== undefined) {
            writer.uint32(82).string(message.claimTxHash);
        }
        for (const v of message.ownerClaimableCoins) {
            exports.Coin.encode(v, writer.uint32(90).fork()).ldelim();
        }
        if (message.marketId !== "") {
            writer.uint32(98).string(message.marketId);
        }
        if (message.weight !== "") {
            writer.uint32(106).string(message.weight);
        }
        if (message.claimedCoins !== undefined) {
            exports.IDOClaimedCoins.encode(message.claimedCoins, writer.uint32(114).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDOSubscription();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.maxSubscriptionCoin = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.committedAmount = reader.string();
                    break;
                case 3:
                    message.price = reader.double();
                    break;
                case 4:
                    message.claimableCoins.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 6:
                    message.rewardClaimed = reader.bool();
                    break;
                case 7:
                    message.tokenInfo = exports.TokenInfo.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.quoteDenom = reader.string();
                    break;
                case 9:
                    message.stakedAmount = reader.string();
                    break;
                case 10:
                    message.claimTxHash = reader.string();
                    break;
                case 11:
                    message.ownerClaimableCoins.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 12:
                    message.marketId = reader.string();
                    break;
                case 13:
                    message.weight = reader.string();
                    break;
                case 14:
                    message.claimedCoins = exports.IDOClaimedCoins.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            maxSubscriptionCoin: isSet(object.maxSubscriptionCoin) ? exports.Coin.fromJSON(object.maxSubscriptionCoin) : undefined,
            committedAmount: isSet(object.committedAmount) ? String(object.committedAmount) : "",
            price: isSet(object.price) ? Number(object.price) : 0,
            claimableCoins: Array.isArray(object === null || object === void 0 ? void 0 : object.claimableCoins)
                ? object.claimableCoins.map((e) => exports.Coin.fromJSON(e))
                : [],
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            rewardClaimed: isSet(object.rewardClaimed) ? Boolean(object.rewardClaimed) : false,
            tokenInfo: isSet(object.tokenInfo) ? exports.TokenInfo.fromJSON(object.tokenInfo) : undefined,
            quoteDenom: isSet(object.quoteDenom) ? String(object.quoteDenom) : "",
            stakedAmount: isSet(object.stakedAmount) ? String(object.stakedAmount) : "",
            claimTxHash: isSet(object.claimTxHash) ? String(object.claimTxHash) : undefined,
            ownerClaimableCoins: Array.isArray(object === null || object === void 0 ? void 0 : object.ownerClaimableCoins)
                ? object.ownerClaimableCoins.map((e) => exports.Coin.fromJSON(e))
                : [],
            marketId: isSet(object.marketId) ? String(object.marketId) : "",
            weight: isSet(object.weight) ? String(object.weight) : "",
            claimedCoins: isSet(object.claimedCoins) ? exports.IDOClaimedCoins.fromJSON(object.claimedCoins) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.maxSubscriptionCoin !== undefined &&
            (obj.maxSubscriptionCoin = message.maxSubscriptionCoin ? exports.Coin.toJSON(message.maxSubscriptionCoin) : undefined);
        message.committedAmount !== undefined && (obj.committedAmount = message.committedAmount);
        message.price !== undefined && (obj.price = message.price);
        if (message.claimableCoins) {
            obj.claimableCoins = message.claimableCoins.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.claimableCoins = [];
        }
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.rewardClaimed !== undefined && (obj.rewardClaimed = message.rewardClaimed);
        message.tokenInfo !== undefined &&
            (obj.tokenInfo = message.tokenInfo ? exports.TokenInfo.toJSON(message.tokenInfo) : undefined);
        message.quoteDenom !== undefined && (obj.quoteDenom = message.quoteDenom);
        message.stakedAmount !== undefined && (obj.stakedAmount = message.stakedAmount);
        message.claimTxHash !== undefined && (obj.claimTxHash = message.claimTxHash);
        if (message.ownerClaimableCoins) {
            obj.ownerClaimableCoins = message.ownerClaimableCoins.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.ownerClaimableCoins = [];
        }
        message.marketId !== undefined && (obj.marketId = message.marketId);
        message.weight !== undefined && (obj.weight = message.weight);
        message.claimedCoins !== undefined &&
            (obj.claimedCoins = message.claimedCoins ? exports.IDOClaimedCoins.toJSON(message.claimedCoins) : undefined);
        return obj;
    },
    create(base) {
        return exports.IDOSubscription.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseIDOSubscription();
        message.maxSubscriptionCoin = (object.maxSubscriptionCoin !== undefined && object.maxSubscriptionCoin !== null)
            ? exports.Coin.fromPartial(object.maxSubscriptionCoin)
            : undefined;
        message.committedAmount = (_a = object.committedAmount) !== null && _a !== void 0 ? _a : "";
        message.price = (_b = object.price) !== null && _b !== void 0 ? _b : 0;
        message.claimableCoins = ((_c = object.claimableCoins) === null || _c === void 0 ? void 0 : _c.map((e) => exports.Coin.fromPartial(e))) || [];
        message.updatedAt = (_d = object.updatedAt) !== null && _d !== void 0 ? _d : "0";
        message.rewardClaimed = (_e = object.rewardClaimed) !== null && _e !== void 0 ? _e : false;
        message.tokenInfo = (object.tokenInfo !== undefined && object.tokenInfo !== null)
            ? exports.TokenInfo.fromPartial(object.tokenInfo)
            : undefined;
        message.quoteDenom = (_f = object.quoteDenom) !== null && _f !== void 0 ? _f : "";
        message.stakedAmount = (_g = object.stakedAmount) !== null && _g !== void 0 ? _g : "";
        message.claimTxHash = (_h = object.claimTxHash) !== null && _h !== void 0 ? _h : undefined;
        message.ownerClaimableCoins = ((_j = object.ownerClaimableCoins) === null || _j === void 0 ? void 0 : _j.map((e) => exports.Coin.fromPartial(e))) || [];
        message.marketId = (_k = object.marketId) !== null && _k !== void 0 ? _k : "";
        message.weight = (_l = object.weight) !== null && _l !== void 0 ? _l : "";
        message.claimedCoins = (object.claimedCoins !== undefined && object.claimedCoins !== null)
            ? exports.IDOClaimedCoins.fromPartial(object.claimedCoins)
            : undefined;
        return message;
    },
};
function createBaseIDOClaimedCoins() {
    return { claimedCoins: [], updatedAt: "0" };
}
exports.IDOClaimedCoins = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.claimedCoins) {
            exports.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.updatedAt !== "0") {
            writer.uint32(16).sint64(message.updatedAt);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDOClaimedCoins();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claimedCoins.push(exports.Coin.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            claimedCoins: Array.isArray(object === null || object === void 0 ? void 0 : object.claimedCoins) ? object.claimedCoins.map((e) => exports.Coin.fromJSON(e)) : [],
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.claimedCoins) {
            obj.claimedCoins = message.claimedCoins.map((e) => e ? exports.Coin.toJSON(e) : undefined);
        }
        else {
            obj.claimedCoins = [];
        }
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        return obj;
    },
    create(base) {
        return exports.IDOClaimedCoins.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseIDOClaimedCoins();
        message.claimedCoins = ((_a = object.claimedCoins) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Coin.fromPartial(e))) || [];
        message.updatedAt = (_b = object.updatedAt) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseGetIDOActivitiesRequest() {
    return { contractAddress: undefined, accountAddress: undefined, limit: undefined, toNumber: undefined };
}
exports.GetIDOActivitiesRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.contractAddress !== undefined) {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.accountAddress !== undefined) {
            writer.uint32(18).string(message.accountAddress);
        }
        if (message.limit !== undefined) {
            writer.uint32(24).sint32(message.limit);
        }
        if (message.toNumber !== undefined) {
            writer.uint32(34).string(message.toNumber);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOActivitiesRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.accountAddress = reader.string();
                    break;
                case 3:
                    message.limit = reader.sint32();
                    break;
                case 4:
                    message.toNumber = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : undefined,
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
            toNumber: isSet(object.toNumber) ? String(object.toNumber) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.toNumber !== undefined && (obj.toNumber = message.toNumber);
        return obj;
    },
    create(base) {
        return exports.GetIDOActivitiesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseGetIDOActivitiesRequest();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : undefined;
        message.accountAddress = (_b = object.accountAddress) !== null && _b !== void 0 ? _b : undefined;
        message.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : undefined;
        message.toNumber = (_d = object.toNumber) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseGetIDOActivitiesResponse() {
    return { activities: [], pagination: undefined };
}
exports.GetIDOActivitiesResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.activities) {
            exports.IDOSubscriptionActivity.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetIDOActivitiesResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.activities.push(exports.IDOSubscriptionActivity.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            activities: Array.isArray(object === null || object === void 0 ? void 0 : object.activities)
                ? object.activities.map((e) => exports.IDOSubscriptionActivity.fromJSON(e))
                : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.activities) {
            obj.activities = message.activities.map((e) => e ? exports.IDOSubscriptionActivity.toJSON(e) : undefined);
        }
        else {
            obj.activities = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetIDOActivitiesResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetIDOActivitiesResponse();
        message.activities = ((_a = object.activities) === null || _a === void 0 ? void 0 : _a.map((e) => exports.IDOSubscriptionActivity.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseIDOSubscriptionActivity() {
    return { address: "", subscribedCoin: undefined, usdValue: 0, timestamp: "0", txHash: "" };
}
exports.IDOSubscriptionActivity = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.subscribedCoin !== undefined) {
            exports.Coin.encode(message.subscribedCoin, writer.uint32(18).fork()).ldelim();
        }
        if (message.usdValue !== 0) {
            writer.uint32(25).double(message.usdValue);
        }
        if (message.timestamp !== "0") {
            writer.uint32(32).sint64(message.timestamp);
        }
        if (message.txHash !== "") {
            writer.uint32(42).string(message.txHash);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIDOSubscriptionActivity();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.subscribedCoin = exports.Coin.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.usdValue = reader.double();
                    break;
                case 4:
                    message.timestamp = longToString(reader.sint64());
                    break;
                case 5:
                    message.txHash = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            subscribedCoin: isSet(object.subscribedCoin) ? exports.Coin.fromJSON(object.subscribedCoin) : undefined,
            usdValue: isSet(object.usdValue) ? Number(object.usdValue) : 0,
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "0",
            txHash: isSet(object.txHash) ? String(object.txHash) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.subscribedCoin !== undefined &&
            (obj.subscribedCoin = message.subscribedCoin ? exports.Coin.toJSON(message.subscribedCoin) : undefined);
        message.usdValue !== undefined && (obj.usdValue = message.usdValue);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.txHash !== undefined && (obj.txHash = message.txHash);
        return obj;
    },
    create(base) {
        return exports.IDOSubscriptionActivity.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseIDOSubscriptionActivity();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.subscribedCoin = (object.subscribedCoin !== undefined && object.subscribedCoin !== null)
            ? exports.Coin.fromPartial(object.subscribedCoin)
            : undefined;
        message.usdValue = (_b = object.usdValue) !== null && _b !== void 0 ? _b : 0;
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : "0";
        message.txHash = (_d = object.txHash) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseGetWhitelistRequest() {
    return { idoAddress: "", skip: undefined, limit: undefined };
}
exports.GetWhitelistRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.idoAddress !== "") {
            writer.uint32(10).string(message.idoAddress);
        }
        if (message.skip !== undefined) {
            writer.uint32(16).sint32(message.skip);
        }
        if (message.limit !== undefined) {
            writer.uint32(24).sint32(message.limit);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetWhitelistRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.idoAddress = reader.string();
                    break;
                case 2:
                    message.skip = reader.sint32();
                    break;
                case 3:
                    message.limit = reader.sint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            idoAddress: isSet(object.idoAddress) ? String(object.idoAddress) : "",
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.idoAddress !== undefined && (obj.idoAddress = message.idoAddress);
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        return obj;
    },
    create(base) {
        return exports.GetWhitelistRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseGetWhitelistRequest();
        message.idoAddress = (_a = object.idoAddress) !== null && _a !== void 0 ? _a : "";
        message.skip = (_b = object.skip) !== null && _b !== void 0 ? _b : undefined;
        message.limit = (_c = object.limit) !== null && _c !== void 0 ? _c : undefined;
        return message;
    },
};
function createBaseGetWhitelistResponse() {
    return { idoAddress: undefined, accounts: [], pagination: undefined };
}
exports.GetWhitelistResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.idoAddress !== undefined) {
            writer.uint32(10).string(message.idoAddress);
        }
        for (const v of message.accounts) {
            exports.WhitelistAccount.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetWhitelistResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.idoAddress = reader.string();
                    break;
                case 2:
                    message.accounts.push(exports.WhitelistAccount.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            idoAddress: isSet(object.idoAddress) ? String(object.idoAddress) : undefined,
            accounts: Array.isArray(object === null || object === void 0 ? void 0 : object.accounts) ? object.accounts.map((e) => exports.WhitelistAccount.fromJSON(e)) : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.idoAddress !== undefined && (obj.idoAddress = message.idoAddress);
        if (message.accounts) {
            obj.accounts = message.accounts.map((e) => e ? exports.WhitelistAccount.toJSON(e) : undefined);
        }
        else {
            obj.accounts = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetWhitelistResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGetWhitelistResponse();
        message.idoAddress = (_a = object.idoAddress) !== null && _a !== void 0 ? _a : undefined;
        message.accounts = ((_b = object.accounts) === null || _b === void 0 ? void 0 : _b.map((e) => exports.WhitelistAccount.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseWhitelistAccount() {
    return { accountAddress: "", updatedAt: "0", weight: "" };
}
exports.WhitelistAccount = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.accountAddress !== "") {
            writer.uint32(10).string(message.accountAddress);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(16).sint64(message.updatedAt);
        }
        if (message.weight !== "") {
            writer.uint32(26).string(message.weight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWhitelistAccount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountAddress = reader.string();
                    break;
                case 2:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 3:
                    message.weight = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "",
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            weight: isSet(object.weight) ? String(object.weight) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.weight !== undefined && (obj.weight = message.weight);
        return obj;
    },
    create(base) {
        return exports.WhitelistAccount.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseWhitelistAccount();
        message.accountAddress = (_a = object.accountAddress) !== null && _a !== void 0 ? _a : "";
        message.updatedAt = (_b = object.updatedAt) !== null && _b !== void 0 ? _b : "0";
        message.weight = (_c = object.weight) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseTokenMetadataRequest() {
    return {};
}
exports.TokenMetadataRequest = {
    encode(_, writer = minimal_js_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTokenMetadataRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.TokenMetadataRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseTokenMetadataRequest();
        return message;
    },
};
function createBaseTokenMetadataResponse() {
    return { data: "" };
}
exports.TokenMetadataResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.data !== "") {
            writer.uint32(10).string(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTokenMetadataResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return { data: isSet(object.data) ? String(object.data) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data);
        return obj;
    },
    create(base) {
        return exports.TokenMetadataResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTokenMetadataResponse();
        message.data = (_a = object.data) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGetClaimReferencesRequest() {
    return { accountAddress: "", idoAddress: "", skip: undefined, limit: undefined };
}
exports.GetClaimReferencesRequest = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.accountAddress !== "") {
            writer.uint32(10).string(message.accountAddress);
        }
        if (message.idoAddress !== "") {
            writer.uint32(18).string(message.idoAddress);
        }
        if (message.skip !== undefined) {
            writer.uint32(24).sint32(message.skip);
        }
        if (message.limit !== undefined) {
            writer.uint32(32).sint32(message.limit);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetClaimReferencesRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountAddress = reader.string();
                    break;
                case 2:
                    message.idoAddress = reader.string();
                    break;
                case 3:
                    message.skip = reader.sint32();
                    break;
                case 4:
                    message.limit = reader.sint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "",
            idoAddress: isSet(object.idoAddress) ? String(object.idoAddress) : "",
            skip: isSet(object.skip) ? Number(object.skip) : undefined,
            limit: isSet(object.limit) ? Number(object.limit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        message.idoAddress !== undefined && (obj.idoAddress = message.idoAddress);
        message.skip !== undefined && (obj.skip = Math.round(message.skip));
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        return obj;
    },
    create(base) {
        return exports.GetClaimReferencesRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseGetClaimReferencesRequest();
        message.accountAddress = (_a = object.accountAddress) !== null && _a !== void 0 ? _a : "";
        message.idoAddress = (_b = object.idoAddress) !== null && _b !== void 0 ? _b : "";
        message.skip = (_c = object.skip) !== null && _c !== void 0 ? _c : undefined;
        message.limit = (_d = object.limit) !== null && _d !== void 0 ? _d : undefined;
        return message;
    },
};
function createBaseGetClaimReferencesResponse() {
    return { claimReferences: [], pagination: undefined };
}
exports.GetClaimReferencesResponse = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        for (const v of message.claimReferences) {
            exports.ClaimReference.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            exports.Pagination.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGetClaimReferencesResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.claimReferences.push(exports.ClaimReference.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = exports.Pagination.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            claimReferences: Array.isArray(object === null || object === void 0 ? void 0 : object.claimReferences)
                ? object.claimReferences.map((e) => exports.ClaimReference.fromJSON(e))
                : [],
            pagination: isSet(object.pagination) ? exports.Pagination.fromJSON(object.pagination) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.claimReferences) {
            obj.claimReferences = message.claimReferences.map((e) => e ? exports.ClaimReference.toJSON(e) : undefined);
        }
        else {
            obj.claimReferences = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination ? exports.Pagination.toJSON(message.pagination) : undefined);
        return obj;
    },
    create(base) {
        return exports.GetClaimReferencesResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGetClaimReferencesResponse();
        message.claimReferences = ((_a = object.claimReferences) === null || _a === void 0 ? void 0 : _a.map((e) => exports.ClaimReference.fromPartial(e))) || [];
        message.pagination = (object.pagination !== undefined && object.pagination !== null)
            ? exports.Pagination.fromPartial(object.pagination)
            : undefined;
        return message;
    },
};
function createBaseClaimReference() {
    return {
        accountAddress: "",
        cwContractAddress: "",
        idoContractAddress: "",
        startVestingTime: "",
        vestingDurationSeconds: "0",
        updatedAt: "0",
        claimedAmount: "",
        claimableAmount: "",
        denom: "",
    };
}
exports.ClaimReference = {
    encode(message, writer = minimal_js_1.default.Writer.create()) {
        if (message.accountAddress !== "") {
            writer.uint32(10).string(message.accountAddress);
        }
        if (message.cwContractAddress !== "") {
            writer.uint32(18).string(message.cwContractAddress);
        }
        if (message.idoContractAddress !== "") {
            writer.uint32(26).string(message.idoContractAddress);
        }
        if (message.startVestingTime !== "") {
            writer.uint32(34).string(message.startVestingTime);
        }
        if (message.vestingDurationSeconds !== "0") {
            writer.uint32(40).sint64(message.vestingDurationSeconds);
        }
        if (message.updatedAt !== "0") {
            writer.uint32(48).sint64(message.updatedAt);
        }
        if (message.claimedAmount !== "") {
            writer.uint32(58).string(message.claimedAmount);
        }
        if (message.claimableAmount !== "") {
            writer.uint32(66).string(message.claimableAmount);
        }
        if (message.denom !== "") {
            writer.uint32(74).string(message.denom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_js_1.default.Reader ? input : new minimal_js_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClaimReference();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.accountAddress = reader.string();
                    break;
                case 2:
                    message.cwContractAddress = reader.string();
                    break;
                case 3:
                    message.idoContractAddress = reader.string();
                    break;
                case 4:
                    message.startVestingTime = reader.string();
                    break;
                case 5:
                    message.vestingDurationSeconds = longToString(reader.sint64());
                    break;
                case 6:
                    message.updatedAt = longToString(reader.sint64());
                    break;
                case 7:
                    message.claimedAmount = reader.string();
                    break;
                case 8:
                    message.claimableAmount = reader.string();
                    break;
                case 9:
                    message.denom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "",
            cwContractAddress: isSet(object.cwContractAddress) ? String(object.cwContractAddress) : "",
            idoContractAddress: isSet(object.idoContractAddress) ? String(object.idoContractAddress) : "",
            startVestingTime: isSet(object.startVestingTime) ? String(object.startVestingTime) : "",
            vestingDurationSeconds: isSet(object.vestingDurationSeconds) ? String(object.vestingDurationSeconds) : "0",
            updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "0",
            claimedAmount: isSet(object.claimedAmount) ? String(object.claimedAmount) : "",
            claimableAmount: isSet(object.claimableAmount) ? String(object.claimableAmount) : "",
            denom: isSet(object.denom) ? String(object.denom) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
        message.cwContractAddress !== undefined && (obj.cwContractAddress = message.cwContractAddress);
        message.idoContractAddress !== undefined && (obj.idoContractAddress = message.idoContractAddress);
        message.startVestingTime !== undefined && (obj.startVestingTime = message.startVestingTime);
        message.vestingDurationSeconds !== undefined && (obj.vestingDurationSeconds = message.vestingDurationSeconds);
        message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
        message.claimedAmount !== undefined && (obj.claimedAmount = message.claimedAmount);
        message.claimableAmount !== undefined && (obj.claimableAmount = message.claimableAmount);
        message.denom !== undefined && (obj.denom = message.denom);
        return obj;
    },
    create(base) {
        return exports.ClaimReference.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseClaimReference();
        message.accountAddress = (_a = object.accountAddress) !== null && _a !== void 0 ? _a : "";
        message.cwContractAddress = (_b = object.cwContractAddress) !== null && _b !== void 0 ? _b : "";
        message.idoContractAddress = (_c = object.idoContractAddress) !== null && _c !== void 0 ? _c : "";
        message.startVestingTime = (_d = object.startVestingTime) !== null && _d !== void 0 ? _d : "";
        message.vestingDurationSeconds = (_e = object.vestingDurationSeconds) !== null && _e !== void 0 ? _e : "0";
        message.updatedAt = (_f = object.updatedAt) !== null && _f !== void 0 ? _f : "0";
        message.claimedAmount = (_g = object.claimedAmount) !== null && _g !== void 0 ? _g : "";
        message.claimableAmount = (_h = object.claimableAmount) !== null && _h !== void 0 ? _h : "";
        message.denom = (_j = object.denom) !== null && _j !== void 0 ? _j : "";
        return message;
    },
};
class MitoAPIClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.GetVaults = this.GetVaults.bind(this);
        this.GetVault = this.GetVault.bind(this);
        this.LPTokenPriceChart = this.LPTokenPriceChart.bind(this);
        this.TVLChart = this.TVLChart.bind(this);
        this.VaultsByHolderAddress = this.VaultsByHolderAddress.bind(this);
        this.LPHolders = this.LPHolders.bind(this);
        this.Portfolio = this.Portfolio.bind(this);
        this.Leaderboard = this.Leaderboard.bind(this);
        this.LeaderboardEpochs = this.LeaderboardEpochs.bind(this);
        this.TransfersHistory = this.TransfersHistory.bind(this);
        this.GetStakingPools = this.GetStakingPools.bind(this);
        this.StakingRewardByAccount = this.StakingRewardByAccount.bind(this);
        this.StakingHistory = this.StakingHistory.bind(this);
        this.StakingAmountAtHeight = this.StakingAmountAtHeight.bind(this);
        this.StreamTransfers = this.StreamTransfers.bind(this);
        this.StreamVault = this.StreamVault.bind(this);
        this.StreamHolderSubscription = this.StreamHolderSubscription.bind(this);
        this.StreamStakingRewardByAccount = this.StreamStakingRewardByAccount.bind(this);
        this.StreamHistoricalStaking = this.StreamHistoricalStaking.bind(this);
        this.Health = this.Health.bind(this);
        this.Execution = this.Execution.bind(this);
        this.Missions = this.Missions.bind(this);
        this.MissionLeaderboard = this.MissionLeaderboard.bind(this);
        this.ListIDOs = this.ListIDOs.bind(this);
        this.GetIDO = this.GetIDO.bind(this);
        this.GetIDOSubscribers = this.GetIDOSubscribers.bind(this);
        this.GetIDOSubscription = this.GetIDOSubscription.bind(this);
        this.GetIDOActivities = this.GetIDOActivities.bind(this);
        this.GetWhitelist = this.GetWhitelist.bind(this);
        this.TokenMetadata = this.TokenMetadata.bind(this);
        this.GetClaimReferences = this.GetClaimReferences.bind(this);
    }
    GetVaults(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetVaultsDesc, exports.GetVaultsRequest.fromPartial(request), metadata);
    }
    GetVault(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetVaultDesc, exports.GetVaultRequest.fromPartial(request), metadata);
    }
    LPTokenPriceChart(request, metadata) {
        return this.rpc.unary(exports.MitoAPILPTokenPriceChartDesc, exports.LPTokenPriceChartRequest.fromPartial(request), metadata);
    }
    TVLChart(request, metadata) {
        return this.rpc.unary(exports.MitoAPITVLChartDesc, exports.TVLChartRequest.fromPartial(request), metadata);
    }
    VaultsByHolderAddress(request, metadata) {
        return this.rpc.unary(exports.MitoAPIVaultsByHolderAddressDesc, exports.VaultsByHolderAddressRequest.fromPartial(request), metadata);
    }
    LPHolders(request, metadata) {
        return this.rpc.unary(exports.MitoAPILPHoldersDesc, exports.LPHoldersRequest.fromPartial(request), metadata);
    }
    Portfolio(request, metadata) {
        return this.rpc.unary(exports.MitoAPIPortfolioDesc, exports.PortfolioRequest.fromPartial(request), metadata);
    }
    Leaderboard(request, metadata) {
        return this.rpc.unary(exports.MitoAPILeaderboardDesc, exports.LeaderboardRequest.fromPartial(request), metadata);
    }
    LeaderboardEpochs(request, metadata) {
        return this.rpc.unary(exports.MitoAPILeaderboardEpochsDesc, exports.LeaderboardEpochsRequest.fromPartial(request), metadata);
    }
    TransfersHistory(request, metadata) {
        return this.rpc.unary(exports.MitoAPITransfersHistoryDesc, exports.TransfersHistoryRequest.fromPartial(request), metadata);
    }
    GetStakingPools(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetStakingPoolsDesc, exports.GetStakingPoolsRequest.fromPartial(request), metadata);
    }
    StakingRewardByAccount(request, metadata) {
        return this.rpc.unary(exports.MitoAPIStakingRewardByAccountDesc, exports.StakingRewardByAccountRequest.fromPartial(request), metadata);
    }
    StakingHistory(request, metadata) {
        return this.rpc.unary(exports.MitoAPIStakingHistoryDesc, exports.StakingHistoryRequest.fromPartial(request), metadata);
    }
    StakingAmountAtHeight(request, metadata) {
        return this.rpc.unary(exports.MitoAPIStakingAmountAtHeightDesc, exports.StakingAmountAtHeightRequest.fromPartial(request), metadata);
    }
    StreamTransfers(request, metadata) {
        return this.rpc.invoke(exports.MitoAPIStreamTransfersDesc, exports.StreamTransfersRequest.fromPartial(request), metadata);
    }
    StreamVault(request, metadata) {
        return this.rpc.invoke(exports.MitoAPIStreamVaultDesc, exports.StreamVaultRequest.fromPartial(request), metadata);
    }
    StreamHolderSubscription(request, metadata) {
        return this.rpc.invoke(exports.MitoAPIStreamHolderSubscriptionDesc, exports.StreamHolderSubscriptionRequest.fromPartial(request), metadata);
    }
    StreamStakingRewardByAccount(request, metadata) {
        return this.rpc.invoke(exports.MitoAPIStreamStakingRewardByAccountDesc, exports.StreamStakingRewardByAccountRequest.fromPartial(request), metadata);
    }
    StreamHistoricalStaking(request, metadata) {
        return this.rpc.invoke(exports.MitoAPIStreamHistoricalStakingDesc, exports.StreamHistoricalStakingRequest.fromPartial(request), metadata);
    }
    Health(request, metadata) {
        return this.rpc.unary(exports.MitoAPIHealthDesc, exports.HealthRequest.fromPartial(request), metadata);
    }
    Execution(request, metadata) {
        return this.rpc.unary(exports.MitoAPIExecutionDesc, exports.ExecutionRequest.fromPartial(request), metadata);
    }
    Missions(request, metadata) {
        return this.rpc.unary(exports.MitoAPIMissionsDesc, exports.MissionsRequest.fromPartial(request), metadata);
    }
    MissionLeaderboard(request, metadata) {
        return this.rpc.unary(exports.MitoAPIMissionLeaderboardDesc, exports.MissionLeaderboardRequest.fromPartial(request), metadata);
    }
    ListIDOs(request, metadata) {
        return this.rpc.unary(exports.MitoAPIListIDOsDesc, exports.ListIDOsRequest.fromPartial(request), metadata);
    }
    GetIDO(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetIDODesc, exports.GetIDORequest.fromPartial(request), metadata);
    }
    GetIDOSubscribers(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetIDOSubscribersDesc, exports.GetIDOSubscribersRequest.fromPartial(request), metadata);
    }
    GetIDOSubscription(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetIDOSubscriptionDesc, exports.GetIDOSubscriptionRequest.fromPartial(request), metadata);
    }
    GetIDOActivities(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetIDOActivitiesDesc, exports.GetIDOActivitiesRequest.fromPartial(request), metadata);
    }
    GetWhitelist(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetWhitelistDesc, exports.GetWhitelistRequest.fromPartial(request), metadata);
    }
    TokenMetadata(request, metadata) {
        return this.rpc.unary(exports.MitoAPITokenMetadataDesc, exports.TokenMetadataRequest.fromPartial(request), metadata);
    }
    GetClaimReferences(request, metadata) {
        return this.rpc.unary(exports.MitoAPIGetClaimReferencesDesc, exports.GetClaimReferencesRequest.fromPartial(request), metadata);
    }
}
exports.MitoAPIClientImpl = MitoAPIClientImpl;
exports.MitoAPIDesc = { serviceName: "mito_api.MitoAPI" };
exports.MitoAPIGetVaultsDesc = {
    methodName: "GetVaults",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetVaultsRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetVaultsResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetVaultDesc = {
    methodName: "GetVault",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetVaultRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetVaultResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPILPTokenPriceChartDesc = {
    methodName: "LPTokenPriceChart",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.LPTokenPriceChartRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.LPTokenPriceChartResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPITVLChartDesc = {
    methodName: "TVLChart",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.TVLChartRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.TVLChartResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIVaultsByHolderAddressDesc = {
    methodName: "VaultsByHolderAddress",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.VaultsByHolderAddressRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.VaultsByHolderAddressResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPILPHoldersDesc = {
    methodName: "LPHolders",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.LPHoldersRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.LPHoldersResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIPortfolioDesc = {
    methodName: "Portfolio",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.PortfolioRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.PortfolioResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPILeaderboardDesc = {
    methodName: "Leaderboard",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.LeaderboardRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.LeaderboardResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPILeaderboardEpochsDesc = {
    methodName: "LeaderboardEpochs",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.LeaderboardEpochsRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.LeaderboardEpochsResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPITransfersHistoryDesc = {
    methodName: "TransfersHistory",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.TransfersHistoryRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.TransfersHistoryResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetStakingPoolsDesc = {
    methodName: "GetStakingPools",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetStakingPoolsRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetStakingPoolsResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStakingRewardByAccountDesc = {
    methodName: "StakingRewardByAccount",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.StakingRewardByAccountRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StakingRewardByAccountResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStakingHistoryDesc = {
    methodName: "StakingHistory",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.StakingHistoryRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StakingHistoryResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStakingAmountAtHeightDesc = {
    methodName: "StakingAmountAtHeight",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.StakingAmountAtHeightRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StakingAmountAtHeightResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStreamTransfersDesc = {
    methodName: "StreamTransfers",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
        serializeBinary() {
            return exports.StreamTransfersRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StreamTransfersResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStreamVaultDesc = {
    methodName: "StreamVault",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
        serializeBinary() {
            return exports.StreamVaultRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StreamVaultResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStreamHolderSubscriptionDesc = {
    methodName: "StreamHolderSubscription",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
        serializeBinary() {
            return exports.StreamHolderSubscriptionRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StreamHolderSubscriptionResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStreamStakingRewardByAccountDesc = {
    methodName: "StreamStakingRewardByAccount",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
        serializeBinary() {
            return exports.StreamStakingRewardByAccountRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StreamStakingRewardByAccountResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIStreamHistoricalStakingDesc = {
    methodName: "StreamHistoricalStaking",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
        serializeBinary() {
            return exports.StreamHistoricalStakingRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.StreamHistoricalStakingResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIHealthDesc = {
    methodName: "Health",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.HealthRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.HealthResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIExecutionDesc = {
    methodName: "Execution",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.ExecutionRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.ExecutionResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIMissionsDesc = {
    methodName: "Missions",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.MissionsRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.MissionsResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIMissionLeaderboardDesc = {
    methodName: "MissionLeaderboard",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.MissionLeaderboardRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.MissionLeaderboardResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIListIDOsDesc = {
    methodName: "ListIDOs",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.ListIDOsRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.ListIDOsResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetIDODesc = {
    methodName: "GetIDO",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetIDORequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetIDOResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetIDOSubscribersDesc = {
    methodName: "GetIDOSubscribers",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetIDOSubscribersRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetIDOSubscribersResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetIDOSubscriptionDesc = {
    methodName: "GetIDOSubscription",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetIDOSubscriptionRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetIDOSubscriptionResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetIDOActivitiesDesc = {
    methodName: "GetIDOActivities",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetIDOActivitiesRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetIDOActivitiesResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetWhitelistDesc = {
    methodName: "GetWhitelist",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetWhitelistRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetWhitelistResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPITokenMetadataDesc = {
    methodName: "TokenMetadata",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.TokenMetadataRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.TokenMetadataResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
exports.MitoAPIGetClaimReferencesDesc = {
    methodName: "GetClaimReferences",
    service: exports.MitoAPIDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
        serializeBinary() {
            return exports.GetClaimReferencesRequest.encode(this).finish();
        },
    },
    responseType: {
        deserializeBinary(data) {
            const value = exports.GetClaimReferencesResponse.decode(data);
            return Object.assign(Object.assign({}, value), { toObject() {
                    return value;
                } });
        },
    },
};
class GrpcWebImpl {
    constructor(host, options) {
        this.host = host;
        this.options = options;
    }
    unary(methodDesc, _request, metadata) {
        var _a;
        const request = Object.assign(Object.assign({}, _request), methodDesc.requestType);
        const maybeCombinedMetadata = metadata && this.options.metadata
            ? new browser_headers_1.BrowserHeaders(Object.assign(Object.assign({}, (_a = this.options) === null || _a === void 0 ? void 0 : _a.metadata.headersMap), metadata === null || metadata === void 0 ? void 0 : metadata.headersMap))
            : metadata || this.options.metadata;
        return new Promise((resolve, reject) => {
            grpc_web_1.grpc.unary(methodDesc, {
                request,
                host: this.host,
                metadata: maybeCombinedMetadata,
                transport: this.options.transport,
                debug: this.options.debug,
                onEnd: function (response) {
                    if (response.status === grpc_web_1.grpc.Code.OK) {
                        resolve(response.message.toObject());
                    }
                    else {
                        const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
                        reject(err);
                    }
                },
            });
        });
    }
    invoke(methodDesc, _request, metadata) {
        var _a;
        const upStreamCodes = this.options.upStreamRetryCodes || [];
        const DEFAULT_TIMEOUT_TIME = 3000;
        const request = Object.assign(Object.assign({}, _request), methodDesc.requestType);
        const maybeCombinedMetadata = metadata && this.options.metadata
            ? new browser_headers_1.BrowserHeaders(Object.assign(Object.assign({}, (_a = this.options) === null || _a === void 0 ? void 0 : _a.metadata.headersMap), metadata === null || metadata === void 0 ? void 0 : metadata.headersMap))
            : metadata || this.options.metadata;
        return new rxjs_1.Observable((observer) => {
            const upStream = (() => {
                const client = grpc_web_1.grpc.invoke(methodDesc, {
                    host: this.host,
                    request,
                    transport: this.options.streamingTransport || this.options.transport,
                    metadata: maybeCombinedMetadata,
                    debug: this.options.debug,
                    onMessage: (next) => observer.next(next),
                    onEnd: (code, message, trailers) => {
                        if (code === 0) {
                            observer.complete();
                        }
                        else if (upStreamCodes.includes(code)) {
                            setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
                        }
                        else {
                            const err = new Error(message);
                            err.code = code;
                            err.metadata = trailers;
                            observer.error(err);
                        }
                    },
                });
                observer.add(() => {
                    if (!observer.closed) {
                        return client.close();
                    }
                });
            });
            upStream();
        }).pipe((0, operators_1.share)());
    }
}
exports.GrpcWebImpl = GrpcWebImpl;
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToString(long) {
    return long.toString();
}
if (minimal_js_1.default.util.Long !== long_1.default) {
    minimal_js_1.default.util.Long = long_1.default;
    minimal_js_1.default.configure();
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
class GrpcWebError extends tsProtoGlobalThis.Error {
    constructor(message, code, metadata) {
        super(message);
        this.code = code;
        this.metadata = metadata;
    }
}
exports.GrpcWebError = GrpcWebError;
