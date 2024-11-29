import { grpc } from "@injectivelabs/grpc-web";
import _m0 from "protobufjs/minimal.js";
import { Observable } from "rxjs";
export declare const protobufPackage = "mito_api";
export interface GetVaultsRequest {
    limit?: number | undefined;
    pageIndex?: number | undefined;
    codeId?: string | undefined;
}
export interface GetVaultsResponse {
    /** Vaults data response */
    vaults: Vault[];
    pagination: Pagination | undefined;
}
export interface Vault {
    contractAddress: string;
    codeId: string;
    vaultName: string;
    marketId: string;
    currentTvl: number;
    profits: Changes | undefined;
    updatedAt: string;
    vaultType: string;
    lpTokenPrice: number;
    subaccountInfo: SubaccountBalance | undefined;
    masterContractAddress: string;
    totalLpAmount: string;
    slug: string;
    createdAt: string;
    notionalValueCap: string;
    tvlChanges: Changes | undefined;
    apy: number;
    apy7D: number;
    apy7DFq: number;
    apyue: number;
    apyV3: number;
    registrationMode: string;
}
export interface Changes {
    allTimeChange: number;
    threeMonthsChange?: number | undefined;
    oneMonthChange?: number | undefined;
    oneDayChange?: number | undefined;
    oneWeekChange?: number | undefined;
    oneYearChange?: number | undefined;
    threeYearsChange?: number | undefined;
    sixMonthsChange?: number | undefined;
}
export interface SubaccountBalance {
    subaccountId: string;
    balances: DenomBalance[];
}
export interface DenomBalance {
    denom: string;
    totalBalance: string;
    price?: string | undefined;
    updatedAt?: string | undefined;
    source?: string | undefined;
}
export interface Pagination {
    total: number;
}
export interface GetVaultRequest {
    contractAddress?: string | undefined;
    slug?: string | undefined;
}
export interface GetVaultResponse {
    /**
     * Vault data response, if query by slug, there can be multiple vaults matching
     * the condition
     */
    vault: Vault[];
}
export interface LPTokenPriceChartRequest {
    vaultAddress: string;
    fromTime?: string | undefined;
    toTime?: string | undefined;
}
export interface LPTokenPriceChartResponse {
    prices: PriceSnapshot[];
}
export interface PriceSnapshot {
    price: number;
    updatedAt: string;
}
export interface TVLChartRequest {
    vaultAddress: string;
    fromTime?: string | undefined;
    toTime?: string | undefined;
}
export interface TVLChartResponse {
    prices: PriceSnapshot[];
}
export interface VaultsByHolderAddressRequest {
    limit?: number | undefined;
    pageIndex?: number | undefined;
    holderAddress: string;
    vaultAddress?: string | undefined;
    skip?: number | undefined;
}
export interface VaultsByHolderAddressResponse {
    subscriptions: Subscription[];
    pagination: Pagination | undefined;
}
export interface Subscription {
    vaultInfo: Vault | undefined;
    lpAmount: string;
    holderAddress: string;
    lpAmountPercentage: number;
}
export interface LPHoldersRequest {
    limit?: number | undefined;
    pageIndex?: number | undefined;
    vaultAddress: string;
    stakingContractAddress?: string | undefined;
    skip?: number | undefined;
}
export interface LPHoldersResponse {
    holders: Holders[];
    pagination: Pagination | undefined;
}
export interface Holders {
    holderAddress: string;
    vaultAddress: string;
    amount: string;
    updatedAt: string;
    lpAmountPercentage: number;
    redemptionLockTime: string;
    stakedAmount: string;
}
export interface PortfolioRequest {
    holderAddress: string;
    stakingContractAddress?: string | undefined;
}
export interface PortfolioResponse {
    totalValue: number;
    pnl: number;
    totalValueChart: PriceSnapshot[];
    pnlChart: PriceSnapshot[];
    pnlUpdatedAt: string;
}
export interface LeaderboardRequest {
    epochId?: number | undefined;
}
export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    snapshotBlock: string;
    updatedAt: string;
    epochId: number;
}
export interface LeaderboardEntry {
    address: string;
    pnl: number;
}
export interface LeaderboardEpochsRequest {
    fromEpochId?: number | undefined;
    toEpochId?: number | undefined;
    limit?: number | undefined;
}
export interface LeaderboardEpochsResponse {
    epochs: LeaderboardEpoch[];
    pagination: Pagination | undefined;
}
export interface LeaderboardEpoch {
    epochId: number;
    startAt: string;
    endAt: string;
    isLive: boolean;
}
export interface TransfersHistoryRequest {
    vault?: string | undefined;
    account?: string | undefined;
    limit?: number | undefined;
    fromNumber?: number | undefined;
    toNumber?: number | undefined;
}
export interface TransfersHistoryResponse {
    transfers: Transfer[];
    pagination: Pagination | undefined;
}
export interface Transfer {
    lpAmount: string;
    coins: Coin[];
    usdValue: string;
    isDeposit: boolean;
    /** time in unix milli */
    executedAt: string;
    account: string;
    vault: string;
    txHash: string;
    tidByVault: number;
    tidByAccount: number;
}
export interface Coin {
    amount: string;
    denom: string;
}
export interface GetStakingPoolsRequest {
    staker?: string | undefined;
    stakingContractAddress: string;
}
export interface GetStakingPoolsResponse {
    pools: StakingPool[];
    pagination: Pagination | undefined;
}
export interface StakingPool {
    vaultName: string;
    vaultAddress: string;
    stakeDenom: string;
    gauges: Gauge[];
    apr: number;
    totalLiquidity: number;
    stakingAddress: string;
    /** denom => APR%, breakdown of staking APR */
    aprBreakdown: {
        [key: string]: number;
    };
}
export interface StakingPool_AprBreakdownEntry {
    key: string;
    value: number;
}
export interface Gauge {
    id: string;
    owner: string;
    startTimestamp: string;
    endTimestamp: string;
    rewardTokens: Coin[];
    lastDistribution: number;
    status: string;
}
export interface StakingRewardByAccountRequest {
    staker: string;
    stakingContractAddress: string;
}
export interface StakingRewardByAccountResponse {
    rewards: StakingReward[];
    pagination: Pagination | undefined;
}
export interface StakingReward {
    vaultName: string;
    vaultAddress: string;
    stakedAmount: Coin | undefined;
    apr: number;
    claimableRewards: Coin[];
    lockTimestamp: string;
    lockedAmount: Coin | undefined;
}
export interface StakingHistoryRequest {
    fromNumber?: number | undefined;
    toNumber?: number | undefined;
    limit?: number | undefined;
    staker?: string | undefined;
}
export interface StakingHistoryResponse {
    activities: StakingActivity[];
    pagination: Pagination | undefined;
}
export interface StakingActivity {
    stakeAmount: Coin | undefined;
    vaultAddress: string;
    action: string;
    txHash: string;
    rewardedTokens: Coin[];
    timestamp: string;
    staker: string;
    numberByAccount: number;
}
export interface StakingAmountAtHeightRequest {
    stakingContractAddress: string;
    denom: string;
    /** [Optional] Max block height, latest if not set */
    height?: string | undefined;
    /** [Optional] Staker address */
    staker?: string | undefined;
    skip?: number | undefined;
    limit?: number | undefined;
}
export interface StakingAmountAtHeightResponse {
    stakers: StakingAmount[];
}
export interface StakingAmount {
    staker: string;
    amount: Coin | undefined;
    latestHeight: string;
}
export interface StreamTransfersRequest {
    vault?: string | undefined;
    account?: string | undefined;
}
export interface StreamTransfersResponse {
    data: Transfer | undefined;
    /** Update type */
    opType?: string | undefined;
}
export interface StreamVaultRequest {
    vault: string;
}
export interface StreamVaultResponse {
    data: Vault | undefined;
    /** Update type */
    opType?: string | undefined;
}
export interface StreamHolderSubscriptionRequest {
    holderAddress: string;
    vaultAddress?: string | undefined;
    stakingContractAddress: string;
}
export interface StreamHolderSubscriptionResponse {
    data: Subscription | undefined;
    /** Update type */
    opType?: string | undefined;
}
export interface StreamStakingRewardByAccountRequest {
    staker: string;
    stakingContractAddress: string;
}
export interface StreamStakingRewardByAccountResponse {
    data: StakingReward | undefined;
    /** Update type */
    opType?: string | undefined;
}
export interface StreamHistoricalStakingRequest {
    staker: string;
    stakingContractAddress: string;
}
export interface StreamHistoricalStakingResponse {
    data: StakingActivity | undefined;
    /** Update type */
    opType?: string | undefined;
}
export interface HealthRequest {
}
export interface HealthResponse {
    version: string;
    commit: string;
    lastestSyncedBlock: string;
    chainHeight: string;
    status: string;
    blockDiffThreshold: number;
}
export interface ExecutionRequest {
    contractAddress: string;
}
export interface ExecutionResponse {
    contractAddress: string;
    currentBlock: string;
    lastExecutedBlock: string;
    lastErrorBlock: string;
    executionLogs: ExecutionLog[];
    lastErrorLog: ExecutionLog | undefined;
}
export interface ExecutionLog {
    block: string;
    response: string;
    error: string;
}
export interface MissionsRequest {
    accountAddress: string;
}
export interface MissionsResponse {
    data: Mission[];
    rank?: string | undefined;
}
export interface Mission {
    id: string;
    points: string;
    completed: boolean;
    accruedPoints: string;
    updatedAt: string;
    progress: number;
    expected: number;
}
export interface MissionLeaderboardRequest {
    userAddress?: string | undefined;
}
export interface MissionLeaderboardResponse {
    data: MissionLeaderboardEntry[];
    updatedAt: string;
    userRank?: string | undefined;
}
export interface MissionLeaderboardEntry {
    address: string;
    accruedPoints: string;
}
export interface ListIDOsRequest {
    status?: string | undefined;
    limit?: number | undefined;
    toNumber?: number | undefined;
    accountAddress?: string | undefined;
    ownerAddress?: string | undefined;
}
export interface ListIDOsResponse {
    idos: IDO[];
    pagination: Pagination | undefined;
}
export interface IDO {
    startTime: string;
    endTime: string;
    owner: string;
    status: string;
    tokenInfo: TokenInfo | undefined;
    projectTokenAmount: string;
    quoteDenom: string;
    targetAmountInQuoteDenom: string;
    targetAmountInUsd: string;
    capPerAddress: string;
    contractAddress: string;
    subscribedAmount: string;
    tokenPrice: number;
    isAccountWhiteListed: boolean;
    name: string;
    progress: IDOProgress[];
    stakeToSubscription: ArrayOfString[];
    secondBeforeStartToSetQuotePrice: string;
    useWhitelist: boolean;
    marketId: string;
    vaultAddress: string;
    isLaunchWithVault: boolean;
    isVestingScheduleEnabled: boolean;
    initParams: InitParams | undefined;
}
export interface TokenInfo {
    denom: string;
    supply: string;
    symbol: string;
    decimal: number;
    logoUrl: string;
}
export interface IDOProgress {
    status: string;
    timestamp: string;
}
export interface ArrayOfString {
    field: string[];
}
export interface InitParams {
    vestingConfig: VestingConfigMap | undefined;
}
export interface VestingConfigMap {
    projectOwnerQuote: VestingConfig | undefined;
    projectOwnerLpTokens: VestingConfig | undefined;
    usersProjectToken: VestingConfig | undefined;
}
export interface VestingConfig {
    vestingDurationSeconds?: string | undefined;
    vestingStartDelaySeconds?: string | undefined;
    schedule?: string | undefined;
}
export interface GetIDORequest {
    contractAddress: string;
    accountAddress?: string | undefined;
}
export interface GetIDOResponse {
    ido: IDO | undefined;
}
export interface GetIDOSubscribersRequest {
    contractAddress: string;
    limit?: number | undefined;
    skip?: number | undefined;
    sortBy?: string | undefined;
}
export interface GetIDOSubscribersResponse {
    subscribers: IDOSubscriber[];
    pagination: Pagination | undefined;
    tokenInfo: TokenInfo | undefined;
    quoteDenom: string;
    marketId: string;
}
export interface IDOSubscriber {
    address: string;
    subscribedCoin: Coin | undefined;
    lastSubscribeTime: string;
    estimateTokenReceived: Coin | undefined;
    estimateLpAmount: Coin | undefined;
    estimateRefundAmount: Coin | undefined;
    createdAt: string;
}
export interface GetIDOSubscriptionRequest {
    /** Ido contract address */
    contractAddress: string;
    /** Subscriber account address */
    accountAddress: string;
}
export interface GetIDOSubscriptionResponse {
    subscription: IDOSubscription | undefined;
}
export interface IDOSubscription {
    maxSubscriptionCoin: Coin | undefined;
    committedAmount: string;
    price: number;
    claimableCoins: Coin[];
    updatedAt: string;
    rewardClaimed: boolean;
    tokenInfo: TokenInfo | undefined;
    quoteDenom: string;
    stakedAmount: string;
    claimTxHash?: string | undefined;
    ownerClaimableCoins: Coin[];
    marketId: string;
    weight: string;
    claimedCoins: IDOClaimedCoins | undefined;
}
export interface IDOClaimedCoins {
    claimedCoins: Coin[];
    updatedAt: string;
}
export interface GetIDOActivitiesRequest {
    contractAddress?: string | undefined;
    accountAddress?: string | undefined;
    limit?: number | undefined;
    toNumber?: string | undefined;
}
export interface GetIDOActivitiesResponse {
    activities: IDOSubscriptionActivity[];
    pagination: Pagination | undefined;
}
export interface IDOSubscriptionActivity {
    address: string;
    subscribedCoin: Coin | undefined;
    usdValue: number;
    timestamp: string;
    txHash: string;
}
export interface GetWhitelistRequest {
    idoAddress: string;
    skip?: number | undefined;
    limit?: number | undefined;
}
export interface GetWhitelistResponse {
    idoAddress?: string | undefined;
    accounts: WhitelistAccount[];
    pagination: Pagination | undefined;
}
export interface WhitelistAccount {
    accountAddress: string;
    updatedAt: string;
    weight: string;
}
export interface TokenMetadataRequest {
}
export interface TokenMetadataResponse {
    data: string;
}
export interface GetClaimReferencesRequest {
    accountAddress: string;
    idoAddress: string;
    skip?: number | undefined;
    limit?: number | undefined;
}
export interface GetClaimReferencesResponse {
    claimReferences: ClaimReference[];
    pagination: Pagination | undefined;
}
export interface ClaimReference {
    accountAddress: string;
    cwContractAddress: string;
    idoContractAddress: string;
    startVestingTime: string;
    vestingDurationSeconds: string;
    updatedAt: string;
    claimedAmount: string;
    claimableAmount: string;
    denom: string;
}
export declare const GetVaultsRequest: {
    encode(message: GetVaultsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVaultsRequest;
    fromJSON(object: any): GetVaultsRequest;
    toJSON(message: GetVaultsRequest): unknown;
    create(base?: DeepPartial<GetVaultsRequest>): GetVaultsRequest;
    fromPartial(object: DeepPartial<GetVaultsRequest>): GetVaultsRequest;
};
export declare const GetVaultsResponse: {
    encode(message: GetVaultsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVaultsResponse;
    fromJSON(object: any): GetVaultsResponse;
    toJSON(message: GetVaultsResponse): unknown;
    create(base?: DeepPartial<GetVaultsResponse>): GetVaultsResponse;
    fromPartial(object: DeepPartial<GetVaultsResponse>): GetVaultsResponse;
};
export declare const Vault: {
    encode(message: Vault, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Vault;
    fromJSON(object: any): Vault;
    toJSON(message: Vault): unknown;
    create(base?: DeepPartial<Vault>): Vault;
    fromPartial(object: DeepPartial<Vault>): Vault;
};
export declare const Changes: {
    encode(message: Changes, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Changes;
    fromJSON(object: any): Changes;
    toJSON(message: Changes): unknown;
    create(base?: DeepPartial<Changes>): Changes;
    fromPartial(object: DeepPartial<Changes>): Changes;
};
export declare const SubaccountBalance: {
    encode(message: SubaccountBalance, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubaccountBalance;
    fromJSON(object: any): SubaccountBalance;
    toJSON(message: SubaccountBalance): unknown;
    create(base?: DeepPartial<SubaccountBalance>): SubaccountBalance;
    fromPartial(object: DeepPartial<SubaccountBalance>): SubaccountBalance;
};
export declare const DenomBalance: {
    encode(message: DenomBalance, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DenomBalance;
    fromJSON(object: any): DenomBalance;
    toJSON(message: DenomBalance): unknown;
    create(base?: DeepPartial<DenomBalance>): DenomBalance;
    fromPartial(object: DeepPartial<DenomBalance>): DenomBalance;
};
export declare const Pagination: {
    encode(message: Pagination, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Pagination;
    fromJSON(object: any): Pagination;
    toJSON(message: Pagination): unknown;
    create(base?: DeepPartial<Pagination>): Pagination;
    fromPartial(object: DeepPartial<Pagination>): Pagination;
};
export declare const GetVaultRequest: {
    encode(message: GetVaultRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVaultRequest;
    fromJSON(object: any): GetVaultRequest;
    toJSON(message: GetVaultRequest): unknown;
    create(base?: DeepPartial<GetVaultRequest>): GetVaultRequest;
    fromPartial(object: DeepPartial<GetVaultRequest>): GetVaultRequest;
};
export declare const GetVaultResponse: {
    encode(message: GetVaultResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetVaultResponse;
    fromJSON(object: any): GetVaultResponse;
    toJSON(message: GetVaultResponse): unknown;
    create(base?: DeepPartial<GetVaultResponse>): GetVaultResponse;
    fromPartial(object: DeepPartial<GetVaultResponse>): GetVaultResponse;
};
export declare const LPTokenPriceChartRequest: {
    encode(message: LPTokenPriceChartRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LPTokenPriceChartRequest;
    fromJSON(object: any): LPTokenPriceChartRequest;
    toJSON(message: LPTokenPriceChartRequest): unknown;
    create(base?: DeepPartial<LPTokenPriceChartRequest>): LPTokenPriceChartRequest;
    fromPartial(object: DeepPartial<LPTokenPriceChartRequest>): LPTokenPriceChartRequest;
};
export declare const LPTokenPriceChartResponse: {
    encode(message: LPTokenPriceChartResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LPTokenPriceChartResponse;
    fromJSON(object: any): LPTokenPriceChartResponse;
    toJSON(message: LPTokenPriceChartResponse): unknown;
    create(base?: DeepPartial<LPTokenPriceChartResponse>): LPTokenPriceChartResponse;
    fromPartial(object: DeepPartial<LPTokenPriceChartResponse>): LPTokenPriceChartResponse;
};
export declare const PriceSnapshot: {
    encode(message: PriceSnapshot, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PriceSnapshot;
    fromJSON(object: any): PriceSnapshot;
    toJSON(message: PriceSnapshot): unknown;
    create(base?: DeepPartial<PriceSnapshot>): PriceSnapshot;
    fromPartial(object: DeepPartial<PriceSnapshot>): PriceSnapshot;
};
export declare const TVLChartRequest: {
    encode(message: TVLChartRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TVLChartRequest;
    fromJSON(object: any): TVLChartRequest;
    toJSON(message: TVLChartRequest): unknown;
    create(base?: DeepPartial<TVLChartRequest>): TVLChartRequest;
    fromPartial(object: DeepPartial<TVLChartRequest>): TVLChartRequest;
};
export declare const TVLChartResponse: {
    encode(message: TVLChartResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TVLChartResponse;
    fromJSON(object: any): TVLChartResponse;
    toJSON(message: TVLChartResponse): unknown;
    create(base?: DeepPartial<TVLChartResponse>): TVLChartResponse;
    fromPartial(object: DeepPartial<TVLChartResponse>): TVLChartResponse;
};
export declare const VaultsByHolderAddressRequest: {
    encode(message: VaultsByHolderAddressRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VaultsByHolderAddressRequest;
    fromJSON(object: any): VaultsByHolderAddressRequest;
    toJSON(message: VaultsByHolderAddressRequest): unknown;
    create(base?: DeepPartial<VaultsByHolderAddressRequest>): VaultsByHolderAddressRequest;
    fromPartial(object: DeepPartial<VaultsByHolderAddressRequest>): VaultsByHolderAddressRequest;
};
export declare const VaultsByHolderAddressResponse: {
    encode(message: VaultsByHolderAddressResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VaultsByHolderAddressResponse;
    fromJSON(object: any): VaultsByHolderAddressResponse;
    toJSON(message: VaultsByHolderAddressResponse): unknown;
    create(base?: DeepPartial<VaultsByHolderAddressResponse>): VaultsByHolderAddressResponse;
    fromPartial(object: DeepPartial<VaultsByHolderAddressResponse>): VaultsByHolderAddressResponse;
};
export declare const Subscription: {
    encode(message: Subscription, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Subscription;
    fromJSON(object: any): Subscription;
    toJSON(message: Subscription): unknown;
    create(base?: DeepPartial<Subscription>): Subscription;
    fromPartial(object: DeepPartial<Subscription>): Subscription;
};
export declare const LPHoldersRequest: {
    encode(message: LPHoldersRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LPHoldersRequest;
    fromJSON(object: any): LPHoldersRequest;
    toJSON(message: LPHoldersRequest): unknown;
    create(base?: DeepPartial<LPHoldersRequest>): LPHoldersRequest;
    fromPartial(object: DeepPartial<LPHoldersRequest>): LPHoldersRequest;
};
export declare const LPHoldersResponse: {
    encode(message: LPHoldersResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LPHoldersResponse;
    fromJSON(object: any): LPHoldersResponse;
    toJSON(message: LPHoldersResponse): unknown;
    create(base?: DeepPartial<LPHoldersResponse>): LPHoldersResponse;
    fromPartial(object: DeepPartial<LPHoldersResponse>): LPHoldersResponse;
};
export declare const Holders: {
    encode(message: Holders, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Holders;
    fromJSON(object: any): Holders;
    toJSON(message: Holders): unknown;
    create(base?: DeepPartial<Holders>): Holders;
    fromPartial(object: DeepPartial<Holders>): Holders;
};
export declare const PortfolioRequest: {
    encode(message: PortfolioRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PortfolioRequest;
    fromJSON(object: any): PortfolioRequest;
    toJSON(message: PortfolioRequest): unknown;
    create(base?: DeepPartial<PortfolioRequest>): PortfolioRequest;
    fromPartial(object: DeepPartial<PortfolioRequest>): PortfolioRequest;
};
export declare const PortfolioResponse: {
    encode(message: PortfolioResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): PortfolioResponse;
    fromJSON(object: any): PortfolioResponse;
    toJSON(message: PortfolioResponse): unknown;
    create(base?: DeepPartial<PortfolioResponse>): PortfolioResponse;
    fromPartial(object: DeepPartial<PortfolioResponse>): PortfolioResponse;
};
export declare const LeaderboardRequest: {
    encode(message: LeaderboardRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardRequest;
    fromJSON(object: any): LeaderboardRequest;
    toJSON(message: LeaderboardRequest): unknown;
    create(base?: DeepPartial<LeaderboardRequest>): LeaderboardRequest;
    fromPartial(object: DeepPartial<LeaderboardRequest>): LeaderboardRequest;
};
export declare const LeaderboardResponse: {
    encode(message: LeaderboardResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardResponse;
    fromJSON(object: any): LeaderboardResponse;
    toJSON(message: LeaderboardResponse): unknown;
    create(base?: DeepPartial<LeaderboardResponse>): LeaderboardResponse;
    fromPartial(object: DeepPartial<LeaderboardResponse>): LeaderboardResponse;
};
export declare const LeaderboardEntry: {
    encode(message: LeaderboardEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardEntry;
    fromJSON(object: any): LeaderboardEntry;
    toJSON(message: LeaderboardEntry): unknown;
    create(base?: DeepPartial<LeaderboardEntry>): LeaderboardEntry;
    fromPartial(object: DeepPartial<LeaderboardEntry>): LeaderboardEntry;
};
export declare const LeaderboardEpochsRequest: {
    encode(message: LeaderboardEpochsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardEpochsRequest;
    fromJSON(object: any): LeaderboardEpochsRequest;
    toJSON(message: LeaderboardEpochsRequest): unknown;
    create(base?: DeepPartial<LeaderboardEpochsRequest>): LeaderboardEpochsRequest;
    fromPartial(object: DeepPartial<LeaderboardEpochsRequest>): LeaderboardEpochsRequest;
};
export declare const LeaderboardEpochsResponse: {
    encode(message: LeaderboardEpochsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardEpochsResponse;
    fromJSON(object: any): LeaderboardEpochsResponse;
    toJSON(message: LeaderboardEpochsResponse): unknown;
    create(base?: DeepPartial<LeaderboardEpochsResponse>): LeaderboardEpochsResponse;
    fromPartial(object: DeepPartial<LeaderboardEpochsResponse>): LeaderboardEpochsResponse;
};
export declare const LeaderboardEpoch: {
    encode(message: LeaderboardEpoch, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardEpoch;
    fromJSON(object: any): LeaderboardEpoch;
    toJSON(message: LeaderboardEpoch): unknown;
    create(base?: DeepPartial<LeaderboardEpoch>): LeaderboardEpoch;
    fromPartial(object: DeepPartial<LeaderboardEpoch>): LeaderboardEpoch;
};
export declare const TransfersHistoryRequest: {
    encode(message: TransfersHistoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransfersHistoryRequest;
    fromJSON(object: any): TransfersHistoryRequest;
    toJSON(message: TransfersHistoryRequest): unknown;
    create(base?: DeepPartial<TransfersHistoryRequest>): TransfersHistoryRequest;
    fromPartial(object: DeepPartial<TransfersHistoryRequest>): TransfersHistoryRequest;
};
export declare const TransfersHistoryResponse: {
    encode(message: TransfersHistoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TransfersHistoryResponse;
    fromJSON(object: any): TransfersHistoryResponse;
    toJSON(message: TransfersHistoryResponse): unknown;
    create(base?: DeepPartial<TransfersHistoryResponse>): TransfersHistoryResponse;
    fromPartial(object: DeepPartial<TransfersHistoryResponse>): TransfersHistoryResponse;
};
export declare const Transfer: {
    encode(message: Transfer, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Transfer;
    fromJSON(object: any): Transfer;
    toJSON(message: Transfer): unknown;
    create(base?: DeepPartial<Transfer>): Transfer;
    fromPartial(object: DeepPartial<Transfer>): Transfer;
};
export declare const Coin: {
    encode(message: Coin, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Coin;
    fromJSON(object: any): Coin;
    toJSON(message: Coin): unknown;
    create(base?: DeepPartial<Coin>): Coin;
    fromPartial(object: DeepPartial<Coin>): Coin;
};
export declare const GetStakingPoolsRequest: {
    encode(message: GetStakingPoolsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetStakingPoolsRequest;
    fromJSON(object: any): GetStakingPoolsRequest;
    toJSON(message: GetStakingPoolsRequest): unknown;
    create(base?: DeepPartial<GetStakingPoolsRequest>): GetStakingPoolsRequest;
    fromPartial(object: DeepPartial<GetStakingPoolsRequest>): GetStakingPoolsRequest;
};
export declare const GetStakingPoolsResponse: {
    encode(message: GetStakingPoolsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetStakingPoolsResponse;
    fromJSON(object: any): GetStakingPoolsResponse;
    toJSON(message: GetStakingPoolsResponse): unknown;
    create(base?: DeepPartial<GetStakingPoolsResponse>): GetStakingPoolsResponse;
    fromPartial(object: DeepPartial<GetStakingPoolsResponse>): GetStakingPoolsResponse;
};
export declare const StakingPool: {
    encode(message: StakingPool, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingPool;
    fromJSON(object: any): StakingPool;
    toJSON(message: StakingPool): unknown;
    create(base?: DeepPartial<StakingPool>): StakingPool;
    fromPartial(object: DeepPartial<StakingPool>): StakingPool;
};
export declare const StakingPool_AprBreakdownEntry: {
    encode(message: StakingPool_AprBreakdownEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingPool_AprBreakdownEntry;
    fromJSON(object: any): StakingPool_AprBreakdownEntry;
    toJSON(message: StakingPool_AprBreakdownEntry): unknown;
    create(base?: DeepPartial<StakingPool_AprBreakdownEntry>): StakingPool_AprBreakdownEntry;
    fromPartial(object: DeepPartial<StakingPool_AprBreakdownEntry>): StakingPool_AprBreakdownEntry;
};
export declare const Gauge: {
    encode(message: Gauge, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Gauge;
    fromJSON(object: any): Gauge;
    toJSON(message: Gauge): unknown;
    create(base?: DeepPartial<Gauge>): Gauge;
    fromPartial(object: DeepPartial<Gauge>): Gauge;
};
export declare const StakingRewardByAccountRequest: {
    encode(message: StakingRewardByAccountRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingRewardByAccountRequest;
    fromJSON(object: any): StakingRewardByAccountRequest;
    toJSON(message: StakingRewardByAccountRequest): unknown;
    create(base?: DeepPartial<StakingRewardByAccountRequest>): StakingRewardByAccountRequest;
    fromPartial(object: DeepPartial<StakingRewardByAccountRequest>): StakingRewardByAccountRequest;
};
export declare const StakingRewardByAccountResponse: {
    encode(message: StakingRewardByAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingRewardByAccountResponse;
    fromJSON(object: any): StakingRewardByAccountResponse;
    toJSON(message: StakingRewardByAccountResponse): unknown;
    create(base?: DeepPartial<StakingRewardByAccountResponse>): StakingRewardByAccountResponse;
    fromPartial(object: DeepPartial<StakingRewardByAccountResponse>): StakingRewardByAccountResponse;
};
export declare const StakingReward: {
    encode(message: StakingReward, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingReward;
    fromJSON(object: any): StakingReward;
    toJSON(message: StakingReward): unknown;
    create(base?: DeepPartial<StakingReward>): StakingReward;
    fromPartial(object: DeepPartial<StakingReward>): StakingReward;
};
export declare const StakingHistoryRequest: {
    encode(message: StakingHistoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingHistoryRequest;
    fromJSON(object: any): StakingHistoryRequest;
    toJSON(message: StakingHistoryRequest): unknown;
    create(base?: DeepPartial<StakingHistoryRequest>): StakingHistoryRequest;
    fromPartial(object: DeepPartial<StakingHistoryRequest>): StakingHistoryRequest;
};
export declare const StakingHistoryResponse: {
    encode(message: StakingHistoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingHistoryResponse;
    fromJSON(object: any): StakingHistoryResponse;
    toJSON(message: StakingHistoryResponse): unknown;
    create(base?: DeepPartial<StakingHistoryResponse>): StakingHistoryResponse;
    fromPartial(object: DeepPartial<StakingHistoryResponse>): StakingHistoryResponse;
};
export declare const StakingActivity: {
    encode(message: StakingActivity, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingActivity;
    fromJSON(object: any): StakingActivity;
    toJSON(message: StakingActivity): unknown;
    create(base?: DeepPartial<StakingActivity>): StakingActivity;
    fromPartial(object: DeepPartial<StakingActivity>): StakingActivity;
};
export declare const StakingAmountAtHeightRequest: {
    encode(message: StakingAmountAtHeightRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingAmountAtHeightRequest;
    fromJSON(object: any): StakingAmountAtHeightRequest;
    toJSON(message: StakingAmountAtHeightRequest): unknown;
    create(base?: DeepPartial<StakingAmountAtHeightRequest>): StakingAmountAtHeightRequest;
    fromPartial(object: DeepPartial<StakingAmountAtHeightRequest>): StakingAmountAtHeightRequest;
};
export declare const StakingAmountAtHeightResponse: {
    encode(message: StakingAmountAtHeightResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingAmountAtHeightResponse;
    fromJSON(object: any): StakingAmountAtHeightResponse;
    toJSON(message: StakingAmountAtHeightResponse): unknown;
    create(base?: DeepPartial<StakingAmountAtHeightResponse>): StakingAmountAtHeightResponse;
    fromPartial(object: DeepPartial<StakingAmountAtHeightResponse>): StakingAmountAtHeightResponse;
};
export declare const StakingAmount: {
    encode(message: StakingAmount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StakingAmount;
    fromJSON(object: any): StakingAmount;
    toJSON(message: StakingAmount): unknown;
    create(base?: DeepPartial<StakingAmount>): StakingAmount;
    fromPartial(object: DeepPartial<StakingAmount>): StakingAmount;
};
export declare const StreamTransfersRequest: {
    encode(message: StreamTransfersRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTransfersRequest;
    fromJSON(object: any): StreamTransfersRequest;
    toJSON(message: StreamTransfersRequest): unknown;
    create(base?: DeepPartial<StreamTransfersRequest>): StreamTransfersRequest;
    fromPartial(object: DeepPartial<StreamTransfersRequest>): StreamTransfersRequest;
};
export declare const StreamTransfersResponse: {
    encode(message: StreamTransfersResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTransfersResponse;
    fromJSON(object: any): StreamTransfersResponse;
    toJSON(message: StreamTransfersResponse): unknown;
    create(base?: DeepPartial<StreamTransfersResponse>): StreamTransfersResponse;
    fromPartial(object: DeepPartial<StreamTransfersResponse>): StreamTransfersResponse;
};
export declare const StreamVaultRequest: {
    encode(message: StreamVaultRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamVaultRequest;
    fromJSON(object: any): StreamVaultRequest;
    toJSON(message: StreamVaultRequest): unknown;
    create(base?: DeepPartial<StreamVaultRequest>): StreamVaultRequest;
    fromPartial(object: DeepPartial<StreamVaultRequest>): StreamVaultRequest;
};
export declare const StreamVaultResponse: {
    encode(message: StreamVaultResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamVaultResponse;
    fromJSON(object: any): StreamVaultResponse;
    toJSON(message: StreamVaultResponse): unknown;
    create(base?: DeepPartial<StreamVaultResponse>): StreamVaultResponse;
    fromPartial(object: DeepPartial<StreamVaultResponse>): StreamVaultResponse;
};
export declare const StreamHolderSubscriptionRequest: {
    encode(message: StreamHolderSubscriptionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamHolderSubscriptionRequest;
    fromJSON(object: any): StreamHolderSubscriptionRequest;
    toJSON(message: StreamHolderSubscriptionRequest): unknown;
    create(base?: DeepPartial<StreamHolderSubscriptionRequest>): StreamHolderSubscriptionRequest;
    fromPartial(object: DeepPartial<StreamHolderSubscriptionRequest>): StreamHolderSubscriptionRequest;
};
export declare const StreamHolderSubscriptionResponse: {
    encode(message: StreamHolderSubscriptionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamHolderSubscriptionResponse;
    fromJSON(object: any): StreamHolderSubscriptionResponse;
    toJSON(message: StreamHolderSubscriptionResponse): unknown;
    create(base?: DeepPartial<StreamHolderSubscriptionResponse>): StreamHolderSubscriptionResponse;
    fromPartial(object: DeepPartial<StreamHolderSubscriptionResponse>): StreamHolderSubscriptionResponse;
};
export declare const StreamStakingRewardByAccountRequest: {
    encode(message: StreamStakingRewardByAccountRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamStakingRewardByAccountRequest;
    fromJSON(object: any): StreamStakingRewardByAccountRequest;
    toJSON(message: StreamStakingRewardByAccountRequest): unknown;
    create(base?: DeepPartial<StreamStakingRewardByAccountRequest>): StreamStakingRewardByAccountRequest;
    fromPartial(object: DeepPartial<StreamStakingRewardByAccountRequest>): StreamStakingRewardByAccountRequest;
};
export declare const StreamStakingRewardByAccountResponse: {
    encode(message: StreamStakingRewardByAccountResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamStakingRewardByAccountResponse;
    fromJSON(object: any): StreamStakingRewardByAccountResponse;
    toJSON(message: StreamStakingRewardByAccountResponse): unknown;
    create(base?: DeepPartial<StreamStakingRewardByAccountResponse>): StreamStakingRewardByAccountResponse;
    fromPartial(object: DeepPartial<StreamStakingRewardByAccountResponse>): StreamStakingRewardByAccountResponse;
};
export declare const StreamHistoricalStakingRequest: {
    encode(message: StreamHistoricalStakingRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamHistoricalStakingRequest;
    fromJSON(object: any): StreamHistoricalStakingRequest;
    toJSON(message: StreamHistoricalStakingRequest): unknown;
    create(base?: DeepPartial<StreamHistoricalStakingRequest>): StreamHistoricalStakingRequest;
    fromPartial(object: DeepPartial<StreamHistoricalStakingRequest>): StreamHistoricalStakingRequest;
};
export declare const StreamHistoricalStakingResponse: {
    encode(message: StreamHistoricalStakingResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamHistoricalStakingResponse;
    fromJSON(object: any): StreamHistoricalStakingResponse;
    toJSON(message: StreamHistoricalStakingResponse): unknown;
    create(base?: DeepPartial<StreamHistoricalStakingResponse>): StreamHistoricalStakingResponse;
    fromPartial(object: DeepPartial<StreamHistoricalStakingResponse>): StreamHistoricalStakingResponse;
};
export declare const HealthRequest: {
    encode(_: HealthRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): HealthRequest;
    fromJSON(_: any): HealthRequest;
    toJSON(_: HealthRequest): unknown;
    create(base?: DeepPartial<HealthRequest>): HealthRequest;
    fromPartial(_: DeepPartial<HealthRequest>): HealthRequest;
};
export declare const HealthResponse: {
    encode(message: HealthResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): HealthResponse;
    fromJSON(object: any): HealthResponse;
    toJSON(message: HealthResponse): unknown;
    create(base?: DeepPartial<HealthResponse>): HealthResponse;
    fromPartial(object: DeepPartial<HealthResponse>): HealthResponse;
};
export declare const ExecutionRequest: {
    encode(message: ExecutionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExecutionRequest;
    fromJSON(object: any): ExecutionRequest;
    toJSON(message: ExecutionRequest): unknown;
    create(base?: DeepPartial<ExecutionRequest>): ExecutionRequest;
    fromPartial(object: DeepPartial<ExecutionRequest>): ExecutionRequest;
};
export declare const ExecutionResponse: {
    encode(message: ExecutionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExecutionResponse;
    fromJSON(object: any): ExecutionResponse;
    toJSON(message: ExecutionResponse): unknown;
    create(base?: DeepPartial<ExecutionResponse>): ExecutionResponse;
    fromPartial(object: DeepPartial<ExecutionResponse>): ExecutionResponse;
};
export declare const ExecutionLog: {
    encode(message: ExecutionLog, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExecutionLog;
    fromJSON(object: any): ExecutionLog;
    toJSON(message: ExecutionLog): unknown;
    create(base?: DeepPartial<ExecutionLog>): ExecutionLog;
    fromPartial(object: DeepPartial<ExecutionLog>): ExecutionLog;
};
export declare const MissionsRequest: {
    encode(message: MissionsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MissionsRequest;
    fromJSON(object: any): MissionsRequest;
    toJSON(message: MissionsRequest): unknown;
    create(base?: DeepPartial<MissionsRequest>): MissionsRequest;
    fromPartial(object: DeepPartial<MissionsRequest>): MissionsRequest;
};
export declare const MissionsResponse: {
    encode(message: MissionsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MissionsResponse;
    fromJSON(object: any): MissionsResponse;
    toJSON(message: MissionsResponse): unknown;
    create(base?: DeepPartial<MissionsResponse>): MissionsResponse;
    fromPartial(object: DeepPartial<MissionsResponse>): MissionsResponse;
};
export declare const Mission: {
    encode(message: Mission, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Mission;
    fromJSON(object: any): Mission;
    toJSON(message: Mission): unknown;
    create(base?: DeepPartial<Mission>): Mission;
    fromPartial(object: DeepPartial<Mission>): Mission;
};
export declare const MissionLeaderboardRequest: {
    encode(message: MissionLeaderboardRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MissionLeaderboardRequest;
    fromJSON(object: any): MissionLeaderboardRequest;
    toJSON(message: MissionLeaderboardRequest): unknown;
    create(base?: DeepPartial<MissionLeaderboardRequest>): MissionLeaderboardRequest;
    fromPartial(object: DeepPartial<MissionLeaderboardRequest>): MissionLeaderboardRequest;
};
export declare const MissionLeaderboardResponse: {
    encode(message: MissionLeaderboardResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MissionLeaderboardResponse;
    fromJSON(object: any): MissionLeaderboardResponse;
    toJSON(message: MissionLeaderboardResponse): unknown;
    create(base?: DeepPartial<MissionLeaderboardResponse>): MissionLeaderboardResponse;
    fromPartial(object: DeepPartial<MissionLeaderboardResponse>): MissionLeaderboardResponse;
};
export declare const MissionLeaderboardEntry: {
    encode(message: MissionLeaderboardEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MissionLeaderboardEntry;
    fromJSON(object: any): MissionLeaderboardEntry;
    toJSON(message: MissionLeaderboardEntry): unknown;
    create(base?: DeepPartial<MissionLeaderboardEntry>): MissionLeaderboardEntry;
    fromPartial(object: DeepPartial<MissionLeaderboardEntry>): MissionLeaderboardEntry;
};
export declare const ListIDOsRequest: {
    encode(message: ListIDOsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ListIDOsRequest;
    fromJSON(object: any): ListIDOsRequest;
    toJSON(message: ListIDOsRequest): unknown;
    create(base?: DeepPartial<ListIDOsRequest>): ListIDOsRequest;
    fromPartial(object: DeepPartial<ListIDOsRequest>): ListIDOsRequest;
};
export declare const ListIDOsResponse: {
    encode(message: ListIDOsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ListIDOsResponse;
    fromJSON(object: any): ListIDOsResponse;
    toJSON(message: ListIDOsResponse): unknown;
    create(base?: DeepPartial<ListIDOsResponse>): ListIDOsResponse;
    fromPartial(object: DeepPartial<ListIDOsResponse>): ListIDOsResponse;
};
export declare const IDO: {
    encode(message: IDO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDO;
    fromJSON(object: any): IDO;
    toJSON(message: IDO): unknown;
    create(base?: DeepPartial<IDO>): IDO;
    fromPartial(object: DeepPartial<IDO>): IDO;
};
export declare const TokenInfo: {
    encode(message: TokenInfo, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenInfo;
    fromJSON(object: any): TokenInfo;
    toJSON(message: TokenInfo): unknown;
    create(base?: DeepPartial<TokenInfo>): TokenInfo;
    fromPartial(object: DeepPartial<TokenInfo>): TokenInfo;
};
export declare const IDOProgress: {
    encode(message: IDOProgress, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDOProgress;
    fromJSON(object: any): IDOProgress;
    toJSON(message: IDOProgress): unknown;
    create(base?: DeepPartial<IDOProgress>): IDOProgress;
    fromPartial(object: DeepPartial<IDOProgress>): IDOProgress;
};
export declare const ArrayOfString: {
    encode(message: ArrayOfString, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ArrayOfString;
    fromJSON(object: any): ArrayOfString;
    toJSON(message: ArrayOfString): unknown;
    create(base?: DeepPartial<ArrayOfString>): ArrayOfString;
    fromPartial(object: DeepPartial<ArrayOfString>): ArrayOfString;
};
export declare const InitParams: {
    encode(message: InitParams, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): InitParams;
    fromJSON(object: any): InitParams;
    toJSON(message: InitParams): unknown;
    create(base?: DeepPartial<InitParams>): InitParams;
    fromPartial(object: DeepPartial<InitParams>): InitParams;
};
export declare const VestingConfigMap: {
    encode(message: VestingConfigMap, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VestingConfigMap;
    fromJSON(object: any): VestingConfigMap;
    toJSON(message: VestingConfigMap): unknown;
    create(base?: DeepPartial<VestingConfigMap>): VestingConfigMap;
    fromPartial(object: DeepPartial<VestingConfigMap>): VestingConfigMap;
};
export declare const VestingConfig: {
    encode(message: VestingConfig, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VestingConfig;
    fromJSON(object: any): VestingConfig;
    toJSON(message: VestingConfig): unknown;
    create(base?: DeepPartial<VestingConfig>): VestingConfig;
    fromPartial(object: DeepPartial<VestingConfig>): VestingConfig;
};
export declare const GetIDORequest: {
    encode(message: GetIDORequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDORequest;
    fromJSON(object: any): GetIDORequest;
    toJSON(message: GetIDORequest): unknown;
    create(base?: DeepPartial<GetIDORequest>): GetIDORequest;
    fromPartial(object: DeepPartial<GetIDORequest>): GetIDORequest;
};
export declare const GetIDOResponse: {
    encode(message: GetIDOResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOResponse;
    fromJSON(object: any): GetIDOResponse;
    toJSON(message: GetIDOResponse): unknown;
    create(base?: DeepPartial<GetIDOResponse>): GetIDOResponse;
    fromPartial(object: DeepPartial<GetIDOResponse>): GetIDOResponse;
};
export declare const GetIDOSubscribersRequest: {
    encode(message: GetIDOSubscribersRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOSubscribersRequest;
    fromJSON(object: any): GetIDOSubscribersRequest;
    toJSON(message: GetIDOSubscribersRequest): unknown;
    create(base?: DeepPartial<GetIDOSubscribersRequest>): GetIDOSubscribersRequest;
    fromPartial(object: DeepPartial<GetIDOSubscribersRequest>): GetIDOSubscribersRequest;
};
export declare const GetIDOSubscribersResponse: {
    encode(message: GetIDOSubscribersResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOSubscribersResponse;
    fromJSON(object: any): GetIDOSubscribersResponse;
    toJSON(message: GetIDOSubscribersResponse): unknown;
    create(base?: DeepPartial<GetIDOSubscribersResponse>): GetIDOSubscribersResponse;
    fromPartial(object: DeepPartial<GetIDOSubscribersResponse>): GetIDOSubscribersResponse;
};
export declare const IDOSubscriber: {
    encode(message: IDOSubscriber, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDOSubscriber;
    fromJSON(object: any): IDOSubscriber;
    toJSON(message: IDOSubscriber): unknown;
    create(base?: DeepPartial<IDOSubscriber>): IDOSubscriber;
    fromPartial(object: DeepPartial<IDOSubscriber>): IDOSubscriber;
};
export declare const GetIDOSubscriptionRequest: {
    encode(message: GetIDOSubscriptionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOSubscriptionRequest;
    fromJSON(object: any): GetIDOSubscriptionRequest;
    toJSON(message: GetIDOSubscriptionRequest): unknown;
    create(base?: DeepPartial<GetIDOSubscriptionRequest>): GetIDOSubscriptionRequest;
    fromPartial(object: DeepPartial<GetIDOSubscriptionRequest>): GetIDOSubscriptionRequest;
};
export declare const GetIDOSubscriptionResponse: {
    encode(message: GetIDOSubscriptionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOSubscriptionResponse;
    fromJSON(object: any): GetIDOSubscriptionResponse;
    toJSON(message: GetIDOSubscriptionResponse): unknown;
    create(base?: DeepPartial<GetIDOSubscriptionResponse>): GetIDOSubscriptionResponse;
    fromPartial(object: DeepPartial<GetIDOSubscriptionResponse>): GetIDOSubscriptionResponse;
};
export declare const IDOSubscription: {
    encode(message: IDOSubscription, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDOSubscription;
    fromJSON(object: any): IDOSubscription;
    toJSON(message: IDOSubscription): unknown;
    create(base?: DeepPartial<IDOSubscription>): IDOSubscription;
    fromPartial(object: DeepPartial<IDOSubscription>): IDOSubscription;
};
export declare const IDOClaimedCoins: {
    encode(message: IDOClaimedCoins, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDOClaimedCoins;
    fromJSON(object: any): IDOClaimedCoins;
    toJSON(message: IDOClaimedCoins): unknown;
    create(base?: DeepPartial<IDOClaimedCoins>): IDOClaimedCoins;
    fromPartial(object: DeepPartial<IDOClaimedCoins>): IDOClaimedCoins;
};
export declare const GetIDOActivitiesRequest: {
    encode(message: GetIDOActivitiesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOActivitiesRequest;
    fromJSON(object: any): GetIDOActivitiesRequest;
    toJSON(message: GetIDOActivitiesRequest): unknown;
    create(base?: DeepPartial<GetIDOActivitiesRequest>): GetIDOActivitiesRequest;
    fromPartial(object: DeepPartial<GetIDOActivitiesRequest>): GetIDOActivitiesRequest;
};
export declare const GetIDOActivitiesResponse: {
    encode(message: GetIDOActivitiesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetIDOActivitiesResponse;
    fromJSON(object: any): GetIDOActivitiesResponse;
    toJSON(message: GetIDOActivitiesResponse): unknown;
    create(base?: DeepPartial<GetIDOActivitiesResponse>): GetIDOActivitiesResponse;
    fromPartial(object: DeepPartial<GetIDOActivitiesResponse>): GetIDOActivitiesResponse;
};
export declare const IDOSubscriptionActivity: {
    encode(message: IDOSubscriptionActivity, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): IDOSubscriptionActivity;
    fromJSON(object: any): IDOSubscriptionActivity;
    toJSON(message: IDOSubscriptionActivity): unknown;
    create(base?: DeepPartial<IDOSubscriptionActivity>): IDOSubscriptionActivity;
    fromPartial(object: DeepPartial<IDOSubscriptionActivity>): IDOSubscriptionActivity;
};
export declare const GetWhitelistRequest: {
    encode(message: GetWhitelistRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetWhitelistRequest;
    fromJSON(object: any): GetWhitelistRequest;
    toJSON(message: GetWhitelistRequest): unknown;
    create(base?: DeepPartial<GetWhitelistRequest>): GetWhitelistRequest;
    fromPartial(object: DeepPartial<GetWhitelistRequest>): GetWhitelistRequest;
};
export declare const GetWhitelistResponse: {
    encode(message: GetWhitelistResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetWhitelistResponse;
    fromJSON(object: any): GetWhitelistResponse;
    toJSON(message: GetWhitelistResponse): unknown;
    create(base?: DeepPartial<GetWhitelistResponse>): GetWhitelistResponse;
    fromPartial(object: DeepPartial<GetWhitelistResponse>): GetWhitelistResponse;
};
export declare const WhitelistAccount: {
    encode(message: WhitelistAccount, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): WhitelistAccount;
    fromJSON(object: any): WhitelistAccount;
    toJSON(message: WhitelistAccount): unknown;
    create(base?: DeepPartial<WhitelistAccount>): WhitelistAccount;
    fromPartial(object: DeepPartial<WhitelistAccount>): WhitelistAccount;
};
export declare const TokenMetadataRequest: {
    encode(_: TokenMetadataRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenMetadataRequest;
    fromJSON(_: any): TokenMetadataRequest;
    toJSON(_: TokenMetadataRequest): unknown;
    create(base?: DeepPartial<TokenMetadataRequest>): TokenMetadataRequest;
    fromPartial(_: DeepPartial<TokenMetadataRequest>): TokenMetadataRequest;
};
export declare const TokenMetadataResponse: {
    encode(message: TokenMetadataResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TokenMetadataResponse;
    fromJSON(object: any): TokenMetadataResponse;
    toJSON(message: TokenMetadataResponse): unknown;
    create(base?: DeepPartial<TokenMetadataResponse>): TokenMetadataResponse;
    fromPartial(object: DeepPartial<TokenMetadataResponse>): TokenMetadataResponse;
};
export declare const GetClaimReferencesRequest: {
    encode(message: GetClaimReferencesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetClaimReferencesRequest;
    fromJSON(object: any): GetClaimReferencesRequest;
    toJSON(message: GetClaimReferencesRequest): unknown;
    create(base?: DeepPartial<GetClaimReferencesRequest>): GetClaimReferencesRequest;
    fromPartial(object: DeepPartial<GetClaimReferencesRequest>): GetClaimReferencesRequest;
};
export declare const GetClaimReferencesResponse: {
    encode(message: GetClaimReferencesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetClaimReferencesResponse;
    fromJSON(object: any): GetClaimReferencesResponse;
    toJSON(message: GetClaimReferencesResponse): unknown;
    create(base?: DeepPartial<GetClaimReferencesResponse>): GetClaimReferencesResponse;
    fromPartial(object: DeepPartial<GetClaimReferencesResponse>): GetClaimReferencesResponse;
};
export declare const ClaimReference: {
    encode(message: ClaimReference, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ClaimReference;
    fromJSON(object: any): ClaimReference;
    toJSON(message: ClaimReference): unknown;
    create(base?: DeepPartial<ClaimReference>): ClaimReference;
    fromPartial(object: DeepPartial<ClaimReference>): ClaimReference;
};
/** Get mito user portfolios, vaults and more */
export interface MitoAPI {
    /** List all vaults */
    GetVaults(request: DeepPartial<GetVaultsRequest>, metadata?: grpc.Metadata): Promise<GetVaultsResponse>;
    /** List a vault by contract address */
    GetVault(request: DeepPartial<GetVaultRequest>, metadata?: grpc.Metadata): Promise<GetVaultResponse>;
    /** LPTokenPriceChart implements LPTokenPriceChart. */
    LPTokenPriceChart(request: DeepPartial<LPTokenPriceChartRequest>, metadata?: grpc.Metadata): Promise<LPTokenPriceChartResponse>;
    /** TVLChart implements TVLChart. */
    TVLChart(request: DeepPartial<TVLChartRequest>, metadata?: grpc.Metadata): Promise<TVLChartResponse>;
    /** Get list of vaults that user subscribes to */
    VaultsByHolderAddress(request: DeepPartial<VaultsByHolderAddressRequest>, metadata?: grpc.Metadata): Promise<VaultsByHolderAddressResponse>;
    /** Get list of address that holds this LP token */
    LPHolders(request: DeepPartial<LPHoldersRequest>, metadata?: grpc.Metadata): Promise<LPHoldersResponse>;
    /** Portfolio summary of an account */
    Portfolio(request: DeepPartial<PortfolioRequest>, metadata?: grpc.Metadata): Promise<PortfolioResponse>;
    /** Leaderboard ranking */
    Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Promise<LeaderboardResponse>;
    /** Get leaderboard epochs */
    LeaderboardEpochs(request: DeepPartial<LeaderboardEpochsRequest>, metadata?: grpc.Metadata): Promise<LeaderboardEpochsResponse>;
    /** Return historical transfers (i.e Subscribe - Deposit / Redeem - withdrawal) */
    TransfersHistory(request: DeepPartial<TransfersHistoryRequest>, metadata?: grpc.Metadata): Promise<TransfersHistoryResponse>;
    /** [Staking] Return staking pools */
    GetStakingPools(request: DeepPartial<GetStakingPoolsRequest>, metadata?: grpc.Metadata): Promise<GetStakingPoolsResponse>;
    /** [Staking] Return staking rewards */
    StakingRewardByAccount(request: DeepPartial<StakingRewardByAccountRequest>, metadata?: grpc.Metadata): Promise<StakingRewardByAccountResponse>;
    /** [Staking] Return staking historical activities */
    StakingHistory(request: DeepPartial<StakingHistoryRequest>, metadata?: grpc.Metadata): Promise<StakingHistoryResponse>;
    /** [Staking] Return the amount of a denom staked at a given height */
    StakingAmountAtHeight(request: DeepPartial<StakingAmountAtHeightRequest>, metadata?: grpc.Metadata): Promise<StakingAmountAtHeightResponse>;
    /** Stream up-to-date vault transfers */
    StreamTransfers(request: DeepPartial<StreamTransfersRequest>, metadata?: grpc.Metadata): Observable<StreamTransfersResponse>;
    /** Stream up-to-date vault data */
    StreamVault(request: DeepPartial<StreamVaultRequest>, metadata?: grpc.Metadata): Observable<StreamVaultResponse>;
    /** Stream up-to-date vault subscription */
    StreamHolderSubscription(request: DeepPartial<StreamHolderSubscriptionRequest>, metadata?: grpc.Metadata): Observable<StreamHolderSubscriptionResponse>;
    /** [Staking] Stream staking update of an account (staker) */
    StreamStakingRewardByAccount(request: DeepPartial<StreamStakingRewardByAccountRequest>, metadata?: grpc.Metadata): Observable<StreamStakingRewardByAccountResponse>;
    /** [Staking] Stream historical staking activities */
    StreamHistoricalStaking(request: DeepPartial<StreamHistoricalStakingRequest>, metadata?: grpc.Metadata): Observable<StreamHistoricalStakingResponse>;
    /** Return binary version and health check */
    Health(request: DeepPartial<HealthRequest>, metadata?: grpc.Metadata): Promise<HealthResponse>;
    /** Return contract execution log (mainly for debug purpose) */
    Execution(request: DeepPartial<ExecutionRequest>, metadata?: grpc.Metadata): Promise<ExecutionResponse>;
    /** Return mission status of an account */
    Missions(request: DeepPartial<MissionsRequest>, metadata?: grpc.Metadata): Promise<MissionsResponse>;
    /** Return ALL-TIME mission leaderboard across mito users */
    MissionLeaderboard(request: DeepPartial<MissionLeaderboardRequest>, metadata?: grpc.Metadata): Promise<MissionLeaderboardResponse>;
    /** Return all IDOs that are taking place */
    ListIDOs(request: DeepPartial<ListIDOsRequest>, metadata?: grpc.Metadata): Promise<ListIDOsResponse>;
    /** Return a single IDO */
    GetIDO(request: DeepPartial<GetIDORequest>, metadata?: grpc.Metadata): Promise<GetIDOResponse>;
    /** Return list of subscribers in the IDOs (not whitelisted members) */
    GetIDOSubscribers(request: DeepPartial<GetIDOSubscribersRequest>, metadata?: grpc.Metadata): Promise<GetIDOSubscribersResponse>;
    /** Subscription detail in the IDO */
    GetIDOSubscription(request: DeepPartial<GetIDOSubscriptionRequest>, metadata?: grpc.Metadata): Promise<GetIDOSubscriptionResponse>;
    /** Subscription activities in the IDO */
    GetIDOActivities(request: DeepPartial<GetIDOActivitiesRequest>, metadata?: grpc.Metadata): Promise<GetIDOActivitiesResponse>;
    /** Get white list accounts of a given IDO */
    GetWhitelist(request: DeepPartial<GetWhitelistRequest>, metadata?: grpc.Metadata): Promise<GetWhitelistResponse>;
    /**
     * Get token metadata that current backend is processing, mainly for debug
     * purpose
     */
    TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse>;
    /** Get claim references of a given IDO and account */
    GetClaimReferences(request: DeepPartial<GetClaimReferencesRequest>, metadata?: grpc.Metadata): Promise<GetClaimReferencesResponse>;
}
export declare class MitoAPIClientImpl implements MitoAPI {
    private readonly rpc;
    constructor(rpc: Rpc);
    GetVaults(request: DeepPartial<GetVaultsRequest>, metadata?: grpc.Metadata): Promise<GetVaultsResponse>;
    GetVault(request: DeepPartial<GetVaultRequest>, metadata?: grpc.Metadata): Promise<GetVaultResponse>;
    LPTokenPriceChart(request: DeepPartial<LPTokenPriceChartRequest>, metadata?: grpc.Metadata): Promise<LPTokenPriceChartResponse>;
    TVLChart(request: DeepPartial<TVLChartRequest>, metadata?: grpc.Metadata): Promise<TVLChartResponse>;
    VaultsByHolderAddress(request: DeepPartial<VaultsByHolderAddressRequest>, metadata?: grpc.Metadata): Promise<VaultsByHolderAddressResponse>;
    LPHolders(request: DeepPartial<LPHoldersRequest>, metadata?: grpc.Metadata): Promise<LPHoldersResponse>;
    Portfolio(request: DeepPartial<PortfolioRequest>, metadata?: grpc.Metadata): Promise<PortfolioResponse>;
    Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Promise<LeaderboardResponse>;
    LeaderboardEpochs(request: DeepPartial<LeaderboardEpochsRequest>, metadata?: grpc.Metadata): Promise<LeaderboardEpochsResponse>;
    TransfersHistory(request: DeepPartial<TransfersHistoryRequest>, metadata?: grpc.Metadata): Promise<TransfersHistoryResponse>;
    GetStakingPools(request: DeepPartial<GetStakingPoolsRequest>, metadata?: grpc.Metadata): Promise<GetStakingPoolsResponse>;
    StakingRewardByAccount(request: DeepPartial<StakingRewardByAccountRequest>, metadata?: grpc.Metadata): Promise<StakingRewardByAccountResponse>;
    StakingHistory(request: DeepPartial<StakingHistoryRequest>, metadata?: grpc.Metadata): Promise<StakingHistoryResponse>;
    StakingAmountAtHeight(request: DeepPartial<StakingAmountAtHeightRequest>, metadata?: grpc.Metadata): Promise<StakingAmountAtHeightResponse>;
    StreamTransfers(request: DeepPartial<StreamTransfersRequest>, metadata?: grpc.Metadata): Observable<StreamTransfersResponse>;
    StreamVault(request: DeepPartial<StreamVaultRequest>, metadata?: grpc.Metadata): Observable<StreamVaultResponse>;
    StreamHolderSubscription(request: DeepPartial<StreamHolderSubscriptionRequest>, metadata?: grpc.Metadata): Observable<StreamHolderSubscriptionResponse>;
    StreamStakingRewardByAccount(request: DeepPartial<StreamStakingRewardByAccountRequest>, metadata?: grpc.Metadata): Observable<StreamStakingRewardByAccountResponse>;
    StreamHistoricalStaking(request: DeepPartial<StreamHistoricalStakingRequest>, metadata?: grpc.Metadata): Observable<StreamHistoricalStakingResponse>;
    Health(request: DeepPartial<HealthRequest>, metadata?: grpc.Metadata): Promise<HealthResponse>;
    Execution(request: DeepPartial<ExecutionRequest>, metadata?: grpc.Metadata): Promise<ExecutionResponse>;
    Missions(request: DeepPartial<MissionsRequest>, metadata?: grpc.Metadata): Promise<MissionsResponse>;
    MissionLeaderboard(request: DeepPartial<MissionLeaderboardRequest>, metadata?: grpc.Metadata): Promise<MissionLeaderboardResponse>;
    ListIDOs(request: DeepPartial<ListIDOsRequest>, metadata?: grpc.Metadata): Promise<ListIDOsResponse>;
    GetIDO(request: DeepPartial<GetIDORequest>, metadata?: grpc.Metadata): Promise<GetIDOResponse>;
    GetIDOSubscribers(request: DeepPartial<GetIDOSubscribersRequest>, metadata?: grpc.Metadata): Promise<GetIDOSubscribersResponse>;
    GetIDOSubscription(request: DeepPartial<GetIDOSubscriptionRequest>, metadata?: grpc.Metadata): Promise<GetIDOSubscriptionResponse>;
    GetIDOActivities(request: DeepPartial<GetIDOActivitiesRequest>, metadata?: grpc.Metadata): Promise<GetIDOActivitiesResponse>;
    GetWhitelist(request: DeepPartial<GetWhitelistRequest>, metadata?: grpc.Metadata): Promise<GetWhitelistResponse>;
    TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse>;
    GetClaimReferences(request: DeepPartial<GetClaimReferencesRequest>, metadata?: grpc.Metadata): Promise<GetClaimReferencesResponse>;
}
export declare const MitoAPIDesc: {
    serviceName: string;
};
export declare const MitoAPIGetVaultsDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetVaultDesc: UnaryMethodDefinitionish;
export declare const MitoAPILPTokenPriceChartDesc: UnaryMethodDefinitionish;
export declare const MitoAPITVLChartDesc: UnaryMethodDefinitionish;
export declare const MitoAPIVaultsByHolderAddressDesc: UnaryMethodDefinitionish;
export declare const MitoAPILPHoldersDesc: UnaryMethodDefinitionish;
export declare const MitoAPIPortfolioDesc: UnaryMethodDefinitionish;
export declare const MitoAPILeaderboardDesc: UnaryMethodDefinitionish;
export declare const MitoAPILeaderboardEpochsDesc: UnaryMethodDefinitionish;
export declare const MitoAPITransfersHistoryDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetStakingPoolsDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStakingRewardByAccountDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStakingHistoryDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStakingAmountAtHeightDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStreamTransfersDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStreamVaultDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStreamHolderSubscriptionDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStreamStakingRewardByAccountDesc: UnaryMethodDefinitionish;
export declare const MitoAPIStreamHistoricalStakingDesc: UnaryMethodDefinitionish;
export declare const MitoAPIHealthDesc: UnaryMethodDefinitionish;
export declare const MitoAPIExecutionDesc: UnaryMethodDefinitionish;
export declare const MitoAPIMissionsDesc: UnaryMethodDefinitionish;
export declare const MitoAPIMissionLeaderboardDesc: UnaryMethodDefinitionish;
export declare const MitoAPIListIDOsDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetIDODesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetIDOSubscribersDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetIDOSubscriptionDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetIDOActivitiesDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetWhitelistDesc: UnaryMethodDefinitionish;
export declare const MitoAPITokenMetadataDesc: UnaryMethodDefinitionish;
export declare const MitoAPIGetClaimReferencesDesc: UnaryMethodDefinitionish;
interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
    requestStream: any;
    responseStream: any;
}
type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;
interface Rpc {
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;
    invoke<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Observable<any>;
}
export declare class GrpcWebImpl {
    private host;
    private options;
    constructor(host: string, options: {
        transport?: grpc.TransportFactory;
        streamingTransport?: grpc.TransportFactory;
        debug?: boolean;
        metadata?: grpc.Metadata;
        upStreamRetryCodes?: number[];
    });
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any>;
    invoke<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Observable<any>;
}
declare var tsProtoGlobalThis: any;
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export declare class GrpcWebError extends tsProtoGlobalThis.Error {
    code: grpc.Code;
    metadata: grpc.Metadata;
    constructor(message: string, code: grpc.Code, metadata: grpc.Metadata);
}
export {};
