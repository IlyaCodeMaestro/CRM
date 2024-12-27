export interface UserFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isBlocked?: boolean;
    limit: number;
    offset: number;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    date: string;
    isBlocked: boolean;
    roles: Roles[];
    phoneNumber: string;
  }
  
  export interface MetaResponse<T> {
    data: T[];
    meta: {
      totalAmount: number;
      sortBy: string;
      sortOrder: "asc" | "desc";
    };
  }
  
  export interface UserRolesRequest {
    roles: Roles[];
  }
  
  export interface UserRequest {
    username?: string;
    email?: string;
    phoneNumber?: string;
  }
  
  export enum Roles {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
  }
  