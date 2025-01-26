import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://easydev.club/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosInstancePublic = axios.create({
  baseURL: 'https://easydev.club/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
