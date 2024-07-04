import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearParticipantToken,
  selectParticipantToken,
  selectParticipantTokenNeeded,
  setParticipantToken,
  initializeClient,
} from "../reducers/participant-auth-slice";

let fetching = false;
export const useParticipantAuth = () => {
  const dispatch = useAppDispatch();
  const tokenNeeded = useAppSelector(selectParticipantTokenNeeded);
  const token = useAppSelector(selectParticipantToken);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (tokenNeeded === undefined && !fetching) {
      fetching = true;
      const fetchTokenNeeded = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/discovery`);
          const data = await res.json();
          dispatch(initializeClient(data));
          fetching = false;
        } catch (error) {
          console.error(error);
        }
      };

      fetchTokenNeeded();
    }
  }, [dispatch]);

  // call this function when you want to authenticate the user
  const login = async (data) => {
    dispatch(setParticipantToken(data));
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    dispatch(clearParticipantToken());
    const route = slug ? `/c/${slug}/login` : "/login";
    navigate(route, { replace: true });
  };

  const auth = useMemo(
    () => ({
      token,
      tokenNeeded,
      login,
      logout,
    }),
    [token, tokenNeeded],
  );
  return auth;
};
