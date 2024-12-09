import { useState } from "react";
import { Todo } from "../types/todo";
import { Checkbox, Input, Button, Typography, Space, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface TodoItemProps {
  task: Todo;
  toggleTask: (id: number) => void;
  updateTaskText: (id: number, newText: string) => void;
  deleteTask: (id: number) => void;
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
      message.success("Статус задачи обновлён!");
    } catch (error) {
      message.error("Ошибка при переключении задачи.");
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedText.trim().length < 2 || editedText.length > 64) {
      message.warning("Текст задачи должен содержать от 2 до 64 символов.");
      return;
    }

    try {
      await updateTaskText(task.id, editedText);
      setIsEditing(false);
      message.success("Задача успешно обновлена!");
    } catch (error) {
      message.error("Ошибка при сохранении текста задачи.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditedText(task.title);
    setIsEditing(false);
    message.info("Редактирование отменено.");
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      message.success("Задача успешно удалена!");
    } catch (error) {
      message.error("Ошибка при удалении задачи.");
      console.error(error);
    }
  };

  return (
    <Space
      direction="horizontal"
      size="middle"
      align="center"
      style={{
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: "#fff",
        padding: "12px 16px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        display: "flex",
        width: "100%",
      }}
    >
      <Checkbox checked={task.isDone} onChange={handleToggleTask} />
      <div style={{ flex: "1" }}>
        {isEditing ? (
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <Text
            delete={task.isDone}
            style={{
              fontSize: "0.95rem",
              color: task.isDone ? "#999" : "#333",
            }}
          >
            {task.title}
          </Text>
        )}
      </div>
      <Space size="small">
        {isEditing ? (
          <>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ backgroundColor: "#4285f4" }}
            />
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{
                backgroundColor: "#fbbc05",
                color: "white",
                borderColor: "#fbbc05",
              }}
            />
          </>
        ) : (
          <>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={{ backgroundColor: "#4285f4" }}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              style={{
                backgroundColor: "#ea4335",
                borderColor: "#ea4335",
                color: "white",
              }}
            ></Button>
          </>
        )}
      </Space>
    </Space>
  );
};

export default TodoItem;
