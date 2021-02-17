export enum StatusType {
  Idle = 'idle',
  Loading = 'loading',
  Completed = 'completed',
  Error = 'error',
  Confirmed = 'confirmed',
}

export default class Status {
  public status: string

  constructor(status = StatusType.Idle) {
    this.status = status
  }

  get(): string {
    return this.status
  }

  set(status: StatusType): void {
    this.status = status
  }

  is(status: StatusType): boolean {
    return this.status === status
  }

  isLoading(): boolean {
    return this.is(StatusType.Loading)
  }

  isNotLoading(): boolean {
    return !this.is(StatusType.Loading)
  }

  isCompleted(): boolean {
    return this.is(StatusType.Completed)
  }

  isConfirmed(): boolean {
    return this.is(StatusType.Confirmed)
  }

  isIdle(): boolean {
    return this.is(StatusType.Idle)
  }

  isError(): boolean {
    return this.is(StatusType.Error)
  }

  setLoading(): void {
    this.set(StatusType.Loading)
  }

  setCompleted(): void {
    this.set(StatusType.Completed)
  }

  setConfirmed(): void {
    this.set(StatusType.Confirmed)
  }

  setError(): void {
    this.set(StatusType.Error)
  }

  setIdle(): void {
    this.set(StatusType.Idle)
  }

  toggle(): void {
    this.set(
      this.status === StatusType.Idle ? StatusType.Loading : StatusType.Idle,
    )
  }

  toString(): string {
    return this.get()
  }

  valueOf(): string {
    return this.get()
  }
}
