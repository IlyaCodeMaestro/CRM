import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthData, Profile, Token, UserRegistration } from "../types/auth";
import { authenticateUser, registerUser } from "../api/authApi";

interface AuthState {
  loading: boolean;
  user: Profile | null;
  token: Token | null;
  error: string | null;
}
const initialState: AuthState = {
  loading: false,
  user: null,
  token: null,
  error: null,
};

export const registerUserThunk = createAsyncThunk<
  void,
  UserRegistration,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    await registerUser(userData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Ошибка регистрации");
    } else {
      return rejectWithValue("Неизвестная ошибка");
    }
  }
});

export const authenticateUserThunk = createAsyncThunk<
  Token,
  AuthData,
  { rejectValue: string }
>("auth/login", async (authData, { rejectWithValue }) => {
  try {
    const response = await authenticateUser(authData);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Ошибка аутентификации");
    } else {
      return rejectWithValue("Неизвестная ошибка");
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.error = null;
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
    initializeAuth: (state) => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        state.token = JSON.parse(storedToken);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка регистрации";
      })
      .addCase(authenticateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authenticateUserThunk.fulfilled,
        (state, action: PayloadAction<Token>) => {
          state.loading = false;
          state.token = action.payload;
          state.error = null;
          localStorage.setItem('token', JSON.stringify(action.payload))
        }
      )
      .addCase(authenticateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка регистрации";
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
