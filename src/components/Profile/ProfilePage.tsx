import { useEffect, useState } from "react";
import { Profile } from "../../types/auth";
const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const fetchedProfile = await fetch("/api/profile");
        const profileData = await fetchedProfile.json();
        setProfile(profileData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Ошибка при загрузке профиля");
        } else {
          setError("Неизвестная ошибка");
        }
      }
    };

    getProfile();
  }, []);

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

export default ProfilePage;
