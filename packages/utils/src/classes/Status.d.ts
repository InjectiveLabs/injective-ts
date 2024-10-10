export declare enum StatusType {
    Idle = "idle",
    Loading = "loading",
    Completed = "completed",
    Error = "error",
    Confirmed = "confirmed"
}
export default class Status {
    status: string;
    constructor(status?: StatusType);
    get(): string;
    set(status: StatusType): void;
    is(status: StatusType): boolean;
    isLoading(): boolean;
    isNotLoading(): boolean;
    isCompleted(): boolean;
    isConfirmed(): boolean;
    isIdle(): boolean;
    isError(): boolean;
    setLoading(): void;
    setCompleted(): void;
    setConfirmed(): void;
    setError(): void;
    setIdle(): void;
    toggle(): void;
    toString(): string;
    valueOf(): string;
}
//# sourceMappingURL=Status.d.ts.map