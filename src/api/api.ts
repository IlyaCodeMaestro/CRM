const API_BASE_URL = "https://easydev.club/api/v1";
//g
import { Todo, TodoInfo, TodoRequest, MetaResponse } from "../types/todo";
import axios from "axios";
const api = axios.create({
  baseURL: API_BASE_URL,
});
export const getTasks = async (
  filter: "all" | "completed" | "inWork"
): Promise<MetaResponse<Todo, TodoInfo>> => {
  try {
    const response = await api.get(`${API_BASE_URL}/todos?filter=${filter}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при запросе задач";
    throw new Error(errorMessage);
  }
};

export const addTask = async (todoRequest: TodoRequest): Promise<Todo> => {
  try {
    const response = await api.post("/todos", todoRequest);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при создании задачи";
    throw new Error(errorMessage);
  }
};

export const updateTask = async (
  id: number,
  todoRequest: TodoRequest
): Promise<Todo> => {
  try {
    const response = await api.put(`/todos/${id}`, todoRequest);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при обновлении задачи";
    throw new Error(errorMessage);
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Произошла ошибка при удалении задачи";
    throw new Error(errorMessage);
  }
};