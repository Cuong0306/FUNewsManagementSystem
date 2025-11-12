import { Table, Button, Modal, Form, Input, Space, Spin, Select, message, Popconfirm, Descriptions } from "antd";
import { useState, useEffect } from "react";
import AccountService from "../services/AccountService";

const { Option } = Select;

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

  // Fetch all accounts on component mount
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
      console.error("Failed to fetch accounts:", error);
      message.error("Failed to load accounts!");
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
    } catch (error) {
      console.error("Failed to fetch account details:", error);
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
          role: fullAccount.accountRole 
        });
        // Note: Password cannot be prefilled for security; user must enter new password if changing
      }
    } catch (error) {
      console.error("Failed to fetch account for edit:", error);
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
      // Update existing account via API
      try {
        const updateData = {
          accountId: editingAccount.accountId, // Include ID for backend
          accountName: values.name,
          accountEmail: values.email,
          accountRole: values.role,
          accountPassword: values.password || null, // Optional: null if blank (backend handles no change)
          newsArticleCreatedBies: editingAccount.newsArticleCreatedBies || [],
          newsArticleUpdatedBies: editingAccount.newsArticleUpdatedBies || [],
        };
        const response = await AccountService.updateAccount(editingAccount.accountId, updateData);
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
          message.success("Account updated successfully!");
          // Refetch accounts to update list
          await fetchAccounts();
        }
      } catch (error) {
        console.error("Failed to update account:", error);
        message.error(error.response?.data?.message || "Failed to update account!");
        return; // Don't close modal on error
      }
      setEditingAccount(null);
    } else {
      // Create new account via API
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
          // Refetch accounts to update list
          await fetchAccounts();
        }
      } catch (error) {
        console.error("Failed to create account:", error);
        message.error(error.response?.data?.message || "Failed to create account!");
        return; // Don't close modal on error
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
        // Refetch accounts to update list
        await fetchAccounts();
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
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
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    // Optional: Add role column
    // { title: "Role", dataIndex: "role" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleDetail(record.key)}>Detail</Button>
          <Button onClick={() => handleEdit(record.key)} loading={editLoading}>Edit</Button>
          <Popconfirm
            title="Delete Account"
            description="Are you sure to delete this account?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h2>Account Management</h2>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Account
        </Button>
      </Space>
      <Input.Search
        placeholder="Search by name or email"
        onSearch={setSearchText}
        enterButton
        style={{ width: 300, marginBottom: 20 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredAccounts} />
      </Spin>

      <Modal
        title={isEditing ? "Edit Account" : "Add New Account"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" }
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
              { required: !isEditing, message: "Please enter password" }, // Optional for edit
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isEditing ? "Update" : "Save"}
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
      >
        <Spin spinning={detailLoading}>
          {selectedAccount && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Account ID">{selectedAccount.accountId}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedAccount.accountName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedAccount.accountEmail}</Descriptions.Item>
              <Descriptions.Item label="Role">{selectedAccount.accountRole}</Descriptions.Item>
              <Descriptions.Item label="Password">********</Descriptions.Item>
              <Descriptions.Item label="Articles Created">{selectedAccount.newsArticleCreatedBies.length}</Descriptions.Item>
              <Descriptions.Item label="Articles Updated">{selectedAccount.newsArticleUpdatedBies.length}</Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default AccountManagement;