import styles from "./styles/App.module.scss";
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
  const showMessage = (type: "error" | "success", message: string) => {
    if (type === "error") setError(message);
    if (type === "success") setSuccess(message);

    setTimeout(() => {
      type === "error" ? setError("") : setSuccess("");
    }, 2000);
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
      showMessage("error", error.message);
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
      showMessage("error", error.message);
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
      showMessage("error", "Ошибка при обновлении текста задачи");
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
      showMessage("error", error.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      fetchTasks();
      showMessage("success", "Задача успешно удалена");
    } catch (error) {
      showMessage("error", error.message);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  return (
    <div className={styles.todoApp}>
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
