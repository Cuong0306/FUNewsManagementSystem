import { Table, Button, Modal, Form, Input, Space, Spin, message, Popconfirm, Descriptions, Switch } from "antd";
import { useState, useEffect } from "react";
import CategoryService from "../services/CategoryService";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryService.getAllCategories();
      if (response.data && response.data.statusCode === 200) {
        const mappedCategories = response.data.data.map((cat) => ({
          key: cat.categoryId,
          name: cat.categoryName,
          description: cat.categoryDescription,
          parentCategoryId: cat.parentCategoryId,
          isActive: cat.isActive,
        }));
        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to load categories!");
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (id) => {
    setDetailLoading(true);
    try {
      const response = await CategoryService.getCategoryById(id);
      if (response.data && response.data.statusCode === 200) {
        setSelectedCategory(response.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch category details:", error);
      message.error("Failed to load category details!");
    } finally {
      setDetailLoading(false);
    }
  };

  // === EDIT HANDLER ===
  const handleEdit = async (record) => {
    setIsEditing(true);
    setEditingCategory(record);
    setIsModalOpen(true);

    // Lấy dữ liệu chi tiết để điền form
    try {
      const response = await CategoryService.getCategoryById(record.key);
      if (response.data && response.data.statusCode === 200) {
        const data = response.data.data;
        form.setFieldsValue({
          categoryName: data.categoryName,
          categoryDescription: data.categoryDescription,
          parentCategoryId: data.parentCategoryId,
          isActive: data.isActive,
        });
      }
    } catch (error) {
      message.error("Failed to load category for editing");
    }
  };

  // === SAVE (CREATE / UPDATE) ===
  const handleSave = async (values) => {
    try {
      if (isEditing && editingCategory) {
        const payload = {
          categoryId: editingCategory.key,
          ...values,
        };
        await CategoryService.updateCategory(editingCategory.key, payload);
        message.success("Category updated successfully!");
      } else {
        await CategoryService.createCategory(values);
        message.success("Category created successfully!");
      }

      fetchCategories(); // Reload danh sách
      handleCancel();
    } catch (error) {
      console.error("Save failed:", error);
      message.error(isEditing ? "Failed to update category!" : "Failed to create category!");
    }
  };

  // === DELETE HANDLER ===
  const handleDelete = async (key) => {
    try {
      await CategoryService.deleteCategory(key);
      setCategories(categories.filter((cat) => cat.key !== key));
      message.success("Category deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete category!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
    setIsEditing(false);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchText.toLowerCase())
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
            title="Delete Category"
            description="Are you sure to delete this category?"
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
      <h2>Category Management</h2>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
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
        <Table columns={columns} dataSource={filteredCategories} rowKey="key" />
      </Spin>

      {/* Add / Edit Modal */}
      <Modal
        title={isEditing ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="categoryName"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryDescription"
            label="Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="parentCategoryId"
            label="Parent Category ID"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Category Details"
        open={isDetailModalOpen}
        onCancel={handleDetailCancel}
        footer={null}
        width={600}
      >
        <Spin spinning={detailLoading}>
          {selectedCategory && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Category ID">{selectedCategory.categoryId}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedCategory.categoryName}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedCategory.categoryDescription}</Descriptions.Item>
              <Descriptions.Item label="Parent Category ID">{selectedCategory.parentCategoryId || 'None'}</Descriptions.Item>
              <Descriptions.Item label="Is Active">{selectedCategory.isActive ? 'Yes' : 'No'}</Descriptions.Item>
              <Descriptions.Item label="Subcategories">
                {selectedCategory.inverseParentCategory?.length > 0
                  ? selectedCategory.inverseParentCategory.map(c => c.categoryName).join(', ')
                  : 'None'}
              </Descriptions.Item>
              <Descriptions.Item label="Associated Articles">{selectedCategory.newsArticles?.length || 0}</Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default Category;