import { CommandData } from "../components/main/types";
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

export function sortCommands(a: CommandData, b: CommandData) {
  if (a.index < b.index) {
    return -1;
  }
  if (a.index > b.index) {
    return 1;
  }
  return 0;
}

export const filterKeysFromObject = (
  raw: { [key: string]: string },
  allowed: string[],
): { [key: string]: string } => {
  const filtered = Object.keys(raw)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
  return filtered;
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
