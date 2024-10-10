"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusType = void 0;
var StatusType;
(function (StatusType) {
    StatusType["Idle"] = "idle";
    StatusType["Loading"] = "loading";
    StatusType["Completed"] = "completed";
    StatusType["Error"] = "error";
    StatusType["Confirmed"] = "confirmed";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
class Status {
    constructor(status = StatusType.Idle) {
        this.status = status;
    }
    get() {
        return this.status;
    }
    set(status) {
        this.status = status;
    }
    is(status) {
        return this.status === status;
    }
    isLoading() {
        return this.is(StatusType.Loading);
    }
    isNotLoading() {
        return !this.is(StatusType.Loading);
    }
    isCompleted() {
        return this.is(StatusType.Completed);
    }
    isConfirmed() {
        return this.is(StatusType.Confirmed);
    }
    isIdle() {
        return this.is(StatusType.Idle);
    }
    isError() {
        return this.is(StatusType.Error);
    }
    setLoading() {
        this.set(StatusType.Loading);
    }
    setCompleted() {
        this.set(StatusType.Completed);
    }
    setConfirmed() {
        this.set(StatusType.Confirmed);
    }
    setError() {
        this.set(StatusType.Error);
    }
    setIdle() {
        this.set(StatusType.Idle);
    }
    toggle() {
        this.set(this.status === StatusType.Idle ? StatusType.Loading : StatusType.Idle);
    }
    toString() {
        return this.get();
    }
    valueOf() {
        return this.get();
    }
}
exports.default = Status;
//# sourceMappingURL=Status.js.map