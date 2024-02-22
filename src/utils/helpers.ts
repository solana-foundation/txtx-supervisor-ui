import { NavItem } from "../components/sidebar/nav-item";

export function SortNavItemsRecursive(a: NavItem, b: NavItem) {
  if (a.children && b.children) {
    a.children.sort(SortNavItemsRecursive);
    b.children.sort(SortNavItemsRecursive);
    return 0;
  } else if (a.children) {
    a.children.sort(SortNavItemsRecursive);
    return 1;
  } else if (b.children) {
    b.children.sort(SortNavItemsRecursive);
    return -1;
  } else {
    return 0;
  }
}
