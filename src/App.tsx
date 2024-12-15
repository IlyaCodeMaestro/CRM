import { useState, useEffect, ReactNode } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TodoList from "./components/Todo/TodoList";
import TodoForm from "./components/Todo/TodoForm";
import TodoTabs from "./components/Todo/TodoTabs";
import AuthPage from "./components/Auth/AuthPage";
import { Todo, TodoInfo } from "./types/todo";
import { getTasks, addTask, updateTask, deleteTask } from "./api/todoApi";
import { Layout, Menu } from "antd";
import { useLocation } from "react-router-dom";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import ProfilePage from "./components/Profile/ProfilePage";
const { Content, Sider } = Layout;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const isLoadingAuth = useSelector((state: RootState) => state.auth.loading);
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [todoInfo, setTodoInfo] = useState<TodoInfo>({
    all: 0,
    completed: 0,
    inWork: 0,
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "completed" | "inWork">("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showMessage = (type: "error" | "success", message: string): void => {
    if (type === "error") {
      setError(message);
      setTimeout(() => setError(""), 2000);
    } else if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 2000);
    }
  };

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
  }, [isAuthenticated, location.pathname, filter]);

  const fetchTasks = async () => {
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
      showMessage("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (text: string) => {
    try {
      const newTask = await addTask({ title: text });
      setTasks((prev) => [...prev, newTask]);
      fetchTasks();
      showMessage("success", "Задача успешно добавлена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showMessage("error", errorMessage);
    }
  };

  const handleUpdateTaskText = async (id: number, newText: string) => {
    try {
      const updatedTask = await updateTask(id, { title: newText });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      showMessage("success", "Текст задачи успешно обновлен");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ошибка при обновлении текста задачи";
      showMessage("error", errorMessage);
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
      showMessage("success", "Задача успешно обновлена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showMessage("error", errorMessage);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      fetchTasks();
      showMessage("success", "Задача успешно удалена");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      showMessage("error", errorMessage);
    }
  };

  if (isLoadingAuth) {
    return <div>Проверка аутентификации...</div>;
  }

  if (
    !isAuthenticated &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register")
  ) {
    return <Navigate to="/login" />;
  }
  const menuItems = [
    {
      label: <span style={{ color: "black" }}>Список задач</span>,
      key: "1",
      icon: <UnorderedListOutlined style={{ color: "black" }} />,
      onClick: () => navigate("/"),
    },
    {
      label: <span style={{ color: "black" }}>Личный кабинет</span>,
      key: "2",
      icon: <UserOutlined style={{ color: "black" }} />,
      onClick: () => navigate("/profile"),
    },
  ];

  const LayoutWithSidebar = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const selectedKey = location.pathname === "/profile" ? "2" : "1";
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider style={{ backgroundColor: "white" }}>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };
  return (
    <Routes>
      <Route path="/login" element={<AuthPage isLogin={true} />} />
      <Route path="/register" element={<AuthPage isLogin={false} />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <LayoutWithSidebar>
              <TodoForm addTask={handleAddTask} />
              {isLoading ? (
                <div>Загрузка...</div>
              ) : (
                <>
                  <TodoTabs
                    error={error}
                    success={success}
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
            </LayoutWithSidebar>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <LayoutWithSidebar>
              <ProfilePage />

              <div>Токен не найден. Пожалуйста, войдите в систему.</div>
            </LayoutWithSidebar>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};
export default App;
