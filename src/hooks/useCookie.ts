export const AUTH_COOKIE_KEY = "hanko";
export default function useCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts === undefined) return;
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}
