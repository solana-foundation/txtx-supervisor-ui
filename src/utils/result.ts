export class Result<T, E> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  // Static method to create an Ok result
  static ok<T, E = never>(value: T): Result<T, E> {
    return new Result(value, undefined as E);
  }

  // Static method to create an Err result
  static err<E, T = never>(error: E): Result<T, E> {
    return new Result(undefined as T, error);
  }

  unwrap(): T {
    if (this.is_err()) {
      throw new Error("Tried to unwrap an Err result");
    }
    return this._value as T;
  }

  // Get the Err value (throws if result is Ok)
  unwrap_err(): E {
    if (this.is_ok()) {
      throw new Error("Tried to unwrap an Ok result");
    }
    return this._error as E;
  }

  // Check if result is Ok
  is_ok(): boolean {
    return this._error === undefined;
  }

  // Check if result is Err
  is_err(): boolean {
    return this._error !== undefined;
  }

  // Map over the Ok value, if it exists
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.is_ok()) {
      return Result.ok(fn(this._value as T));
    }
    return Result.err(this._error as E);
  }

  // Map over the Err value, if it exists
  map_err<F>(fn: (error: E) => F): Result<T, F> {
    if (this.is_err()) {
      return Result.err(fn(this._error as E));
    }
    return Result.ok(this._value as T);
  }
}
