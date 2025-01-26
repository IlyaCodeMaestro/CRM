import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { Card, Button, Typography, List } from "antd";
import { User, Mail, Phone, LogOut } from "lucide-react";
import { logoutUser } from "../../../store/authActions";
import styles from "./ProfilePage.module.scss"
const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useSelector(
    (state: RootState) => state.auth.profileInfo.profile
  );

  const profileData = [
    {
      icon: <User className={styles.icon} />,
      label: "Имя пользователя",
      value: profile?.username,
    },
    {
      icon: <Mail className={styles.icon} />,
      label: "Почтовый адрес",
      value: profile?.email,
    },
    {
      icon: <Phone className={styles.icon} />,
      label: "Телефон",
      value: profile?.phoneNumber || "не указан",
    },
  ];

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Личный кабинет
          </Title>
          <Paragraph className={styles.slogan}>
            Добро пожаловать в ваш персональный уголок!
          </Paragraph>
        </div>
        <div className={styles.content}>
          <List
            itemLayout="horizontal"
            dataSource={profileData}
            renderItem={(item) => (
              <List.Item className={styles.listItem}>
                {item.icon}
                <span className={styles.label}>{item.label}:</span>
                <span className={styles.value}>{item.value}</span>
              </List.Item>
            )}
          />
          <Button
            type="primary"
            icon={<LogOut size={16} />}
            className={styles.logoutButton}
            onClick={() => {
              dispatch(logoutUser());
              navigate("/");
            }}
          >
            Выйти из системы
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
