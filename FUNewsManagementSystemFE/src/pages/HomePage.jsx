import { Layout, Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          color: "#fff",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          FUNews Management System
        </Title>
        <Button onClick={() => navigate("/")}>Logout</Button>
      </Header>

      <Content style={{ padding: 50, textAlign: "center" }}>
        <Title level={2}>Welcome, Admin 👋</Title>
        <Space size="large">
          <Button type="primary" onClick={() => navigate("/accounts")}>
            Manage Accounts
          </Button>
          <Button type="default" onClick={() => navigate("/news")}>
            Manage News
          </Button>
          <Button type="dashed" onClick={() => navigate("/tags")}>
            Manage Tags
          </Button>
          <Button type="dashed" onClick={() => navigate("/categories")}>
            Manage Categories
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default HomePage;
