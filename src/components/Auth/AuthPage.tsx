import { useEffect, useState } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { Form, Input, Button, Typography, message, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerUserThunk,
  authenticateUserThunk,
} from "../../slices/authSlice";
import { RootState } from "../../store/store";
import { ThunkDispatch } from "@reduxjs/toolkit";

const { Title, Text } = Typography;

const pageStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
};

const imageStyle: React.CSSProperties = {
  flex: 1,
  backgroundImage: "url(../../../../assets/images/skeleton.svg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const formContainerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "100%",
};

const getFormStyle = (isLogin: boolean): React.CSSProperties => ({
  width: isLogin ? 450 : 500, 
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 8,
  backgroundColor: "#fff",
  boxSizing: "border-box",
});

interface AuthPageProps {
  isLogin?: boolean;
}

type LoginFormValues = {
  login: string;
  password: string;
};

type RegisterFormValues = {
  username: string;
  login: string;
  password: string;
  confirmPassword: string;
  email: string;
  phoneNumber: string;
};

const AuthPage: React.FC<AuthPageProps> = ({ isLogin = false }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) =>
    Boolean(state.auth.token)
  );
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      if (isLogin) {
        const { login, password } = values as LoginFormValues;
        await dispatch(authenticateUserThunk({ login, password })).unwrap();
        message.success(
          "Вход выполнен! Перенаправление на главную страницу..."
        );
        navigate("/");
      } else {
        const {
          username,
          login,
          password,
          confirmPassword,
          email,
          phoneNumber,
        } = values as RegisterFormValues;
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
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      message.error(errorMessage || "Произошла ошибка");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={imageStyle}></div>
      <div style={formContainerStyle}>
      <div style={getFormStyle(isLogin)}>
          <Title level={3}>{isLogin ? "Вход" : "Регистрация"}</Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {!isLogin && (
              <>
                <Form.Item
                  label="Имя пользователя"
                  name="username"
                  rules={[
                    { required: true, message: "Введите имя пользователя!" },
                    { max: 60 },
                  ]}
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
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Телефон (необязательно)" name="phoneNumber">
                  <Input />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Логин"
              name="login"
              rules={[
                { required: true, message: "Введите логин!" },
                { min: 2, max: 60 },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Введите пароль!" },
                { min: 6, max: 60 },
              ]}
            >
              <Input.Password />
            </Form.Item>
            {isLogin && (
              <Form.Item name={rememberMe} valuePropName="checked">
                <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>
                  Запомнить меня
                </Checkbox>
              </Form.Item>
            )}
            {!isLogin && (
              <Form.Item
                label="Повторите пароль"
                name="confirmPassword"
                rules={[{ required: true, message: "Повторите пароль!" }]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "rgba(127, 38, 91, 1)" }}
              block
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>
          </Form>
          <Text>
            {isLogin ? (
              <>
                Не зарегистрированы?{" "}
                <a
                  onClick={() => navigate("/register")}
                  style={{ color: "rgba(127, 38, 91, 1)" }}
                >
                  Создать аккаунт
                </a>
              </>
            ) : (
              <>
                Уже есть аккаунт?{" "}
                <a
                  onClick={() => navigate("/login")}
                  style={{ color: "rgba(127, 38, 91, 1)" }}
                >
                  Войти
                </a>
              </>
            )}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
