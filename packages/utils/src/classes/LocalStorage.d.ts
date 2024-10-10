export default class LocalStorage {
    private storage;
    constructor(namespace: string);
    get(key: string, defaultValue?: unknown): unknown;
    has(key: string): boolean;
    set(key: string, value: unknown): void;
    remove(key: string): void;
    clear(): void;
}
//# sourceMappingURL=LocalStorage.d.ts.map