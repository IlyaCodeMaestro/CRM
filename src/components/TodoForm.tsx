import React, { useState } from "react";
import styles from "../styles/TodoForm.module.scss";

interface TodoFormProps {
  addTask: (text: string) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTask }) => {
  const [newTask, setNewTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim().length < 2 || newTask.length > 64) {
      alert("Задача должна содержать от 2 до 64 символов");
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask(newTask);
      setNewTask("");
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputSection}>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Введите новую задачу..."
        className={styles.taskInput}
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        className={styles.addButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Добавление..." : "Добавить"}
      </button>
    </form>
  );
};

export default TodoForm;
