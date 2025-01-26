import { useState } from "react";
import { Todo } from "../../types/todo";
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
    } catch (error) {
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
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
  };

  const containerStyle: React.CSSProperties = {
    borderRadius: "8px",
    marginBottom: "8px",
    backgroundColor: "#fff",
    padding: "12px 16px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    color: task.isDone ? "#999" : "#333",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#4285f4",
  };

  const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: "#fbbc05",
    color: "white",
    borderColor: "#fbbc05",
  };

  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: "#ea4335",
    borderColor: "#ea4335",
    color: "white",
  };

  return (
    <Space direction="horizontal" size="middle" align="center" style={containerStyle}>
      <Space size="middle" style={{ flex: 1 }}>
        <Checkbox checked={task.isDone} onChange={handleToggleTask} />
        <Space style={{ flex: 1 }}>
          {isEditing ? (
            <Input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            <Text delete={task.isDone} style={textStyle}>
              {task.title}
            </Text>
          )}
        </Space>
      </Space>
      <Space size="small">
        {isEditing ? (
          <>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={buttonStyle}
            />
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={cancelButtonStyle}
            />
          </>
        ) : (
          <>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              style={buttonStyle}
            />
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              style={deleteButtonStyle}
            />
          </>
        )}
      </Space>
    </Space>
  );
};

export default TodoItem;
