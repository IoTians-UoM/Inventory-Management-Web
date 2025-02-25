import React, { useState } from 'react';
import { Space, Table, Button, Form, Input, InputNumber, Modal } from 'antd';

const { Column } = Table;

interface DataType {
  key: React.Key;
  id: number;
  productName: string;
  price: number;
  existingQuantity: number;
}

const initialData: DataType[] = [
  { key: '1', id: 1, productName: 'Product 1', price: 100, existingQuantity: 100 },
  { key: '2', id: 2, productName: 'Product 2', price: 150, existingQuantity: 150 },
  { key: '3', id: 3, productName: 'Product 3', price: 50, existingQuantity: 50 },
  { key: '4', id: 4, productName: 'Product 4', price: 50, existingQuantity: 50 },
];

export default function Product() {
  const [data, setData] = useState<DataType[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewProduct, setViewProduct] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  // Create new product
  const handleCreateProduct = (values: any) => {
    const newProduct: DataType = {
      key: (data.length + 1).toString(),
      id: data.length + 1,
      productName: values.productName,
      price: values.price,
      existingQuantity: values.existingQuantity,
    };

    setData((prevData) => [...prevData, newProduct]);
    form.resetFields();
    setIsModalVisible(false);
  };

  // Delete product
  const handleDelete = (key: React.Key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  // View product details
  const handleView = (record: DataType) => {
    setViewProduct(record);
    setIsViewModalVisible(true);
  };

  return (
    <div className="p-4 " >
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button type="primary" className="mb-4" onClick={() => setIsModalVisible(true)}>
          Create New Product
        </Button>
      </div>

      {/* Table */}
      <Table<DataType>   dataSource={data} bordered className="shadow-lg" >
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Product Name" dataIndex="productName" key="productName" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Existing Quantity" dataIndex="existingQuantity" key="existingQuantity" />
        <Column
          title="Action"
          key="action"
          render={(_: any, record: DataType) => (
            <Space size="middle">
              <Button type="link" className="text-green-600" onClick={() => handleView(record)}>
                View
              </Button>
              <Button type="link" danger onClick={() => handleDelete(record.key)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* Create Product Modal */}
      <Modal
        title="Create New Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input product price!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Existing Quantity"
            name="existingQuantity"
            rules={[{ required: true, message: 'Please input existing quantity!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Product Details Modal */}
      <Modal
        title="Product Details"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
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
