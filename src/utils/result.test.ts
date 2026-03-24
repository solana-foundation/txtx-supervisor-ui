import { describe, expect, it } from "vitest";
import { Result } from "./result";

describe("Result", () => {
  it("creates and unwraps ok values", () => {
    const result = Result.ok<number, string>(42);

    expect(result.is_ok()).toBe(true);
    expect(result.is_err()).toBe(false);
    expect(result.unwrap()).toBe(42);
  });

  it("creates and unwraps err values", () => {
    const result = Result.err<string, number>("boom");

    expect(result.is_ok()).toBe(false);
    expect(result.is_err()).toBe(true);
    expect(result.unwrap_err()).toBe("boom");
  });

  it("throws when unwrapping the wrong variant", () => {
    expect(() => Result.err("boom").unwrap()).toThrow(
      "Tried to unwrap an Err result",
    );
    expect(() => Result.ok("value").unwrap_err()).toThrow(
      "Tried to unwrap an Ok result",
    );
  });

  it("maps ok values", () => {
    const result = Result.ok<number, string>(2).map((value) => value * 3);

    expect(result.unwrap()).toBe(6);
  });

  it("preserves errors when mapping ok values on err results", () => {
    const result = Result.err<string, number>("boom").map((value) => value * 3);

    expect(result.unwrap_err()).toBe("boom");
  });

  it("maps error values", () => {
    const result = Result.err<string, number>("boom").map_err(
      (error) => `${error}!`,
    );

    expect(result.unwrap_err()).toBe("boom!");
  });

  it("preserves ok values when mapping errors on ok results", () => {
    const result = Result.ok<number, string>(7).map_err(
      (error) => `${error}!`,
    );

    expect(result.unwrap()).toBe(7);
  });
});
