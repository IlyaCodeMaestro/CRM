import { useState } from "react";
import { Todo } from "../types/todo";
import {
  Checkbox,
  Input,
  Button,
  Typography,
  Space,
  Layout,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Content } = Layout;

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
    <Layout
      style={{
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <Content style={{ padding: "12px 16px" }}>
        <Row align="middle" gutter={12}>
          <Col>
            <Checkbox checked={task.isDone} onChange={handleToggleTask} />
          </Col>
          <Col flex="auto">
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
          </Col>
          <Col>
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
                    style={{ backgroundColor: "#fbbc05" ,color:"fbbc05", borderColor:'fbbc05'}}
                    
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
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default TodoItem;
