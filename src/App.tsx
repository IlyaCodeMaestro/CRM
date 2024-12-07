import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoTabs from "./components/TodoTabs";
import { Todo, TodoInfo } from "./types/todo";
import { getTasks, addTask, updateTask, deleteTask } from "./api/api";
import { Layout, Menu } from "antd";
const { Content, Sider } = Layout;
const App = () => {
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
    fetchTasks();
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 5000);
    setTimeout(() => {
      clearInterval(intervalId);
    }, 10000);
  }, [filter]);

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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  const menuItems = [
    {
      label: <Link to="/">Список задач</Link>,
      key: "1",
      icon: <UnorderedListOutlined />,
    },
    {
      label: <Link to="/profile">Профиль</Link>,
      key: "2",
      icon: <UserOutlined />,
    },
  ];
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content
            style={{ margin: "24px 16px", padding: 24, background: "#fff" }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <TodoForm addTask={handleAddTask} />
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
                }
              />
              <Route path="/profile" element={<div>Привет!</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
//fgfg
export default App;