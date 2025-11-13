import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthenService from "../services/AuthenService";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 150);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AuthenService.login(values);
      if (response.data && response.data.statusCode === 200) {
        const { token, expiresIn } = response.data.data;
        message.success("Login successful!");

        localStorage.setItem("accessToken", token);
        localStorage.setItem("tokenExpiresIn", expiresIn);

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userInfo = {
          name: payload.unique_name || "Admin",
          email: payload.email,
          role: payload.role,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));

        navigate("/home");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a192f 0%, #112240 40%, #1890ff 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "10%",
          left: "15%",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(24,144,255,0.15)",
          bottom: "5%",
          right: "10%",
          filter: "blur(120px)",
        }}
      />

      <Card
        style={{
          width: 420,
          borderRadius: 24,
          padding: "45px 40px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          color: "#fff",
          transform: fadeIn ? "translateY(0)" : "translateY(30px)",
          opacity: fadeIn ? 1 : 0,
          transition: "all 0.6s ease",
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 35 }}>
          <Title
            level={2}
            style={{
              color: "#fff",
              marginBottom: 8,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            FUNews Portal
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.65)" }}>
            Sign in to continue to your dashboard
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span style={{ color: "#fff" }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              size="large"
              placeholder="admin@funews.org"
              style={{
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              style={{
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 35 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                borderRadius: 10,
                height: 45,
                fontWeight: 600,
                background: "#1890ff",
                border: "none",
                boxShadow: "0 4px 12px rgba(24,144,255,0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#40a9ff")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#1890ff")
              }
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text style={{ color: "rgba(255,255,255,0.45)" }}>
            © 2025 FUNews Management System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
