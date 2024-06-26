import { BACKEND_URL } from "../App";
import { useAppDispatch } from "../hooks";
import { clearMultiPartySharing } from "../reducers/multi-party-slice";
import useCookie, { AUTH_COOKIE_KEY } from "./useCookie";

export default function useDeleteChannel() {
  const dispatch = useAppDispatch();
  const cookie = useCookie(AUTH_COOKIE_KEY);

  fetch(`${BACKEND_URL}/api/v1/channels`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => {
      res.json().then(() => {
        dispatch(clearMultiPartySharing());
      });
    })
    .catch((err) => {
      console.log("deleting channel failed", err);
    });
}
