const API_BASE_URL = "https://easydev.club/api/v1";

import { Todo, TodoInfo, TodoRequest, MetaResponse } from "../types/todo";

export const getTasks = async (filter: "all" | "completed" | "inWork"): Promise<MetaResponse<Todo, TodoInfo>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos?filter=${filter}`);
    if (!response.ok) {
      throw new Error("Не удалось загрузить задачи");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Произошла ошибка при запросе задач");
  }
};

export const addTask = async (todoRequest: TodoRequest): Promise<Todo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoRequest),
    });
    if (!response.ok) {
      throw new Error("Не удалось создать задачу");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Произошла ошибка при создании задачи");
  }
};

export const updateTask = async (id: number, todoRequest: TodoRequest): Promise<Todo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoRequest),
    });
    if (!response.ok) {
      throw new Error("Не удалось обновить задачу");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Произошла ошибка при обновлении задачи");
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Не удалось удалить задачу");
    }
  } catch (error) {
    throw new Error(error.message || "Произошла ошибка при удалении задачи");
  }
};
