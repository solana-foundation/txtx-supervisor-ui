import { BACKEND_URL } from "../App";
import { useAppDispatch } from "../hooks";
import {
  clearMultiPartySharing,
  setMultiPartyEnabled,
} from "../reducers/multi-party-slice";
import useCookie, { AUTH_COOKIE_KEY } from "./useCookie";

let isDeleting = false;
export default function useDeleteChannel(doDelete: boolean, slug: string) {
  const dispatch = useAppDispatch();
  const cookie = useCookie(AUTH_COOKIE_KEY);
  if (cookie === undefined || !doDelete || isDeleting) return;
  isDeleting = true;
  fetch(`${BACKEND_URL}/api/v1/channels`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
    credentials: "include",
  })
    .then((res) => {
      if (res.status == 200) {
        isDeleting = false;
        dispatch(clearMultiPartySharing());
      } else {
        isDeleting = false; // todo display error to user
        dispatch(setMultiPartyEnabled(true));
      }
    })
    .catch((err) => {
      isDeleting = false;

      console.error("deleting channel failed", err);
    });
}
