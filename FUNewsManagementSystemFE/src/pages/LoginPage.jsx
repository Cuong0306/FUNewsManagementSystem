import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthenService from "../services/AuthenService"; // Adjust path to your service file

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AuthenService.login(values);
      if (response.data && response.data.statusCode === 200) {
        const { token, expiresIn } = response.data.data;
        message.success("Login successful!");
        
        // Store token for API authentication
        localStorage.setItem("accessToken", token);
        
        // Optionally store expiresIn (for token refresh logic later)
        localStorage.setItem("tokenExpiresIn", expiresIn);
        
        // Decode JWT payload to extract user info (no secret needed for payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = {
          name: payload.unique_name || "Admin",
          email: payload.email,
          role: payload.role,
        };
        
        // Store user info
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
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          FUNews Login
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input placeholder="admin@FUNewsManagementSystem.org" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="@@abc123@@" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;