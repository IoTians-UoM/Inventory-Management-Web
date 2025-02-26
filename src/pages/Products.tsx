import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, Form, Input, InputNumber, Typography, Spin, message } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllProducts, createProduct, deleteProduct, writeTag } from "../api/product";  // Assuming these functions are imported
import { Message, Product as ProductType } from "../types/types";

const { Column } = Table;
const { Text } = Typography;

interface DataType {
  key: React.Key;
  id: number;
  productName: string;
  price: number;
  existingQuantity: number;
}

export default function Product({ items }: { items: ProductType[] }) {
  const [data, setData] = useState<ProductType[]>(items || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWriteTagModalVisible, setIsWriteTagModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [form] = Form.useForm();

  // Open Write Tag modal and start loading
  const handleWriteTag = (productId: string) => {
    setIsWriteTagModalVisible(true);
    setLoading(true);
    setScanComplete(false);

    // Send the writeTag request with the product's ID
    writeTag(productId);

    // Simulate 10-second scan time
    setTimeout(() => {
      setLoading(false);
      setScanComplete(true);
    }, 10000);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);  // Call the deleteProduct function
      setData(prevData => prevData.filter(product => product.id !== productId));  // Update the data after deletion
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const openCreateModal = () => {
    setIsEdit(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (product: ProductType) => {
    setIsEdit(true);
    setEditingProduct(product);
    form.setFieldsValue({
      productName: product.name,
      price: product.price,
      existingQuantity: product.quantity,
    });
    setIsModalVisible(true);
  };

  const handleCreateOrEditProduct = async (values: any) => {
    const product: ProductType = {
      id: isEdit && editingProduct ? editingProduct.id : Date.now().toString(), // Ensure id is a string
      name: values.productName,
      price: values.price,
      quantity: values.existingQuantity,
      timestamp: new Date().toISOString(),
    };

    await createProduct(product);
    setData((prevData) => {
      if (isEdit) {
        return prevData.map((item) => (item.id === product.id ? product : item));
      }
      return [...prevData, product];
    });

    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2>Products</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          {isEdit ? "Edit Product" : "Create New Product"}
        </Button>
      </div>

      <Table<ProductType> dataSource={data} rowKey="id" bordered className="shadow-lg">
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Product Name" dataIndex="name" key="productName" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Existing Quantity" dataIndex="quantity" key="existingQuantity" />
        <Column
          title="Action"
          key="action"
          render={(_: any, record: ProductType) => (
            <Space size="middle">
              {/* <Button type="link" icon={<EyeOutlined />} className="text-green-600">
                View
              </Button> */}
              <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                Edit
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteProduct(record.id)}  // Trigger delete action
              >
                Delete
              </Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleWriteTag(record.id)}  // Trigger write tag with product's ID
              >
                Write Tag
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={isEdit ? "Edit Product" : "Create New Product"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrEditProduct} style={{ maxWidth: "600px" }}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Existing Quantity"
            name="existingQuantity"
            rules={[{ required: true, message: "Please input existing quantity!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Write RFID Tag"
        open={isWriteTagModalVisible}
        onCancel={() => setIsWriteTagModalVisible(false)}
        footer={null}
        style={{
          top: 40,
          width: 600,
        }}
      >
        <div className="flex justify-center items-center flex-col gap-4">
          {loading ? (
            <>
              <Spin size="large" />
              <Text>Waiting for tag scan... (10 seconds)</Text>
            </>
          ) : scanComplete ? (
            <Text type="success">Tag scanned successfully!</Text>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
