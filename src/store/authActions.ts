import { message } from "antd";
import { AuthData, Token } from "../types/auth"; 
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
} from "./authSlice";
import { loadProfile, login, logout, refreshToken } from "../api/authAPI/authService";

type ApiErrorType = {
  message: string;
};

export const loginUser =
  (data: AuthData) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(loginStart());
      const res = await login(data);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      dispatch(loginSuccess(res.accessToken));
      dispatch(getProfile() as unknown as UnknownAction);
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if ((error as ApiErrorType).message) {
        errorMessage = (error as ApiErrorType).message;
      }
      
      dispatch(loginFailure(errorMessage));
      message.error(`Login failed: ${errorMessage}`);
      throw error;
    }
  };

export const logoutUser =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      await logout();
      localStorage.clear();
      dispatch(logoutSuccess());
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if ((error as ApiErrorType).message) {
        errorMessage = (error as ApiErrorType).message;
      }

      message.error(`Logout failed: ${errorMessage}`);
      throw error;
    }
  };

export const getProfile =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(loadProfileStart());
      const res = await loadProfile();
      dispatch(loadProfileSuccess(res));
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if ((error as ApiErrorType).message) {
        errorMessage = (error as ApiErrorType).message;
      }

      dispatch(loadProfileFailure(errorMessage));;
    }
  };

let refreshTokenRequest: Promise<Token> | null = null;

export const getNewAccessToken =
  () =>
  async (dispatch: Dispatch): Promise<string | null> => {
    try {
      const currentRefreshToken: string | null = localStorage.getItem("refreshToken");
      if (refreshTokenRequest === null && currentRefreshToken) {
        refreshTokenRequest = refreshToken(currentRefreshToken);
      }
      const res = await refreshTokenRequest;
      refreshTokenRequest = null;
      if (res) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        dispatch(loginSuccess(res.accessToken));
        return res.accessToken;
      }
      return null;
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if ((error as ApiErrorType).message) {
        errorMessage = (error as ApiErrorType).message;
      }

      message.error(`Failed to refresh token: ${errorMessage}`);
      throw error;
    }
  };