import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../types/auth";

type AuthInfo = {
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
};

type ProfileInfo = {
  profile: Profile | null;
  isLoading: boolean | null;
  error: string | null;
};

export interface AuthState {
  authInfo: AuthInfo;
  profileInfo: ProfileInfo;
}

const initialState: AuthState = {
  authInfo: {
    accessToken: null,
    isLoading: false,
    error: null,
  },
  profileInfo: {
    profile: null,
    isLoading: null,
    error: null,
  },
};

const updateAuthInfo = (state: AuthState, updates: Partial<AuthInfo>) => ({
  ...state,
  authInfo: { ...state.authInfo, ...updates },
});

const updateProfileInfo = (state: AuthState, updates: Partial<ProfileInfo>) => ({
  ...state,
  profileInfo: { ...state.profileInfo, ...updates },
});

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state): AuthState => updateAuthInfo(state, { isLoading: true }),

    loginSuccess: (state, action: PayloadAction<string>): AuthState =>
      updateAuthInfo(state, {
        accessToken: action.payload,
        isLoading: false,
        error: null,
      }),

    loginFailure: (state, action: PayloadAction<string>): AuthState =>
      updateAuthInfo(state, { isLoading: false, error: action.payload }),

    loadProfileStart: (state): AuthState =>
      updateProfileInfo(state, { isLoading: true }),

    loadProfileSuccess: (state, action: PayloadAction<Profile>): AuthState =>
      updateProfileInfo(state, {
        profile: action.payload,
        isLoading: false,
        error: null,
      }),

    loadProfileFailure: (state, action: PayloadAction<string>): AuthState =>
      updateProfileInfo(state, { profile: null, isLoading: false, error: action.payload }),

    logoutSuccess: (): AuthState => initialState,
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
  logoutSuccess,
} = authReducer.actions;

export default authReducer.reducer;
