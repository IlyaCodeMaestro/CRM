import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, Spin, notification, Card } from "antd";
import { Profile } from "../../types/auth";
import { fetchUserProfile } from "../../api/authApi";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
  spinner: {
    display: "block",
    margin: "50px auto",
  },
  card: {
    maxWidth: "600px",
    margin: "50px auto",
  },
  logoutButton: {
    backgroundColor: "rgba(127, 38, 91, 1)",
    marginTop: "20px",
  },
};
const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const fetchedProfile = await fetchUserProfile();
        setProfile(fetchedProfile);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Неизвестная ошибка";
        console.error("Ошибка при загрузке профиля:", errorMessage);
        setError(errorMessage);
        notification.error({
          message: "Ошибка загрузки профиля",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      notification.success({
        message: "Успешный выход",
        description: "Вы успешно вышли из системы.",
      });
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при выходе";
      console.error("Ошибка при выходе из системы:", errorMessage);
      notification.error({
        message: "Ошибка выхода",
        description: errorMessage,
      });
    }
  };

  return (
    <>
      {loading && <Spin size="large" style={styles.spinner} />}
      {!loading && error && (
        <Card style={styles.card}>
          <Text type="danger">Ошибка: {error}</Text>
        </Card>
      )}
      {!loading && !error && profile && (
        <Card style={styles.card}>
          <Title level={2}>Профиль пользователя</Title>
          <Text strong>Имя пользователя:</Text> <Text>{profile.username}</Text>
          <br />
          <Text strong>Email:</Text> <Text>{profile.email}</Text>
          <br />
          <Text strong>Номер телефона:</Text> <Text>{profile.phoneNumber || "Не указан"}</Text>
          <br />
          <Text strong>Дата регистрации:</Text>{" "}
          <Text>{new Date(profile.date).toLocaleDateString()}</Text>
          <br />
          <Button 
            type="primary" 
            onClick={handleLogout} 
            style={styles.logoutButton}
          >
            Выйти
          </Button>
        </Card>
      )}
    </>
  );
};


export default ProfilePage;
