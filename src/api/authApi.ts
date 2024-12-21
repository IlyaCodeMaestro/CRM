import api from "./axiosInstance";
import {
  AuthData,
  UserRegistration,
  Token,
  Profile,
} from "../types/auth";

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

export const fetchUserProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get<Profile>("/user/profile");
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при получении профиля";
    throw new Error(errorMessage);
  }
};
