import { Table, Button, Modal, Form, Input, Space, Spin, message, Popconfirm, Descriptions } from "antd";
import { useState, useEffect } from "react";
import TagService from "../services/TagService"; // Adjust path to your service file

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

  // Fetch all tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await TagService.getAllTags();
      if (response.data && response.data.statusCode === 200) {
        // Map API response to component format
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
      // Update existing tag via API
      try {
        const updateData = {
          tagId: editingTag.key,
          tagName: values.name,
          note: values.description,
        };
        const response = await TagService.updateTag(editingTag.key, updateData);
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
          message.success("Tag updated successfully!");
          // Refetch tags to update list
          await fetchTags();
        }
      } catch (error) {
        console.error("Failed to update tag:", error);
        message.error(error.response?.data?.message || "Failed to update tag!");
        return; // Don't close modal on error
      }
    } else {
      // Create new tag via API
      try {
        const createData = {
          tagName: values.name,
          note: values.description,
        };
        const response = await TagService.createTag(createData);
        if (response.data && response.data.statusCode === 201) {
          message.success("Tag created successfully!");
          // Refetch tags to update list
          await fetchTags();
        }
      } catch (error) {
        console.error("Failed to create tag:", error);
        message.error(error.response?.data?.message || "Failed to create tag!");
        return; // Don't close modal on error
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
      description: record.description 
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (key) => {
    try {
      const response = await TagService.deleteTag(key);
      if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 204)) {
        message.success("Tag deleted successfully!");
        // Refetch tags to update list
        await fetchTags();
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      message.error(error.response?.data?.message || "Failed to delete tag!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingTag(null);
    setIsEditing(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setSelectedTag(null);
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", width: 200 },
    { title: "Description", dataIndex: "description" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleDetail(record.key)}>Detail</Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete Tag"
            description="Are you sure to delete this tag?"
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
      <h2>Tag Management</h2>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Tag
        </Button>
      </Space>
      <Input.Search
        placeholder="Search by name or description"
        onSearch={setSearchText}
        enterButton
        style={{ width: 300, marginBottom: 20 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredTags} rowKey="key" />
      </Spin>

      <Modal
        title={isEditing ? "Edit Tag" : "Add New Tag"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isEditing ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Tag Details"
        open={isDetailModalOpen}
        onCancel={handleDetailCancel}
        footer={null}
        width={600}
      >
        <Spin spinning={detailLoading}>
          {selectedTag && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tag ID">{selectedTag.tagId}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedTag.tagName}</Descriptions.Item>
              <Descriptions.Item label="Note">{selectedTag.note}</Descriptions.Item>
              <Descriptions.Item label="Associated Articles">{selectedTag.newsArticles.length}</Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default Tag;