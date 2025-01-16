import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootState, useAppDispatch } from "./store/store";
import { useSelector } from "react-redux";
import ProfilePage from "./components/Content/ProfilePage";
import Sidebar from "./components/Layout/SidebarLayout";
import RegisterForm from "./components/Auth/RegisterForm";
import AuthForm from "./components/Auth/AuthForm";
import UsersPage from "./components/Content/UsersPage";
import { getProfile } from "./store/authActions";
import { Spin } from "antd";
import TodoPage from "./components/Content/TodoPage";
import AuthLayout from "./components/Layout/AuthLayout";
import { configureInterceptors } from "./api/authAPI/interceptors";
import UserEditPage from "./components/Content/UserEditPage";

const App = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.profileInfo.profile
  );
  const isLoadingProfile = useSelector(
    (state: RootState) => state.auth.profileInfo.isLoading
  );
  useEffect(() => {
    configureInterceptors();
    dispatch(getProfile());
  }, [dispatch]);

  if (isLoadingProfile === true) {
    return <Spin spinning fullscreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/" element={<Sidebar />}>
            <Route index element={<TodoPage />} />
            <Route path="todo" element={<TodoPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserEditPage/>} />
            <Route path="*" element={<TodoPage />} />
          </Route>
        ) : (
          <Route path="/" element={<AuthLayout/>}>
            <Route
              index
              element={<AuthForm isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="signin"
              element={<AuthForm isAuthenticated={isAuthenticated} />}
            />
            <Route path="signup" element={<RegisterForm />} />
            <Route
              path="*"
              element={<AuthForm isAuthenticated={isAuthenticated} />}
            />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
