import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserThunk } from "../../slices/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import AuthLayout from "../Layout/AuthLayout";
import { Link } from "react-router-dom";
interface RegisterFormValues {
  username: string;
  login: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string;
}
const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { username, login, password, confirmPassword, email, phoneNumber } =
        values;
      if (password !== confirmPassword) {
        message.error("Пароли не совпадают!");
        return;
      }
      await dispatch(
        registerUserThunk({ username, login, password, email, phoneNumber })
      ).unwrap();
      message.success(
        "Регистрация успешна! Перенаправление на страницу входа..."
      );
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      message.error(errorMessage || "Произошла ошибка");
    }
  };
  const formContainerStyle: React.CSSProperties = {
    width: "350px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  };

  const formItemStyle: React.CSSProperties = {
    marginBottom: "12px",
  };

  const submitButtonStyle: React.CSSProperties = {
    marginTop: "10px",
    height: "40px",
  };
  return (
    <AuthLayout
      title="Регистрация"
      footer={
        <>
          Уже есть аккаунт? <Link to="/login">Войти в систему</Link>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={formContainerStyle}
      >
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            { required: true, message: "Введите имя пользователя!" },
            { max: 60 },
          ]}
          style={formItemStyle}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Почтовый адрес"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Введите корректный email!",
            },
          ]}
          style={formItemStyle}
        >
          <Input placeholder="Например: user@example.com" />
        </Form.Item>
        <Form.Item
          label="Телефон (необязательно)"
          name="phoneNumber"
          rules={[
            {
              pattern: /^\+[1-9]\d{1,14}$/,
              message:
                "Пожалуйста, введите номер в международном формате, например: +79123456789",
            },
          ]}
          style={formItemStyle}
        >
          <Input placeholder="+79123456789" />
        </Form.Item>
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: "Введите логин!" },
            { min: 2, max: 60 },
            {
              pattern: /^[a-zA-Zа-яА-Я]+$/,
              message:
                "Логин должен содержать только буквы (латинские или кириллические)",
            },
          ]}
          style={formItemStyle}
        >
          <Input placeholder="Например: user или пользователь" />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль!" },
            { min: 6, max: 60 },
          ]}
          style={formItemStyle}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="confirmPassword"
          rules={[{ required: true, message: "Повторите пароль!" }]}
          style={formItemStyle}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item style={submitButtonStyle}>
          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default RegisterForm;
