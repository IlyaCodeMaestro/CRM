export interface UserRegistration {
    login: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface AuthData {
    login: string;
    password: string;
  }
  
  export interface RefreshToken {
    refreshToken: string;
  }
  
  export interface Profile {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    isAdmin: boolean;
    phoneNumber: string;
  }
  
  export interface ProfileRequest {
    username: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface PasswordRequest {
    password: string;
  }
  
  export interface Token {
    accessToken: string;
    refreshToken: string
  }
  
  