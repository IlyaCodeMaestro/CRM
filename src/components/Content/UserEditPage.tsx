import { useEffect, useState } from "react";
import { User, UserRequest } from "../../types/users";
import { Button, Card, Form, Input, message,  Spin, Typography, Avatar } from "antd";
import { useParams } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../api/adminAPI/adminApi";
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const styles = {
  container: {
    padding: '24px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(60deg,rgb(52, 123, 204) 0%,rgb(2, 24, 48) 100%)',
    padding: '20px',
    textAlign: 'center' as const,
  },
  title: {
    color: 'white',
    margin: '10px 0',
  },
  avatar: {
    backgroundColor: '#1890ff',
    margin: '0 auto 10px',
  },
  form: {
    padding: '20px',
  },
  input: {
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    marginTop: '10px',
  },
  infoContainer: {
    padding: '20px',
  },
  infoItem: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: '10px',
    color: '#1890ff',
    fontSize: '18px',
  },
  infoText: {
    fontSize: '16px',
  },
};

const UserEditPage = () => {
  const [data, setData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { id } = useParams<string>();

  const toggleFormEditing = () => {
    setEditing((prev) => !prev);
    form.resetFields();
  };

  const handleProfileUpdate = async (values: UserRequest) => {
    const requestData = {
      username:
        values.username !== data?.username ? values.username : undefined,
      email: values.email !== data?.email ? values.email : undefined,
      phoneNumber:
        values.phoneNumber !== data?.phoneNumber.slice(2)
          ? "+7" + values.phoneNumber
          : undefined,
    };
    try {
      await updateUserProfile(id!, requestData);
      message.success('Профиль успешно обновлен');
      toggleFormEditing();
    } catch  {
      message.error("Ошибка при обновлении профиля");
    }
  };

  useEffect(() => {
    const getUserData = async (id: string) => {
      try {
        setLoading(true);
        const response = await fetchUserProfile(id);
        setData(response);
        setLoading(false);
      } catch {
        message.error("Не удалось загрузить данные пользователя");
      }
    };
    getUserData(id!);
  }, [id, editing]);

  if (loading) {
    return <Spin spinning fullscreen />;
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <Avatar size={64} icon={<UserOutlined />} style={styles.avatar} />
          <Typography.Title level={3} style={styles.title}>
            {`Пользователь #${data?.id}`}
          </Typography.Title>
        </div>
        {editing ? (
          <Form
            name="userEdit"
            layout="vertical"
            onFinish={handleProfileUpdate}
            style={styles.form}
          >
            <Form.Item
              name="username"
              initialValue={data?.username}
              rules={[
                { required: true, message: "Пожалуйста, введите имя пользователя" },
                { min: 1, max: 60, message: "Длина должна быть от 1 до 60 символов" },
                { pattern: /^[a-zA-Zа-яА-Я\s]+$/, message: "Только буквы русского и латинского алфавита" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
            </Form.Item>
            <Form.Item
              name="email"
              initialValue={data?.email}
              rules={[
                { required: true, message: "Пожалуйста, введите email" },
                { type: "email", message: "Неправильный формат email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              initialValue={data?.phoneNumber.replace(/^\+7/, "")}
              rules={[
                { pattern: /^\d{10}$/, message: "Неправильный формат телефона" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                addonBefore="+7"
                maxLength={10}
                placeholder="Номер телефона"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={styles.button}>
              Сохранить изменения
            </Button>
            <Button onClick={toggleFormEditing} style={styles.button}>
              Отмена
            </Button>
          </Form>
        ) : (
          <div style={styles.infoContainer}>
            <div style={styles.infoItem}>
              <UserOutlined style={styles.infoIcon} />
              <Typography.Text style={styles.infoText}>{data?.username}</Typography.Text>
            </div>
            <div style={styles.infoItem}>
              <MailOutlined style={styles.infoIcon} />
              <Typography.Text style={styles.infoText}>{data?.email}</Typography.Text>
            </div>
            <div style={styles.infoItem}>
              <PhoneOutlined style={styles.infoIcon} />
              <Typography.Text style={styles.infoText}>
                {data?.phoneNumber || 'Не указан'}
              </Typography.Text>
            </div>
            <Button type="primary" onClick={toggleFormEditing} icon={<EditOutlined />} style={styles.button}>
              Редактировать
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserEditPage;

