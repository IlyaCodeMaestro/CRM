import axios from "axios";
import {
  UserFilters,
  MetaResponse,
  User,
  UserRolesRequest,
  UserRequest,
} from "../types/users";

const API_BASE_URL = "https://easydev.club/api/v1";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? JSON.parse(token).accessToken : null;
};

export const getUsers = async (
  filters: UserFilters
): Promise<MetaResponse<User>> => {
  const token = getAuthToken();
  const response = await axios.get(`${API_BASE_URL}/admin/users`, {
    params: {
      ...filters,
      isBlocked: filters.isBlocked === undefined ? undefined : filters.isBlocked ? 'true' : 'false'
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserProfile = async (id: number): Promise<User> => {
  const token = getAuthToken();
  const response = await axios.get(`${API_BASE_URL}/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserRoles = async (
  id: number,
  rolesRequest: UserRolesRequest
): Promise<User> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_BASE_URL}/admin/users/${id}/rights`,
    rolesRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUserProfile = async (
  id: number,
  userRequest: Partial<UserRequest>
): Promise<User> => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_BASE_URL}/admin/users/${id}`,
    userRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const blockUser = async (id: number): Promise<User> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_BASE_URL}/admin/users/${id}/block`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const unblockUser = async (id: number): Promise<User> => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_BASE_URL}/admin/users/${id}/unblock`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const token = getAuthToken();
  await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

