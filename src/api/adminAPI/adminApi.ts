import {
  MetaResponse,
  User,
  UserFilters,
  UserRequest,
  UserRolesRequest,
} from "../../types/users";
import { axiosInstance } from "../authAPI/axiosInstance";

const getString = (filters: UserFilters): string => {
  return Object.entries(filters)
    .filter(([_, value]) => value != null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const fetchUsers = async (
  filters: UserFilters
): Promise<MetaResponse<User>> => {
  const response = await axiosInstance.get(
    "/admin/users" + `?${getString(filters)}`
  );
  return response.data;
};

export const fetchUserProfile = async (id: string): Promise<User> => {
  const response = await axiosInstance.get("/admin/users/" + `${id}`);
  return response.data;
};

export const updateUserProfile = async (
  id: string,
  userRequest: UserRequest
): Promise<User> => {
  const response = await axiosInstance.put(
    "/admin/users/" + `${id}`,
    userRequest
  );
  return response.data;
};

export const updateUserRights = async (
  id: string,
  userRolesRequest: UserRolesRequest
) => {
  const response = await axiosInstance.post(
    `/admin/users/${id}/rights`,
    userRolesRequest
  );
  return response;
};

export const blockUser = async (id: string) => {
  const response = await axiosInstance.post(`/admin/users/${id}/block`);
  return response;
};

export const unblockUser = async (id: string) => {
  const response = await axiosInstance.post(`/admin/users/${id}/unblock`);
  return response;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete("/admin/users/" + `${id}`);
  return response;
};
