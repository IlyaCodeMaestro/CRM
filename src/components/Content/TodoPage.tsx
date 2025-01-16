import { useCallback, useEffect, useState } from "react";
import { Todo, TodoInfo } from "../../types/todo";
import { notification } from "antd";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../api/todoApi/todoApi";
import TodoForm from "../Todo/TodoForm";
import TodoTabs from "../Todo/TodoTabs";
import TodoList from "../Todo/TodoList";

const TodoPage = () => {
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
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [filter, fetchTasks]);

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

 
  return (
    <>
      <TodoForm addTask={handleAddTask} />
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <TodoTabs filter={filter} setFilter={setFilter} todoInfo={todoInfo} />
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
  );
};

export default TodoPage;
