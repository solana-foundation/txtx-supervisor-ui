import { NavItem } from "../components/sidebar/nav-item";

export function sortNavItemsRecursive(a: NavItem, b: NavItem) {
  if (a.children && b.children) {
    a.children.sort(sortNavItemsRecursive);
    b.children.sort(sortNavItemsRecursive);
    return 0;
  } else if (a.children) {
    a.children.sort(sortNavItemsRecursive);
    return 1;
  } else if (b.children) {
    b.children.sort(sortNavItemsRecursive);
    return -1;
  } else {
    return 0;
  }
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStorageKey(namespace: string): string {
  return `txtx_${namespace}_data`;
}
export function getPublicKeyFromLocalStorage(
  storageKey: string,
  address: string,
): string | undefined {
  const addressToKeyMapStr = localStorage.getItem(storageKey);
  if (addressToKeyMapStr === null) return;
  const addressToKeyMap = JSON.parse(addressToKeyMapStr);
  if (typeof addressToKeyMap !== "object") return;
  return addressToKeyMap[address];
}

export function storePublicKeyInLocalStorage(
  storageKey: string,
  address: string,
  publicKey: string,
) {
  const addressToKeyMapStr = localStorage.getItem(storageKey);
  if (addressToKeyMapStr === null) {
    localStorage.setItem(storageKey, JSON.stringify({ address: publicKey }));
  } else {
    const addressToKeyMap = JSON.parse(addressToKeyMapStr);
    if (typeof addressToKeyMap !== "object") {
      // we have invalid storage at this key, overwrite it
      localStorage.setItem(storageKey, JSON.stringify({ address: publicKey }));
    } else {
      addressToKeyMap[address] = publicKey;
      localStorage.setItem(storageKey, JSON.stringify(addressToKeyMap));
    }
  }
}
