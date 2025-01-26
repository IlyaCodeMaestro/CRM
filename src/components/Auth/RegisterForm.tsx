import { Form, Input, Button, Alert, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserRegistration } from "../../types/auth";
import axios from "axios";
import { register } from "../../api/authAPI/authService";

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
const linkStyle: React.CSSProperties = {
  marginTop: "10px",
  textAlign: "center",
};
const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (values: UserRegistration) => {
    try {
      const phoneNumber = values.phoneNumber.startsWith("+")
        ? values.phoneNumber
        : `+${values.phoneNumber}`;
      await register({ ...values, phoneNumber });
      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "user already exists\n") {
          form.setFields([
            { name: "email", errors: ["Логин или почта уже заняты"] },
            { name: "login", errors: ["Логин или почта уже заняты"] },
          ]);
        } else if (
          error.response?.data.includes(
            "Invalid input: field 'PhoneNumber' is invalid: e164"
          )
        ) {
          form.setFields([
            {
              name: "phoneNumber",
              errors: [
                "Пожалуйста, введите номер в международном формате, например: +79123456789",
              ],
            },
          ]);
        }
      }
      throw error;
    }
  };

  return success ? (
    <>
      <Alert
        message="Успех!"
        description="Вы успешно прошли регистрацию!"
        type="success"
        showIcon
        closable
        onClose={() => setSuccess(false)}
      />
      <Link to="/signin">Перейти к входу</Link>
    </>
  ) : (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={formContainerStyle}
    >
      <Typography.Title level={2}>Форма регистрации</Typography.Title>
      <Form.Item
        label="Имя пользователя"
        name="username"
        rules={[
          { required: true, message: "Введите имя пользователя!" },
          {
            min: 1,
            max: 60,
            message: "Длина должна быть от 1 до 60 символов",
          },
          {
            pattern: /^[a-zA-Zа-яА-Я\s]+$/,
            message: "Только буквы русского и латинского алфавита",
          },
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
            message: "Введите email!",
          },
          { type: "email", message: "Неправильный формат email" },
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
          {
            min: 2,
            max: 60,
            message: "Длина должна быть от 2 до 60 символов",
          },
          {
            pattern: /^[a-zA-Z]+$/,
            message: "Логин должен содержать только латинские буквы",
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
          {
            min: 6,
            max: 60,
            message: "Длина должна быть от 6 до 60 символов",
          },
        ]}
        style={formItemStyle}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Повторите пароль"
        name="confirmPassword"
        rules={[
          { required: true, message: "Повторите пароль!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Пароли не совпадают"));
            },
          }),
        ]}
        style={formItemStyle}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item style={submitButtonStyle}>
        <Button type="primary" htmlType="submit" block>
          Зарегистрироваться
        </Button>
      </Form.Item>
      <div style={linkStyle}>
        <Space>
          <Typography.Text>Уже есть аккаунт?</Typography.Text>
          <Link to={`/signin`}>Войти</Link>
        </Space>
      </div>
    </Form>
  );
};

export default RegisterForm;
