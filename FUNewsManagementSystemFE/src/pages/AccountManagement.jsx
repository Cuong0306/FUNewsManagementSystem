import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Spin,
  Select,
  message,
  Popconfirm,
  Descriptions,
  Typography,
  Card,
} from "antd";
import { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import AccountService from "../services/AccountService";

const { Option } = Select;
const { Title, Text } = Typography;

const AccountManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await AccountService.getAllAccounts();
      if (response.data && response.data.statusCode === 200) {
        const mappedAccounts = response.data.data.map((acc) => ({
          key: acc.accountId,
          name: acc.accountName,
          email: acc.accountEmail,
          role: acc.accountRole,
        }));
        setAccounts(mappedAccounts);
      }
    } catch (error) {
      message.error("Failed to load accounts!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (id) => {
    setDetailLoading(true);
    try {
      const response = await AccountService.getAccountById(id);
      if (response.data && response.data.statusCode === 200) {
        setSelectedAccount(response.data.data);
        setIsDetailModalOpen(true);
      }
    } catch {
      message.error("Failed to load account details!");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setEditLoading(true);
    try {
      const response = await AccountService.getAccountById(id);
      if (response.data && response.data.statusCode === 200) {
        const fullAccount = response.data.data;
        setEditingAccount(fullAccount);
        form.setFieldsValue({
          name: fullAccount.accountName,
          email: fullAccount.accountEmail,
          role: fullAccount.accountRole,
        });
      }
    } catch {
      message.error("Failed to load account for editing!");
      return;
    } finally {
      setEditLoading(false);
    }
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    if (isEditing && editingAccount) {
      try {
        const updateData = {
          accountId: editingAccount.accountId,
          accountName: values.name,
          accountEmail: values.email,
          accountRole: values.role,
          accountPassword: values.password || null,
          newsArticleCreatedBies: editingAccount.newsArticleCreatedBies || [],
          newsArticleUpdatedBies: editingAccount.newsArticleUpdatedBies || [],
        };
        const response = await AccountService.updateAccount(
          editingAccount.accountId,
          updateData
        );
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
          message.success("Account updated successfully!");
          await fetchAccounts();
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Failed to update account!");
        return;
      }
      setEditingAccount(null);
    } else {
      try {
        const createData = {
          accountName: values.name,
          accountEmail: values.email,
          accountRole: values.role,
          accountPassword: values.password,
        };
        const response = await AccountService.createAccount(createData);
        if (response.data && response.data.statusCode === 201) {
          message.success("Account created successfully!");
          await fetchAccounts();
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Failed to create account!");
        return;
      }
    }
    setIsModalOpen(false);
    form.resetFields();
    setIsEditing(false);
  };

  const handleDelete = async (key) => {
    try {
      const response = await AccountService.deleteAccount(key);
      if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
        message.success("Account deleted successfully!");
        await fetchAccounts();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete account!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingAccount(null);
    setIsEditing(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setSelectedAccount(null);
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchText.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <span
          style={{
            backgroundColor: role === "Admin" ? "#1890ff" : "#13c2c2",
            color: "#fff",
            padding: "2px 10px",
            borderRadius: 8,
            fontSize: 12,
          }}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record.key)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key)}
            loading={editLoading}
          />
          <Popconfirm
            title="Delete Account"
            description="Are you sure to delete this account?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 40,
        background: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1890ff 100%)",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            👤 Account Management
          </Title>
          <Text type="secondary">
            Manage admin and staff accounts within the system
          </Text>
        </div>

        <Space style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Account
          </Button>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name or email"
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredAccounts}
            pagination={{ pageSize: 6 }}
            bordered
            style={{ borderRadius: 10, overflow: "hidden" }}
          />
        </Spin>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={isEditing ? "✏️ Edit Account" : "➕ Add New Account"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              <Option value="Admin">Admin</Option>
              <Option value="Staff">Staff</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !isEditing, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={
                isEditing
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {isEditing ? "Update Account" : "Save Account"}
          </Button>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Account Details"
        open={isDetailModalOpen}
        onCancel={handleDetailCancel}
        footer={null}
        width={600}
        centered
      >
        <Spin spinning={detailLoading}>
          {selectedAccount && (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Account ID">
                {selectedAccount.accountId}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedAccount.accountName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedAccount.accountEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {selectedAccount.accountRole}
              </Descriptions.Item>
              <Descriptions.Item label="Password">********</Descriptions.Item>
              <Descriptions.Item label="Articles Created">
                {selectedAccount.newsArticleCreatedBies.length}
              </Descriptions.Item>
              <Descriptions.Item label="Articles Updated">
                {selectedAccount.newsArticleUpdatedBies.length}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default AccountManagement;
