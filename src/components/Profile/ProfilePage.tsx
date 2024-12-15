import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../api/authApi";
import { Profile } from "../../types/auth";

const UserProfile: React.FC<{ token: string }> = ({ token }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const fetchedProfile = await fetchUserProfile(token);
        setProfile(fetchedProfile);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Ошибка при загрузке профиля");
        } else {
          setError("Неизвестная ошибка");
        }
      }
    };

    getProfile();
  }, [token]);

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!profile) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Имя пользователя: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <p>Номер телефона: {profile.phoneNumber}</p>
    </div>
  );
};

export default UserProfile;
