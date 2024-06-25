import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../App";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearToken,
  selectToken,
  selectTokenNeeded,
  setToken,
  setTokenNeeded,
} from "../reducers/auth-slice";

let fetching = false;
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const tokenNeeded = useAppSelector(selectTokenNeeded);
  const token = useAppSelector(selectToken);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (tokenNeeded === undefined && !fetching) {
      fetching = true;
      const fetchTokenNeeded = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/discovery`);
          const data = await res.json();
          dispatch(setTokenNeeded(data.needsCredentials));
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
    dispatch(setToken(data));
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    dispatch(clearToken());
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
