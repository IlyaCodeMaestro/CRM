import { Form, Input, Button, message, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticateUserThunk } from "../../slices/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import AuthLayout from "../Layout/AuthLayout";
import { Link } from "react-router-dom";
interface AuthFormValues {
  login: string;
  password: string;
  rememberMe?: boolean;
}

const AuthForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();

  const handleSubmit = async (values: AuthFormValues) => {
    try {
      const { login, password } = values;
      await dispatch(authenticateUserThunk({ login, password })).unwrap();
      message.success("Вход выполнен! Перенаправление на главную страницу...");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      message.error(errorMessage || "Произошла ошибка");
    }
  };

  return (
    <AuthLayout
      title="Вход"
      footer={
        <>
         Нет аккаунта?{" "}
         <Link to="/register">Создать аккаунт</Link>
        </>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: "Введите логин!" }]}
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
    </AuthLayout>
  );
};

export default AuthForm;
