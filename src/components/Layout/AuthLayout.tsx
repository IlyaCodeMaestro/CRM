import { Typography,  Flex, Image } from 'antd';
import authImg from "../../assets/images/skeleton.svg";
import { Outlet } from 'react-router-dom';

const container: React.CSSProperties = {
  height: '100vh',
};

const leftColumnStyle: React.CSSProperties = {
  width: '50%',
  backgroundColor: '#FFE6C9',
  color: '#73114B',
};

const rightColumnStyle: React.CSSProperties = {
  width: '50%',
};

 const AuthLayout = () => {
  return (
    <Flex style={container}>
      <Flex style={leftColumnStyle} vertical align="center" justify="center">
        <Image src={authImg} preview={false} width={'40%'} />
        <Typography.Title level={2}>Turn your ideas into reality.</Typography.Title>
        <Typography>
          Start for free and get attractive offers from the community
        </Typography>
      </Flex>
      <Flex style={rightColumnStyle} vertical align="center" justify="center">
        <Outlet />
      </Flex>
    </Flex>
  );
};
export default AuthLayout