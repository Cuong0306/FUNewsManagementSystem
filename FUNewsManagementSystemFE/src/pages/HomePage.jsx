import { Layout, Typography, Button, Space, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined, UserOutlined, FileTextOutlined, TagsOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Manage Accounts", path: "/accounts", icon: <UserOutlined />, type: "primary" },
    { title: "Manage News", path: "/news", icon: <FileTextOutlined />, type: "default" },
    { title: "Manage Tags", path: "/tags", icon: <TagsOutlined />, type: "dashed" },
    { title: "Manage Categories", path: "/categories", icon: <AppstoreOutlined />, type: "dashed" },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1890ff 100%)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <Header
        style={{
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Title level={3} style={{ color: "#fff", margin: 0, fontWeight: 600 }}>
          FUNews Management System
        </Title>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          style={{
            color: "#fff",
            fontWeight: 500,
          }}
          onClick={() => navigate("/")}
        >
          Logout
        </Button>
      </Header>

      {/* CONTENT */}
      <Content
        style={{
          flex: 1,
          padding: "80px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Card
          bordered={false}
          style={{
            maxWidth: 600,
            width: "100%",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
            padding: "40px 20px",
          }}
        >
          <Title
            level={2}
            style={{
              color: "#fff",
              marginBottom: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Welcome, Admin 👋
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)" }}>
            Choose a section to manage your content
          </Text>

          <div style={{ marginTop: 40 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  type={item.type}
                  size="large"
                  icon={item.icon}
                  block
                  style={{
                    height: 50,
                    borderRadius: 10,
                    fontWeight: 600,
                    background:
                      item.type === "primary"
                        ? "#1890ff"
                        : "rgba(255,255,255,0.15)",
                    color: item.type === "primary" ? "#fff" : "#e0e0e0",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      item.type === "primary" ? "#40a9ff" : "rgba(255,255,255,0.25)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      item.type === "primary"
                        ? "#1890ff"
                        : "rgba(255,255,255,0.15)")
                  }
                  onClick={() => navigate(item.path)}
                >
                  {item.title}
                </Button>
              ))}
            </Space>
          </div>
        </Card>
      </Content>

      {/* FOOTER */}
      <Footer
        style={{
          textAlign: "center",
          background: "transparent",
          color: "rgba(255,255,255,0.6)",
          padding: "16px 0 30px",
          fontSize: 13,
        }}
      >
        © 2025 FUNews Management System
      </Footer>
    </Layout>
  );
};

export default HomePage;
