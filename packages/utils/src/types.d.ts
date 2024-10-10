export type Awaited<T> = T extends null | undefined ? T : T extends object & {
    then(onfulfilled: infer F, ...args: infer _): any;
} ? F extends (value: infer V, ...args: infer _) => any ? Awaited<V> : never : T;
//# sourceMappingURL=types.d.ts.map