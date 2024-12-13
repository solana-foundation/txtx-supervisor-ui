export const AUTH_COOKIE_KEY = "nhost";
import { getCookieValue } from "../utils/helpers";

export default function useCookie(name: string) {
  return getCookieValue(name);
}
