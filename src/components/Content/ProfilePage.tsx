import { useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { Card, Button, Typography, List } from "antd";
import { User, Mail, Phone, LogOut } from "lucide-react";
import { logoutUser } from "../../store/authActions";

const { Title, Paragraph } = Typography;
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e6f7ff 0%, #f0f2f5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "12px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center" as const,
    padding: "24px",
    borderRadius: "12px",
    backgroundColor: "#c1c8c9",
    color: "white",
    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  slogan: {
    fontSize: "14px",
  },
  content: {
    padding: "24px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  icon: {
    marginRight: "8px",
    color: "#1890ff",
  },
  label: {
    fontWeight: "bold",
    marginRight: "8px",
  },
  value: {
    color: "#1890ff",
  },
  logoutButton: {
    width: "100%",
    marginTop: "24px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
  },
};
const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useSelector(
    (state: RootState) => state.auth.profileInfo.profile
  );

  

  const profileData = [
    {
      icon: <User style={styles.icon} />,
      label: "Имя пользователя",
      value: profile?.username,
    },
    {
      icon: <Mail style={styles.icon} />,
      label: "Почтовый адрес",
      value: profile?.email,
    },
    {
      icon: <Phone style={styles.icon} />,
      label: "Телефон",
      value: profile?.phoneNumber || "не указан",
    },
  ];

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.header}>
          <Title level={2} style={styles.title}>
            Личный кабинет
          </Title>
          <Paragraph style={styles.slogan}>
            Добро пожаловать в ваш персональный уголок!
          </Paragraph>
        </div>
        <div style={styles.content}>
          <List
            itemLayout="horizontal"
            dataSource={profileData}
            renderItem={(item) => (
              <List.Item style={styles.listItem}>
                {item.icon}
                <span style={styles.label}>{item.label}:</span>
                <span style={styles.value}>{item.value}</span>
              </List.Item>
            )}
          />
          <Button
            type="primary"
            icon={<LogOut size={16} />}
            style={styles.logoutButton}
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
