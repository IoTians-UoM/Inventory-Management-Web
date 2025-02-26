import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, Form, Input, InputNumber, Typography } from "antd";
import { EyeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllProducts } from "../api/product";
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

export default function Product({items}:{items:ProductType[]}) {
  const [data, setData] = useState<Message[]>([]);  // Use state for products
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewProduct, setViewProduct] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getAllProducts();
  }, []); // Only run on mount

  const handleCreateProduct = (values: any) => {
    const newProduct: DataType = {
      key: (data.length + 1).toString(),
      id: data.length + 1,
      productName: values.productName,
      price: values.price,
      existingQuantity: values.existingQuantity,
    };

    // setData((prevData) => [...prevData, newProduct]);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleDelete = (key: React.Key) => {
    // setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const handleView = (record: DataType) => {
    setViewProduct(record);
    setIsViewModalVisible(true);
  };

  return (
    <div className="p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Products</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Create New Product
        </Button>
      </div>

      {/* Table */}
      <Table<ProductType> dataSource={items || []} bordered className="shadow-lg">
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Product Name" dataIndex="name" key="productName" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Existing Quantity" dataIndex="quantity" key="existingQuantity" />
        <Column
          title="Action"
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <Button
                type="link"
                icon={<EyeOutlined />}
                className="text-green-600"
                onClick={() => handleView(record)}
              >
                View
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record.key)}
              >
                Delete
              </Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {}}
              >
                Edit
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Create Product Modal */}
      <Modal
        title="Create New Product"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProduct} style={{ maxWidth: "600px" }}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Please input product name!" }]}
            style={{ width: "100%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
            style={{ width: "100%" }}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Existing Quantity"
            name="existingQuantity"
            rules={[{ required: true, message: "Please input existing quantity!" }]}
            style={{ width: "100%" }}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Details Modal */}
      <Modal
        title="Product Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsViewModalVisible(false)}>Close</Button>]}
      >
        {viewProduct && (
          <div>
            <p><strong>ID:</strong> {viewProduct.id}</p>
            <p><strong>Product Name:</strong> {viewProduct.productName}</p>
            <p><strong>Price:</strong> {viewProduct.price}</p>
            <p><strong>Existing Quantity:</strong> {viewProduct.existingQuantity}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
