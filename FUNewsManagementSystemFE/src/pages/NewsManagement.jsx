import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Spin,
  message,
  Select,
  Tag,
  Descriptions,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import NewsService from "../services/NewsService";
import CategoryService from "../services/CategoryService";
import AccountService from "../services/AccountService";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const NewsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchNews();
    fetchCategories();
    fetchAccounts();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await NewsService.getAllNews();
      if (response.data?.statusCode === 200) {
        const mapped = response.data.data.map((item) => ({
          key: item.newsArticleId,
          title: item.newsTitle,
          author: item.createdByName || "Unknown",
          headline: item.headline,
          status: item.newsStatus,
          createdDate: item.createdDate,
          categoryName: item.categoryName,
          fullData: item,
        }));
        setNewsList(mapped);
      }
    } catch (error) {
      message.error("Failed to load news articles!", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const response = await CategoryService.getAllCategories();
      if (response.data?.statusCode === 200) {
        setCategories(response.data.data);
      }
    } catch {
      message.error("Failed to load categories!");
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setAccountLoading(true);
    try {
      const response = await AccountService.getAllAccounts();
      if (response.data?.statusCode === 200) {
        setAccounts(response.data.data);
      }
    } catch {
      message.error("Failed to load user accounts!");
    } finally {
      setAccountLoading(false);
    }
  };

  const handleDetail = async (id) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const response = await NewsService.getNewsById(id);
      if (response.data?.statusCode === 200) {
        setSelectedNews(response.data.data);
      } else {
        message.error("News not found!");
        setIsDetailModalOpen(false);
      }
    } catch {
      message.error("Failed to load news detail!");
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setSelectedNews(null);
  };

  const handleEdit = (record) => {
    setEditingNews(record.fullData);
    form.setFieldsValue({
      newsTitle: record.title,
      headline: record.headline,
      newsContent: record.fullData.newsContent,
      newsSource: record.fullData.newsSource,
      categoryId: record.fullData.categoryId,
      newsStatus: record.status,
      createdById: record.fullData.createdById,
      tagIds: record.fullData.tags?.map((t) => t.tagId) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await NewsService.deleteNews(id);
      message.success("News deleted successfully!");
      fetchNews();
    } catch {
      message.error("Failed to delete news article!");
    }
  };

  const handleOpenAdd = () => {
    setEditingNews(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingNews(null);
  };

  const handleSave = async (values) => {
    const now = new Date().toISOString();
    const payload = {
      ...(editingNews && { newsArticleId: editingNews.newsArticleId }),
      newsTitle: values.newsTitle,
      headline: values.headline,
      newsContent: values.newsContent,
      newsSource: values.newsSource,
      categoryId: values.categoryId,
      newsStatus: values.newsStatus || "Draft",
      createdById: editingNews ? editingNews.createdById : values.createdById,
      updatedById: values.createdById || editingNews?.createdById,
      createdDate: editingNews ? editingNews.createdDate : now,
      modifiedDate: now,
      tagIds: values.tagIds || [],
    };

    try {
      if (editingNews) {
        await NewsService.updateNews(editingNews.newsArticleId, payload);
        message.success("News updated successfully!");
      } else {
        await NewsService.createNews(payload);
        message.success("News created successfully!");
      }
      fetchNews();
      handleCancel();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to save news article!"
      );
    }
  };

  const filteredNews = newsList.filter(
    (n) =>
      n.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      n.author?.toLowerCase().includes(searchText.toLowerCase()) ||
      n.headline?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Title", dataIndex: "title", width: 300 },
    { title: "Author", dataIndex: "author", width: 150 },
    { title: "Headline", dataIndex: "headline", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (s) => (
        <Tag
          color={s === "Published" ? "green" : s === "Draft" ? "orange" : "red"}
        >
          {s}
        </Tag>
      ),
    },
    { title: "Category", dataIndex: "categoryName", width: 150 },
    {
      title: "Action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record.key)}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this news?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 40,
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 30 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            📰 News Management
          </Title>
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search news..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAdd}
            >
              Add News
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredNews}
            rowKey="key"
            scroll={{ x: 1200 }}
            pagination={{ pageSize: 8 }}
            bordered
          />
        </Spin>
      </Card>

      {/* MODAL ADD / EDIT */}
      <Modal
        title={
          editingNews ? "✏️ Edit News Article" : "📰 Add New News Article"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: 30 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="newsTitle"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter news title..." />
          </Form.Item>

          <Form.Item
            name="headline"
            label="Headline"
            rules={[{ required: true, message: "Please enter headline" }]}
          >
            <Input placeholder="Short headline..." />
          </Form.Item>

          <Form.Item
            name="newsContent"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <TextArea rows={6} placeholder="Write article content..." />
          </Form.Item>

          <Form.Item
            name="newsSource"
            label="Source"
            rules={[{ required: true, message: "Please enter source" }]}
          >
            <Input placeholder="Source of news..." />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select
              loading={categoryLoading}
              placeholder="Select category"
              showSearch
              optionFilterProp="children"
            >
              {categories.map((cat) => (
                <Option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {!editingNews && (
            <Form.Item
              name="createdById"
              label="Created By (User)"
              rules={[{ required: true, message: "Please select user" }]}
            >
              <Select
                loading={accountLoading}
                placeholder="Select user"
                showSearch
                optionFilterProp="children"
              >
                {accounts.map((acc) => (
                  <Option key={acc.accountId} value={acc.accountId}>
                    {acc.accountName} ({acc.accountEmail})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="newsStatus" label="Status" initialValue="Draft">
            <Select>
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
              <Option value="Archived">Archived</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tagIds" label="Tags">
            <Select mode="multiple" placeholder="Select tags (optional)">
              <Option value={1}>VinFast</Option>
              <Option value={2}>Xe điện</Option>
              <Option value={3}>Công nghệ</Option>
            </Select>
          </Form.Item>

          <Space style={{ marginTop: 20, justifyContent: "end", width: "100%" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingNews ? "Update" : "Create"}
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* MODAL DETAIL */}
      <Modal
        title="🧾 News Article Details"
        open={isDetailModalOpen}
        onCancel={handleDetailCancel}
        footer={null}
        width={800}
      >
        <Spin spinning={detailLoading}>
          {selectedNews && (
            <Descriptions bordered column={1} labelStyle={{ width: 150 }}>
              <Descriptions.Item label="Title">
                {selectedNews.newsTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Headline">
                {selectedNews.headline}
              </Descriptions.Item>
              <Descriptions.Item label="Content">
                <div
                  style={{
                    maxHeight: 200,
                    overflow: "auto",
                    background: "#fafafa",
                    padding: 10,
                    borderRadius: 6,
                  }}
                >
                  {selectedNews.newsContent}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Source">
                {selectedNews.newsSource}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedNews.categoryName}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedNews.newsStatus === "Published"
                      ? "green"
                      : selectedNews.newsStatus === "Draft"
                      ? "orange"
                      : "red"
                  }
                >
                  {selectedNews.newsStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedNews.createdByName}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(selectedNews.createdDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Modified Date">
                {new Date(selectedNews.modifiedDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Tags">
                {selectedNews.tags?.length > 0
                  ? selectedNews.tags.map((t) => (
                      <Tag key={t.tagId}>{t.tagName}</Tag>
                    ))
                  : "None"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default NewsManagement;
