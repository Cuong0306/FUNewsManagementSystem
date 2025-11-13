import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Spin,
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
} from "@ant-design/icons";
import TagService from "../services/TagService";

const { Title } = Typography;

const Tag = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await TagService.getAllTags();
      if (response.data && response.data.statusCode === 200) {
        const mappedTags = response.data.data.map((tag) => ({
          key: tag.tagId,
          name: tag.tagName,
          description: tag.note,
        }));
        setTags(mappedTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags!");
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (id) => {
    setDetailLoading(true);
    try {
      const response = await TagService.getTagById(id);
      if (response.data && response.data.statusCode === 200) {
        setSelectedTag(response.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch tag details:", error);
      message.error("Failed to load tag details!");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSave = async (values) => {
    if (isEditing && editingTag) {
      try {
        const updateData = {
          tagId: editingTag.key,
          tagName: values.name,
          note: values.description,
        };
        const response = await TagService.updateTag(editingTag.key, updateData);
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
          message.success("Tag updated successfully!");
          await fetchTags();
        }
      } catch (error) {
        console.error("Failed to update tag:", error);
        message.error(error.response?.data?.message || "Failed to update tag!");
        return;
      }
    } else {
      try {
        const createData = {
          tagName: values.name,
          note: values.description,
        };
        const response = await TagService.createTag(createData);
        if (response.data && response.data.statusCode === 201) {
          message.success("Tag created successfully!");
          await fetchTags();
        }
      } catch (error) {
        console.error("Failed to create tag:", error);
        message.error(error.response?.data?.message || "Failed to create tag!");
        return;
      }
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingTag(null);
    setIsEditing(false);
  };

  const handleEdit = (record) => {
    setEditingTag(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      const response = await TagService.deleteTag(key);
      if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
        message.success("Tag deleted successfully!");
        await fetchTags();
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      message.error(error.response?.data?.message || "Failed to delete tag!");
    }
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Tag Name", dataIndex: "name", key: "name", width: 220 },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleDetail(record.key)}>
            View
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Tag"
            description="Are you sure you want to delete this tag?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "50px 80px",
        color: "white",
      }}
    >
      <Card
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          padding: 30,
        }}
      >
        <Title level={2} style={{ color: "white", marginBottom: 30 }}>
          🏷️ Tag Management
        </Title>

        <Space style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              borderRadius: 8,
              background: "#2563eb",
              border: "none",
              fontWeight: "500",
            }}
          >
            Add Tag
          </Button>
        </Space>

        <Input.Search
          placeholder="Search by name or description"
          onSearch={setSearchText}
          enterButton
          style={{
            width: 350,
            marginBottom: 20,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 6,
            color: "white",
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredTags}
            rowKey="key"
            pagination={{ pageSize: 6 }}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: 8,
            }}
          />
        </Spin>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditing ? "✏️ Edit Tag" : "➕ Add New Tag"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingTag(null);
          setIsEditing(false);
        }}
        footer={null}
        centered
        style={{ top: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[{ required: true, message: "Please enter tag name" }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description (optional)" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ borderRadius: 8, height: 40, fontWeight: 500 }}
          >
            {isEditing ? "Update Tag" : "Save Tag"}
          </Button>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="📄 Tag Details"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={600}
        centered
      >
        <Spin spinning={detailLoading}>
          {selectedTag && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tag ID">{selectedTag.tagId}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedTag.tagName}</Descriptions.Item>
              <Descriptions.Item label="Note">{selectedTag.note}</Descriptions.Item>
              <Descriptions.Item label="Associated Articles">
                {selectedTag.newsArticles.length}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default Tag;
