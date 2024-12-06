import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoTabs from "./components/TodoTabs";
import { Todo, TodoInfo } from "./types/todo";
import { getTasks, addTask, updateTask, deleteTask } from "./api/api";
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

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "1rem",
        padding: "1rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
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
    </div>
  );
};

export default App;
