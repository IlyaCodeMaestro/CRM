import { useState, useEffect, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import TodoList from "./components/Todo/TodoList";
import TodoForm from "./components/Todo/TodoForm";
import TodoTabs from "./components/Todo/TodoTabs";
import { Todo, TodoInfo } from "./types/todo";
import { getTasks, addTask, updateTask, deleteTask } from "./api/todoApi";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import ProfilePage from "./components/Profile/ProfilePage";
import Sidebar from "./components/Layout/SidebarLayout";
import RegisterForm from "./components/Auth/RegisterForm";
import AuthForm from "./components/Auth/AuthForm";
import { notification } from "antd";
import { useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const isLoadingAuth = useSelector((state: RootState) => state.auth.loading);
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [todoInfo, setTodoInfo] = useState<TodoInfo>({
    all: 0,
    completed: 0,
    inWork: 0,
  });
  const [filter, setFilter] = useState<"all" | "completed" | "inWork">("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showNotification = (
    type: "error" | "success",
    message: string,
    description?: string
  ): void => {
    notification[type]({
      message,
      description,
    });
  };
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(filter);
      setTasks(data.data);
      if (data.info) {
        setTodoInfo(data.info);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showNotification("error", "Ошибка загрузки задач", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    ) {
      return;
    }
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, location.pathname, filter, fetchTasks]);

  const handleAddTask = async (text: string) => {
    try {
      const newTask = await addTask({ title: text });
      setTasks((prev) => [...prev, newTask]);
      fetchTasks();
      showNotification("success", "Задача успешно добавлена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showNotification("error", "Ошибка добавления задачи", errorMessage);
    }
  };

  const handleUpdateTaskText = async (id: number, newText: string) => {
    try {
      const updatedTask = await updateTask(id, { title: newText });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      showNotification("success", "Текст задачи успешно обновлен");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ошибка при обновлении текста задачи";
      showNotification("error", "Ошибка обновления задачи", errorMessage);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      if (!taskToToggle) return;

      await updateTask(id, {
        isDone: !taskToToggle.isDone,
      });
      fetchTasks();
      showNotification("success", "Задача успешно обновлена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showNotification("error", "Ошибка обновления задачи", errorMessage);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      fetchTasks();
      showNotification("success", "Задача успешно удалена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showNotification("error", "Ошибка удаления задачи", errorMessage);
    }
  };

  if (isLoadingAuth) {
    return <div>Проверка аутентификации...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route element={isAuthenticated ? <Sidebar /> : <Navigate to="/login" />}>
        <Route
          path="/"
          element={
            <>
              <TodoForm addTask={handleAddTask} />
              {isLoading ? (
                <div>Загрузка...</div>
              ) : (
                <>
                  <TodoTabs
                    filter={filter}
                    setFilter={setFilter}
                    todoInfo={todoInfo}
                  />
                  <TodoList
                    tasks={tasks}
                    filter={filter}
                    toggleTask={handleToggleTask}
                    updateTaskText={handleUpdateTaskText}
                    deleteTask={handleDeleteTask}
                  />
                </>
              )}
            </>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};
export default App;
