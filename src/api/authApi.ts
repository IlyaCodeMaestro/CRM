const API_BASE_URL = "https://easydev.club/api/v1";

import axios from "axios";
import {
  AuthData,
  UserRegistration,
  Token,
  Profile,
} from "../types/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authenticateUser = async (authData: AuthData): Promise<Token> => {
  try {
    const response = await api.post<Token>("/auth/signin", authData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при входе в систему";
    throw new Error(errorMessage);
  }
};


export const registerUser = async (userData: UserRegistration): Promise<Profile> => {
  try {
    const response = await api.post<Profile>("/auth/signup", userData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при регистрации";
    throw new Error(errorMessage);
  }
};

export const fetchUserProfile = async (token: Token): Promise<Profile> => {
  try {
    const response = await api.get<Profile>("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при получении профиля";
    throw new Error(errorMessage);
  }
};