import { beforeEach, describe, expect, it } from "vitest";
import {
  getPublicKeyFromLocalStorage,
  getStorageKey,
  storePublicKeyInLocalStorage,
} from "./helpers";

describe("helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("builds namespaced storage keys", () => {
    expect(getStorageKey("evm")).toBe("txtx_evm_data");
  });

  it("stores and retrieves public keys from local storage", () => {
    const storageKey = getStorageKey("svm");

    storePublicKeyInLocalStorage(storageKey, "address-1", "pubkey-1");

    expect(getPublicKeyFromLocalStorage(storageKey, "address-1")).toBe(
      "pubkey-1",
    );
  });

  it("returns undefined when storage is missing or invalid", () => {
    const storageKey = getStorageKey("evm");

    expect(getPublicKeyFromLocalStorage(storageKey, "address-1")).toBeUndefined();

    localStorage.setItem(storageKey, JSON.stringify("not-an-object"));

    expect(getPublicKeyFromLocalStorage(storageKey, "address-1")).toBeUndefined();
  });

  it("overwrites invalid storage and appends additional addresses", () => {
    const storageKey = getStorageKey("evm");

    localStorage.setItem(storageKey, JSON.stringify("not-an-object"));
    storePublicKeyInLocalStorage(storageKey, "address-1", "pubkey-1");
    storePublicKeyInLocalStorage(storageKey, "address-2", "pubkey-2");

    expect(getPublicKeyFromLocalStorage(storageKey, "address-1")).toBe(
      "pubkey-1",
    );
    expect(getPublicKeyFromLocalStorage(storageKey, "address-2")).toBe(
      "pubkey-2",
    );
  });
});
