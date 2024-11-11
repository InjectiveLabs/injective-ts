import { grpc } from "@injectivelabs/grpc-web";
import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "injective_dmm_v2_rpc";
export interface Pagination {
    from?: number | undefined;
    height?: number | undefined;
    perPage?: number | undefined;
    total?: number | undefined;
}
export interface GetEpochsRequest {
    /** optional. Ej: "running" */
    status: string;
}
export interface GetEpochsResponse {
    epochs: EpochV2[];
}
export interface GetTotalScoresRequest {
    epochId: string;
    marketId: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetTotalScoresResponse {
    scores: TotalScore[];
    next: Pagination | undefined;
}
export interface GetTotalScoresHistoryRequest {
    epochId: string;
    marketId: string;
    accountAddress: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetTotalScoresHistoryResponse {
    scores: TotalScore[];
    next: Pagination | undefined;
}
export interface GetEpochScoresRequest {
    epochId: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetEpochScoresResponse {
    scores: EpochScore[];
    next: Pagination | undefined;
}
export interface GetEpochScoresHistoryRequest {
    epochId: string;
    accountAddress: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetEpochScoresHistoryResponse {
    scores: EpochScore[];
    next: Pagination | undefined;
}
export interface GetMarketRewardsRequest {
    epochId: string;
}
export interface GetMarketRewardsResponse {
    rewards: MarketReward[];
}
export interface GetEligibleAddressesRequest {
    epochId: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetEligibleAddressesResponse {
    addresses: EligibleAddress[];
    next: Pagination | undefined;
}
export interface GetRewardsDistributionRequest {
    epochId: string;
    /** optional */
    height: string;
    /** optional */
    page: Pagination | undefined;
}
export interface GetRewardsDistributionResponse {
    rewards: RewardDistribution[];
    next: Pagination | undefined;
}
export interface GetAccountVolumesRequest {
    epochId: string;
    accountAddress: string;
}
export interface GetAccountVolumesResponse {
    volumes: AccountVolume[];
}
export interface GetRewardsEligibilityRequest {
    epochId: string;
    accountAddress: string;
}
export interface GetRewardsEligibilityResponse {
    volumes: AccountVolume[];
    currentMakerVolumePercentage: string;
    averageDailyMakerVolumePercentage: string;
    eligibleForNextEpoch: boolean;
    eligibleForCurrentEpoch: boolean;
    estimatedReward: string;
    updatedAt: Date | undefined;
}
export interface GetHealthStatusRequest {
}
export interface GetHealthStatusResponse {
    epochId: string;
    lastSnapshotBlockTime: Date | undefined;
    lastSnapshotBlockHeight: string;
    updatedAt: Date | undefined;
    status: string;
}
export interface EpochV2 {
    epochId: string;
    status: string;
    startHeight: string;
    endHeight: string;
    snapshotCount: number;
    resultCount: number;
    config: EpochConfigV2 | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface Market {
    marketId: string;
    ticker: string;
    startDate?: Date | undefined;
    preAllocatedReward?: string | undefined;
}
export interface EpochConfigV2 {
    number: number;
    startDate: Date | undefined;
    endDate: Date | undefined;
    rewardInj: string;
    markets: Market[];
    liquidityScoreExponent: string;
    uptimeExponent: string;
    volumeExponent: string;
    permanenceVolumeThreshold: string;
    qualifyingVolumeThreshold: string;
}
export interface TotalScore {
    epochId: string;
    marketId: string;
    accountAddress: string;
    height: string;
    startHeight: string;
    blockTime: Date | undefined;
    bid: string;
    ask: string;
    depth: string;
    snapshotCount: number;
    liquidityScore: string;
    liquidityScorePonderated: string;
    uptimeScore: string;
    bidSnapshot: string;
    askSnapshot: string;
    depthSnapshot: string;
    liquidityScoreSnapshot: string;
    uptimeScoreSnapshot: string;
    uptimeScorePonderated: string;
    uptimePercentage: string;
    startVolume: string;
    currentVolume: string;
    volume: string;
    volumeScore: string;
    volumeScorePonderated: string;
    takerStartVolume: string;
    takerCurrentVolume: string;
    takerVolume: string;
    makerStartVolume: string;
    makerCurrentVolume: string;
    makerVolume: string;
    totalScore: string;
    reward: string;
    rewardPercentage: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    skip: boolean;
}
export interface EpochScore {
    epochId: string;
    accountAddress: string;
    height: string;
    blockTime: Date | undefined;
    startHeight: string;
    depth: string;
    liquidityScore: string;
    liquidityScorePonderated: string;
    uptimeScore: string;
    uptimeScorePonderated: string;
    uptimePercentage: string;
    volumeScore: string;
    volumeScorePonderated: string;
    totalScore: string;
    volume: string;
    makerVolume: string;
    takerVolume: string;
    reward: string;
    rewardPercentage: string;
    qualifies: boolean;
    volumePercentage: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface MarketReward {
    epochId: string;
    marketId: string;
    height: string;
    reward: string;
    rewardPercentage: string;
    liquidity: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    totalScore: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface EligibleAddress {
    epochId: string;
    accountAddress: string;
    height: string;
    source: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface RewardDistribution {
    epochId: string;
    accountAddress: string;
    height: string;
    startHeight: string;
    blockTime: Date | undefined;
    depth: string;
    reward: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface AccountVolume {
    epochId: string;
    accountAddress: string;
    height: string;
    blockTime: Date | undefined;
    date: string;
    dateTimestamp: Date | undefined;
    volume: string;
    takerVolume: string;
    makerVolume: string;
    volumePercentage: string;
    makerVolumePercentage: string;
    takerVolumePercentage: string;
    dailyVolume: string;
    dailyMakerVolume: string;
    dailyTakerVolume: string;
    dailyVolumePercentage: string;
    dailyMakerVolumePercentage: string;
    dailyTakerVolumePercentage: string;
    dailyQualified: boolean;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export declare const Pagination: {
    encode(message: Pagination, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Pagination;
    fromJSON(object: any): Pagination;
    toJSON(message: Pagination): unknown;
    create(base?: DeepPartial<Pagination>): Pagination;
    fromPartial(object: DeepPartial<Pagination>): Pagination;
};
export declare const GetEpochsRequest: {
    encode(message: GetEpochsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochsRequest;
    fromJSON(object: any): GetEpochsRequest;
    toJSON(message: GetEpochsRequest): unknown;
    create(base?: DeepPartial<GetEpochsRequest>): GetEpochsRequest;
    fromPartial(object: DeepPartial<GetEpochsRequest>): GetEpochsRequest;
};
export declare const GetEpochsResponse: {
    encode(message: GetEpochsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochsResponse;
    fromJSON(object: any): GetEpochsResponse;
    toJSON(message: GetEpochsResponse): unknown;
    create(base?: DeepPartial<GetEpochsResponse>): GetEpochsResponse;
    fromPartial(object: DeepPartial<GetEpochsResponse>): GetEpochsResponse;
};
export declare const GetTotalScoresRequest: {
    encode(message: GetTotalScoresRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetTotalScoresRequest;
    fromJSON(object: any): GetTotalScoresRequest;
    toJSON(message: GetTotalScoresRequest): unknown;
    create(base?: DeepPartial<GetTotalScoresRequest>): GetTotalScoresRequest;
    fromPartial(object: DeepPartial<GetTotalScoresRequest>): GetTotalScoresRequest;
};
export declare const GetTotalScoresResponse: {
    encode(message: GetTotalScoresResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetTotalScoresResponse;
    fromJSON(object: any): GetTotalScoresResponse;
    toJSON(message: GetTotalScoresResponse): unknown;
    create(base?: DeepPartial<GetTotalScoresResponse>): GetTotalScoresResponse;
    fromPartial(object: DeepPartial<GetTotalScoresResponse>): GetTotalScoresResponse;
};
export declare const GetTotalScoresHistoryRequest: {
    encode(message: GetTotalScoresHistoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetTotalScoresHistoryRequest;
    fromJSON(object: any): GetTotalScoresHistoryRequest;
    toJSON(message: GetTotalScoresHistoryRequest): unknown;
    create(base?: DeepPartial<GetTotalScoresHistoryRequest>): GetTotalScoresHistoryRequest;
    fromPartial(object: DeepPartial<GetTotalScoresHistoryRequest>): GetTotalScoresHistoryRequest;
};
export declare const GetTotalScoresHistoryResponse: {
    encode(message: GetTotalScoresHistoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetTotalScoresHistoryResponse;
    fromJSON(object: any): GetTotalScoresHistoryResponse;
    toJSON(message: GetTotalScoresHistoryResponse): unknown;
    create(base?: DeepPartial<GetTotalScoresHistoryResponse>): GetTotalScoresHistoryResponse;
    fromPartial(object: DeepPartial<GetTotalScoresHistoryResponse>): GetTotalScoresHistoryResponse;
};
export declare const GetEpochScoresRequest: {
    encode(message: GetEpochScoresRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochScoresRequest;
    fromJSON(object: any): GetEpochScoresRequest;
    toJSON(message: GetEpochScoresRequest): unknown;
    create(base?: DeepPartial<GetEpochScoresRequest>): GetEpochScoresRequest;
    fromPartial(object: DeepPartial<GetEpochScoresRequest>): GetEpochScoresRequest;
};
export declare const GetEpochScoresResponse: {
    encode(message: GetEpochScoresResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochScoresResponse;
    fromJSON(object: any): GetEpochScoresResponse;
    toJSON(message: GetEpochScoresResponse): unknown;
    create(base?: DeepPartial<GetEpochScoresResponse>): GetEpochScoresResponse;
    fromPartial(object: DeepPartial<GetEpochScoresResponse>): GetEpochScoresResponse;
};
export declare const GetEpochScoresHistoryRequest: {
    encode(message: GetEpochScoresHistoryRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochScoresHistoryRequest;
    fromJSON(object: any): GetEpochScoresHistoryRequest;
    toJSON(message: GetEpochScoresHistoryRequest): unknown;
    create(base?: DeepPartial<GetEpochScoresHistoryRequest>): GetEpochScoresHistoryRequest;
    fromPartial(object: DeepPartial<GetEpochScoresHistoryRequest>): GetEpochScoresHistoryRequest;
};
export declare const GetEpochScoresHistoryResponse: {
    encode(message: GetEpochScoresHistoryResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEpochScoresHistoryResponse;
    fromJSON(object: any): GetEpochScoresHistoryResponse;
    toJSON(message: GetEpochScoresHistoryResponse): unknown;
    create(base?: DeepPartial<GetEpochScoresHistoryResponse>): GetEpochScoresHistoryResponse;
    fromPartial(object: DeepPartial<GetEpochScoresHistoryResponse>): GetEpochScoresHistoryResponse;
};
export declare const GetMarketRewardsRequest: {
    encode(message: GetMarketRewardsRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetMarketRewardsRequest;
    fromJSON(object: any): GetMarketRewardsRequest;
    toJSON(message: GetMarketRewardsRequest): unknown;
    create(base?: DeepPartial<GetMarketRewardsRequest>): GetMarketRewardsRequest;
    fromPartial(object: DeepPartial<GetMarketRewardsRequest>): GetMarketRewardsRequest;
};
export declare const GetMarketRewardsResponse: {
    encode(message: GetMarketRewardsResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetMarketRewardsResponse;
    fromJSON(object: any): GetMarketRewardsResponse;
    toJSON(message: GetMarketRewardsResponse): unknown;
    create(base?: DeepPartial<GetMarketRewardsResponse>): GetMarketRewardsResponse;
    fromPartial(object: DeepPartial<GetMarketRewardsResponse>): GetMarketRewardsResponse;
};
export declare const GetEligibleAddressesRequest: {
    encode(message: GetEligibleAddressesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEligibleAddressesRequest;
    fromJSON(object: any): GetEligibleAddressesRequest;
    toJSON(message: GetEligibleAddressesRequest): unknown;
    create(base?: DeepPartial<GetEligibleAddressesRequest>): GetEligibleAddressesRequest;
    fromPartial(object: DeepPartial<GetEligibleAddressesRequest>): GetEligibleAddressesRequest;
};
export declare const GetEligibleAddressesResponse: {
    encode(message: GetEligibleAddressesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetEligibleAddressesResponse;
    fromJSON(object: any): GetEligibleAddressesResponse;
    toJSON(message: GetEligibleAddressesResponse): unknown;
    create(base?: DeepPartial<GetEligibleAddressesResponse>): GetEligibleAddressesResponse;
    fromPartial(object: DeepPartial<GetEligibleAddressesResponse>): GetEligibleAddressesResponse;
};
export declare const GetRewardsDistributionRequest: {
    encode(message: GetRewardsDistributionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetRewardsDistributionRequest;
    fromJSON(object: any): GetRewardsDistributionRequest;
    toJSON(message: GetRewardsDistributionRequest): unknown;
    create(base?: DeepPartial<GetRewardsDistributionRequest>): GetRewardsDistributionRequest;
    fromPartial(object: DeepPartial<GetRewardsDistributionRequest>): GetRewardsDistributionRequest;
};
export declare const GetRewardsDistributionResponse: {
    encode(message: GetRewardsDistributionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetRewardsDistributionResponse;
    fromJSON(object: any): GetRewardsDistributionResponse;
    toJSON(message: GetRewardsDistributionResponse): unknown;
    create(base?: DeepPartial<GetRewardsDistributionResponse>): GetRewardsDistributionResponse;
    fromPartial(object: DeepPartial<GetRewardsDistributionResponse>): GetRewardsDistributionResponse;
};
export declare const GetAccountVolumesRequest: {
    encode(message: GetAccountVolumesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetAccountVolumesRequest;
    fromJSON(object: any): GetAccountVolumesRequest;
    toJSON(message: GetAccountVolumesRequest): unknown;
    create(base?: DeepPartial<GetAccountVolumesRequest>): GetAccountVolumesRequest;
    fromPartial(object: DeepPartial<GetAccountVolumesRequest>): GetAccountVolumesRequest;
};
export declare const GetAccountVolumesResponse: {
    encode(message: GetAccountVolumesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetAccountVolumesResponse;
    fromJSON(object: any): GetAccountVolumesResponse;
    toJSON(message: GetAccountVolumesResponse): unknown;
    create(base?: DeepPartial<GetAccountVolumesResponse>): GetAccountVolumesResponse;
    fromPartial(object: DeepPartial<GetAccountVolumesResponse>): GetAccountVolumesResponse;
};
export declare const GetRewardsEligibilityRequest: {
    encode(message: GetRewardsEligibilityRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetRewardsEligibilityRequest;
    fromJSON(object: any): GetRewardsEligibilityRequest;
    toJSON(message: GetRewardsEligibilityRequest): unknown;
    create(base?: DeepPartial<GetRewardsEligibilityRequest>): GetRewardsEligibilityRequest;
    fromPartial(object: DeepPartial<GetRewardsEligibilityRequest>): GetRewardsEligibilityRequest;
};
export declare const GetRewardsEligibilityResponse: {
    encode(message: GetRewardsEligibilityResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetRewardsEligibilityResponse;
    fromJSON(object: any): GetRewardsEligibilityResponse;
    toJSON(message: GetRewardsEligibilityResponse): unknown;
    create(base?: DeepPartial<GetRewardsEligibilityResponse>): GetRewardsEligibilityResponse;
    fromPartial(object: DeepPartial<GetRewardsEligibilityResponse>): GetRewardsEligibilityResponse;
};
export declare const GetHealthStatusRequest: {
    encode(_: GetHealthStatusRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetHealthStatusRequest;
    fromJSON(_: any): GetHealthStatusRequest;
    toJSON(_: GetHealthStatusRequest): unknown;
    create(base?: DeepPartial<GetHealthStatusRequest>): GetHealthStatusRequest;
    fromPartial(_: DeepPartial<GetHealthStatusRequest>): GetHealthStatusRequest;
};
export declare const GetHealthStatusResponse: {
    encode(message: GetHealthStatusResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): GetHealthStatusResponse;
    fromJSON(object: any): GetHealthStatusResponse;
    toJSON(message: GetHealthStatusResponse): unknown;
    create(base?: DeepPartial<GetHealthStatusResponse>): GetHealthStatusResponse;
    fromPartial(object: DeepPartial<GetHealthStatusResponse>): GetHealthStatusResponse;
};
export declare const EpochV2: {
    encode(message: EpochV2, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EpochV2;
    fromJSON(object: any): EpochV2;
    toJSON(message: EpochV2): unknown;
    create(base?: DeepPartial<EpochV2>): EpochV2;
    fromPartial(object: DeepPartial<EpochV2>): EpochV2;
};
export declare const Market: {
    encode(message: Market, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Market;
    fromJSON(object: any): Market;
    toJSON(message: Market): unknown;
    create(base?: DeepPartial<Market>): Market;
    fromPartial(object: DeepPartial<Market>): Market;
};
export declare const EpochConfigV2: {
    encode(message: EpochConfigV2, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EpochConfigV2;
    fromJSON(object: any): EpochConfigV2;
    toJSON(message: EpochConfigV2): unknown;
    create(base?: DeepPartial<EpochConfigV2>): EpochConfigV2;
    fromPartial(object: DeepPartial<EpochConfigV2>): EpochConfigV2;
};
export declare const TotalScore: {
    encode(message: TotalScore, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): TotalScore;
    fromJSON(object: any): TotalScore;
    toJSON(message: TotalScore): unknown;
    create(base?: DeepPartial<TotalScore>): TotalScore;
    fromPartial(object: DeepPartial<TotalScore>): TotalScore;
};
export declare const EpochScore: {
    encode(message: EpochScore, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EpochScore;
    fromJSON(object: any): EpochScore;
    toJSON(message: EpochScore): unknown;
    create(base?: DeepPartial<EpochScore>): EpochScore;
    fromPartial(object: DeepPartial<EpochScore>): EpochScore;
};
export declare const MarketReward: {
    encode(message: MarketReward, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MarketReward;
    fromJSON(object: any): MarketReward;
    toJSON(message: MarketReward): unknown;
    create(base?: DeepPartial<MarketReward>): MarketReward;
    fromPartial(object: DeepPartial<MarketReward>): MarketReward;
};
export declare const EligibleAddress: {
    encode(message: EligibleAddress, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): EligibleAddress;
    fromJSON(object: any): EligibleAddress;
    toJSON(message: EligibleAddress): unknown;
    create(base?: DeepPartial<EligibleAddress>): EligibleAddress;
    fromPartial(object: DeepPartial<EligibleAddress>): EligibleAddress;
};
export declare const RewardDistribution: {
    encode(message: RewardDistribution, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): RewardDistribution;
    fromJSON(object: any): RewardDistribution;
    toJSON(message: RewardDistribution): unknown;
    create(base?: DeepPartial<RewardDistribution>): RewardDistribution;
    fromPartial(object: DeepPartial<RewardDistribution>): RewardDistribution;
};
export declare const AccountVolume: {
    encode(message: AccountVolume, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AccountVolume;
    fromJSON(object: any): AccountVolume;
    toJSON(message: AccountVolume): unknown;
    create(base?: DeepPartial<AccountVolume>): AccountVolume;
    fromPartial(object: DeepPartial<AccountVolume>): AccountVolume;
};
export interface InjectiveDmmV2RPC {
    GetEpochs(request: DeepPartial<GetEpochsRequest>, metadata?: grpc.Metadata): Promise<GetEpochsResponse>;
    GetTotalScores(request: DeepPartial<GetTotalScoresRequest>, metadata?: grpc.Metadata): Promise<GetTotalScoresResponse>;
    GetTotalScoresHistory(request: DeepPartial<GetTotalScoresHistoryRequest>, metadata?: grpc.Metadata): Promise<GetTotalScoresHistoryResponse>;
    GetEpochScores(request: DeepPartial<GetEpochScoresRequest>, metadata?: grpc.Metadata): Promise<GetEpochScoresResponse>;
    GetEpochScoresHistory(request: DeepPartial<GetEpochScoresHistoryRequest>, metadata?: grpc.Metadata): Promise<GetEpochScoresHistoryResponse>;
    GetMarketRewards(request: DeepPartial<GetMarketRewardsRequest>, metadata?: grpc.Metadata): Promise<GetMarketRewardsResponse>;
    GetEligibleAddresses(request: DeepPartial<GetEligibleAddressesRequest>, metadata?: grpc.Metadata): Promise<GetEligibleAddressesResponse>;
    GetRewardsDistribution(request: DeepPartial<GetRewardsDistributionRequest>, metadata?: grpc.Metadata): Promise<GetRewardsDistributionResponse>;
    GetAccountVolumes(request: DeepPartial<GetAccountVolumesRequest>, metadata?: grpc.Metadata): Promise<GetAccountVolumesResponse>;
    GetRewardsEligibility(request: DeepPartial<GetRewardsEligibilityRequest>, metadata?: grpc.Metadata): Promise<GetRewardsEligibilityResponse>;
    GetHealthStatus(request: DeepPartial<GetHealthStatusRequest>, metadata?: grpc.Metadata): Promise<GetHealthStatusResponse>;
}
export declare class InjectiveDmmV2RPCClientImpl implements InjectiveDmmV2RPC {
    private readonly rpc;
    constructor(rpc: Rpc);
    GetEpochs(request: DeepPartial<GetEpochsRequest>, metadata?: grpc.Metadata): Promise<GetEpochsResponse>;
    GetTotalScores(request: DeepPartial<GetTotalScoresRequest>, metadata?: grpc.Metadata): Promise<GetTotalScoresResponse>;
    GetTotalScoresHistory(request: DeepPartial<GetTotalScoresHistoryRequest>, metadata?: grpc.Metadata): Promise<GetTotalScoresHistoryResponse>;
    GetEpochScores(request: DeepPartial<GetEpochScoresRequest>, metadata?: grpc.Metadata): Promise<GetEpochScoresResponse>;
    GetEpochScoresHistory(request: DeepPartial<GetEpochScoresHistoryRequest>, metadata?: grpc.Metadata): Promise<GetEpochScoresHistoryResponse>;
    GetMarketRewards(request: DeepPartial<GetMarketRewardsRequest>, metadata?: grpc.Metadata): Promise<GetMarketRewardsResponse>;
    GetEligibleAddresses(request: DeepPartial<GetEligibleAddressesRequest>, metadata?: grpc.Metadata): Promise<GetEligibleAddressesResponse>;
    GetRewardsDistribution(request: DeepPartial<GetRewardsDistributionRequest>, metadata?: grpc.Metadata): Promise<GetRewardsDistributionResponse>;
    GetAccountVolumes(request: DeepPartial<GetAccountVolumesRequest>, metadata?: grpc.Metadata): Promise<GetAccountVolumesResponse>;
    GetRewardsEligibility(request: DeepPartial<GetRewardsEligibilityRequest>, metadata?: grpc.Metadata): Promise<GetRewardsEligibilityResponse>;
    GetHealthStatus(request: DeepPartial<GetHealthStatusRequest>, metadata?: grpc.Metadata): Promise<GetHealthStatusResponse>;
}
export declare const InjectiveDmmV2RPCDesc: {
    serviceName: string;
};
export declare const InjectiveDmmV2RPCGetEpochsDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetTotalScoresDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetTotalScoresHistoryDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetEpochScoresDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetEpochScoresHistoryDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetMarketRewardsDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetEligibleAddressesDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetRewardsDistributionDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetAccountVolumesDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetRewardsEligibilityDesc: UnaryMethodDefinitionish;
export declare const InjectiveDmmV2RPCGetHealthStatusDesc: UnaryMethodDefinitionish;
interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
    requestStream: any;
    responseStream: any;
}
type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;
interface Rpc {
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;
}
export declare class GrpcWebImpl {
    private host;
    private options;
    constructor(host: string, options: {
        transport?: grpc.TransportFactory;
        debug?: boolean;
        metadata?: grpc.Metadata;
        upStreamRetryCodes?: number[];
    });
    unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any>;
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
