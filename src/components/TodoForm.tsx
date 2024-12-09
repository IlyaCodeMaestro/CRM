import  { useState } from "react";
import { Button, Form, Input } from "antd";
//gf
interface TodoFormProps {
  addTask: (text: string) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTask }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { task: string }) => {
    setIsSubmitting(true);
    try {
      await addTask(values.task);
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="task"
        rules={[
          { required: true, message: "Пожалуйста, введите задачу" },
          {
            min: 2,
            max: 64,
            message: "Задача должна содержать от 2 до 64 символов",
          },
        ]}
      >
        <Input placeholder="Введите новую задачу..." disabled={isSubmitting} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {isSubmitting ? "Добавление..." : "Добавить"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TodoForm;