import { BigNumberInBase, BigNumber } from './classes';
export declare const SECONDS_IN_A_DAY: BigNumber;
export declare const convertTimestampToMilliseconds: (timestamp: number | string) => number;
export declare const getUTCDateFromTimestamp: (timestamp: number) => string;
export declare const tomorrow: () => BigNumber;
export declare const todayInSeconds: () => number;
export declare const past24Hours: () => number;
export declare const pastDays: (day?: number) => number;
export declare const getEndDateStringFromTimeInSeconds: (timeInSeconds: BigNumberInBase) => string;
//# sourceMappingURL=time.d.ts.map