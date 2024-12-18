import { Layout, Menu } from "antd";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

const sidebarStyles: React.CSSProperties = {
  backgroundColor: "rgba(242, 242, 242, 1)",
  marginTop: "20px",
  overflow: "hidden",
  borderRadius: "10px",
};

const layoutStyles: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "white",
};

const menuStyles: React.CSSProperties = {
  backgroundColor: "rgba(242, 242, 242, 1)",
};

const contentStyles: React.CSSProperties = {
  padding: 24,
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  color: "black",
};

const iconStyle: React.CSSProperties = {
  color: "black",
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: <span style={labelStyle}>Список задач</span>,
      key: "/",
      icon: <UnorderedListOutlined style={iconStyle} />,
      onClick: () => navigate("/"),
    },
    {
      label: <span style={labelStyle}>Личный кабинет</span>,
      key: "/profile",
      icon: <UserOutlined style={iconStyle} />,
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <Layout style={layoutStyles}>
      <Sider style={sidebarStyles}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={menuStyles}
        />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
