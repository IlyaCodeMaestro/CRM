import styles from "../styles/TodoItem.module.scss";
import { useState } from "react";
import { Todo } from "../types/todo";

interface TodoItemProps {
  task: Todo;
  toggleTask: (id: number) => Promise<void>;
  updateTaskText: (id: number, newText: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  task,
  toggleTask,
  updateTaskText,
  deleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.title);
  const handleToggleTask = async () => {
    try {
      await toggleTask(task.id);
    } catch (error) {
      console.error("Ошибка при переключении задачи:", error);
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedText.trim().length < 2 || editedText.length > 64) {
      alert("Текст задачи должен содержать от 2 до 64 символов");
      return;
    }

    try {
      await updateTaskText(task.id, editedText);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении текста задачи:", error);
    }
  };

  const handleCancel = () => {
    setEditedText(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };
  return (
    <div className={styles.taskItem}>
      <label className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={handleToggleTask}
        />
        <span className={styles.checkmark}></span>
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className={styles.editInput}
          />
        ) : (
          <span
            className={`${styles.taskText} ${
              task.isDone ? styles.completed : ""
            }`}
          >
            {task.title}
          </span>
        )}
      </label>
      <div className={styles.taskActions}>
        {isEditing ? (
          <>
            <button className={styles.saveButton} onClick={handleSave}>
              Сохранить
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Отмена
            </button>
          </>
        ) : (
          <button className={styles.editButton} onClick={handleEdit}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
        )}
        <button className={styles.deleteButton} onClick={handleDelete}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
