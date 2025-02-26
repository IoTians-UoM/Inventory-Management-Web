import React, { useState } from "react";
import {
  Space,
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Spin,
  Typography,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Column } = Table;
const { Text } = Typography;

interface DataType {
  key: React.Key;
  id: number;
  productName: string;
  price: number;
  existingQuantity: number;
}

const initialData: DataType[] = [
  {
    key: "1",
    id: 1,
    productName: "Product 1",
    price: 100,
    existingQuantity: 100,
  },
  {
    key: "2",
    id: 2,
    productName: "Product 2",
    price: 150,
    existingQuantity: 150,
  },
  {
    key: "3",
    id: 3,
    productName: "Product 3",
    price: 50,
    existingQuantity: 50,
  },
  {
    key: "4",
    id: 4,
    productName: "Product 4",
    price: 50,
    existingQuantity: 50,
  },
];

export default function Product() {
  const [data, setData] = useState<DataType[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isWriteTagModalVisible, setIsWriteTagModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
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

  // Open Write Tag modal and start loading
  const handleWriteTag = () => {
    setIsWriteTagModalVisible(true);
    setLoading(true);
    setScanComplete(false);

    // Simulate 10-second scan time
    setTimeout(() => {
      setLoading(false);
      setScanComplete(true);
    }, 10000);
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
      <Table<DataType> dataSource={data} bordered className="shadow-lg">
        <Column title="ID" dataIndex="id" key="id" />
        <Column
          title="Product Name"
          dataIndex="productName"
          key="productName"
        />
        <Column title="Price" dataIndex="price" key="price" />
        <Column
          title="Existing Quantity"
          dataIndex="existingQuantity"
          key="existingQuantity"
        />
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
                onClick={handleWriteTag}
              >
                Write Tag
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
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {viewProduct && (
          <div>
            <p>
              <strong>ID:</strong> {viewProduct.id}
            </p>
            <p>
              <strong>Product Name:</strong> {viewProduct.productName}
            </p>
            <p>
              <strong>Price:</strong> {viewProduct.price}
            </p>
            <p>
              <strong>Existing Quantity:</strong> {viewProduct.existingQuantity}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Write RFID Tag"
        open={isWriteTagModalVisible}
        onCancel={() => setIsWriteTagModalVisible(false)}
        footer={null}
        style={{
          top: 40,
          width: 600,
          // height: 600,  // You can still set a fixed height here if needed
        }}
        styles={{
          body: {
            // Use the 'body' key within 'styles'
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // Important for content to fill the modal
            padding: 20,
          },
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
