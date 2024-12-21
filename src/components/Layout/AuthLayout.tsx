import { Typography, Layout, Row, Col, Space } from 'antd';
import skeleton from "../../assets/images/skeleton.svg";

const { Content } = Layout;
const { Text, Title } = Typography;

const pageStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
};

const imageColumnStyle: React.CSSProperties = {
  backgroundImage: `url(${skeleton})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
};

const contentColumnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const formContainerStyle: React.CSSProperties = {
  width: '400px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  footer: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, footer }) => {
  return (
    <Layout style={pageStyle}>
      <Row>
        <Col span={12} style={imageColumnStyle} />
        <Col span={12} style={contentColumnStyle}>
          <Content>
            <Space direction="vertical" style={formContainerStyle}>
              <Title level={3}>{title}</Title>
              {children}
              <Text>{footer}</Text>
            </Space>
          </Content>
        </Col>
      </Row>
    </Layout>
  );
};

export default AuthLayout;

