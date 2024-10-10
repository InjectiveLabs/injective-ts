export * from './enums';
export * from './aliases';
export * from './transactions';
export * from './cosmos';
export * from './trade';
export interface StreamStatusResponse {
    details: string;
    code: number;
    metadata: any;
}
export declare enum StreamOperation {
    Insert = "insert",
    Delete = "delete",
    Replace = "replace",
    Update = "update",
    Invalidate = "invalidate"
}
export interface PaginationOption {
    key: string;
    offset?: number;
    skip?: number;
    limit?: number;
    reverse?: boolean;
    countTotal?: boolean;
}
export interface Constructable<T> {
    new (...args: never): T;
}
export type UnwrappedPromise<T> = T extends Promise<infer Return> ? Return : T;
//# sourceMappingURL=index.d.ts.map