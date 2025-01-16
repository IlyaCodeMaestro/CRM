import { AxiosResponse } from "axios";
import { AuthData, Profile, Token, UserRegistration } from "../../types/auth";
import { axiosInstance, axiosInstancePublic } from "./axiosInstance";

export const login = async (authData: AuthData): Promise<Token> => {
  const response = await axiosInstance.post("/auth/signin", authData);
  return response.data;
};

export const logout = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.post("/user/logout");
  return response;
};

export const loadProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};

export const register = async (userData: UserRegistration): Promise<Token> => {
  const response = await axiosInstancePublic.post("/auth/signup", userData);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<Token> => {
  const response = await axiosInstancePublic.post("/auth/refresh", {
    refreshToken: refreshToken,
  });
  return response.data;
};
