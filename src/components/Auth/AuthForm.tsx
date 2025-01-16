import { Form, Input, Button, message, Checkbox, Space, Typography } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthData } from "../../types/auth";
import { loginUser } from "../../store/authActions";
import axios from "axios";
import { useAppDispatch } from "../../store/store";
import { Link } from "react-router-dom";

interface AuthFormValues {
  isAuthenticated: boolean;
}

const AuthForm: React.FC<AuthFormValues> = ({ isAuthenticated }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values: AuthData) => {
    try {
      await dispatch(loginUser(values));
      navigate("/");
      message.success("Вход выполнен! Перенаправление на главную страницу...");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Invalid credentials\n") {
          form.setFields([
            { name: "password", errors: ["Неверные логин или пароль"] },
          ]);
        }
      }
      throw error;
    }
  };

  return isAuthenticated ? (
    <Navigate to="/todo" replace />
  ) : (
    <>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Typography.Title level={1}>Форма входа</Typography.Title>
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: "Введите логин!" },
            {
              min: 2,
              max: 60,
              message: "Длина должна быть от 2 до 60 символов",
            },
            { pattern: /^[a-zA-Z]+$/, message: "Только латинские буквы" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите пароль!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <Space>
        <Typography.Text>Ещё не зарегистрированы?</Typography.Text>
        <Link to={`/signup`}>Создать аккаунт</Link>
      </Space>
    </>
  );
};

export default AuthForm;
