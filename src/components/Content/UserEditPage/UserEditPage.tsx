import { useEffect, useState } from "react";
import { User, UserRequest } from "../../../types/users";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Spin,
  Typography,
  Avatar,
} from "antd";
import { useParams } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../../api/adminAPI/adminApi";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import styles from "./UserEditPage.module.scss"

const UserEditPage: React.FC = () => {
  const [data, setData] = useState<User>()
  const [loading, setLoading] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [form] = Form.useForm()

  const { id } = useParams<{ id: string }>()

  const toggleFormEditing = () => {
    setEditing((prev) => !prev)
    form.resetFields()
  }

  const handleProfileUpdate = async (values: UserRequest) => {
    const requestData = {
      username: values.username !== data?.username ? values.username : undefined,
      email: values.email !== data?.email ? values.email : undefined,
      phoneNumber: values.phoneNumber !== data?.phoneNumber.slice(2) ? "+7" + values.phoneNumber : undefined,
    }
    try {
      await updateUserProfile(id!, requestData)
      message.success("Профиль успешно обновлен")
      toggleFormEditing()
    } catch  {
      message.error("Ошибка при обновлении профиля")
    }
  }

  useEffect(() => {
    const getUserData = async (id: string) => {
      try {
        setLoading(true)
        const response = await fetchUserProfile(id)
        setData(response)
        setLoading(false)
      } catch  {
        message.error("Не удалось загрузить данные пользователя")
      }
    }
    getUserData(id!)
  }, [id])

  if (loading) {
    return <Spin spinning fullscreen />
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Avatar size={64} icon={<UserOutlined />} className={styles.avatar} />
          <Typography.Title level={3} className={styles.title}>
            {`Пользователь #${data?.id}`}
          </Typography.Title>
        </div>
        {editing ? (
          <Form name="userEdit" layout="vertical" onFinish={handleProfileUpdate} className={styles.form}>
            <Form.Item
              name="username"
              initialValue={data?.username}
              rules={[
                { required: true, message: "Пожалуйста, введите имя пользователя" },
                { min: 1, max: 60, message: "Длина должна быть от 1 до 60 символов" },
                { pattern: /^[a-zA-Zа-яА-Я\s]+$/, message: "Только буквы русского и латинского алфавита" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя пользователя" className={styles.input} />
            </Form.Item>
            <Form.Item
              name="email"
              initialValue={data?.email}
              rules={[
                { required: true, message: "Пожалуйста, введите email" },
                { type: "email", message: "Неправильный формат email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" className={styles.input} />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              initialValue={data?.phoneNumber.replace(/^\+7/, "")}
              rules={[{ pattern: /^\d{10}$/, message: "Неправильный формат телефона" }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                addonBefore="+7"
                maxLength={10}
                placeholder="Номер телефона"
                className={styles.input}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className={styles.button}>
              Сохранить изменения
            </Button>
            <Button onClick={toggleFormEditing} className={styles.button}>
              Отмена
            </Button>
          </Form>
        ) : (
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <UserOutlined className={styles.infoIcon} />
              <Typography.Text className={styles.infoText}>{data?.username}</Typography.Text>
            </div>
            <div className={styles.infoItem}>
              <MailOutlined className={styles.infoIcon} />
              <Typography.Text className={styles.infoText}>{data?.email}</Typography.Text>
            </div>
            <div className={styles.infoItem}>
              <PhoneOutlined className={styles.infoIcon} />
              <Typography.Text className={styles.infoText}>{data?.phoneNumber || "Не указан"}</Typography.Text>
            </div>
            <Button type="primary" onClick={toggleFormEditing} icon={<EditOutlined />} className={styles.button}>
              Редактировать
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UserEditPage

