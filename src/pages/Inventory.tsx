import React, { useState } from "react";
import { Table, Button, Space, InputNumber, Modal, Form, Input, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

interface InventoryItem {
    key: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    total: number;
}

const Inventory: React.FC = () => {
    const [data, setData] = useState<InventoryItem[]>([
        { key: "1", name: "Laptop", category: "Electronics", quantity: 10, price: 800, total: 8000 },
        { key: "2", name: "Office Chair", category: "Furniture", quantity: 15, price: 120, total: 1800 },
        { key: "3", name: "Mouse", category: "Accessories", quantity: 50, price: 20, total: 1000 },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);


    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleOk = () => {
        form.validateFields().then((values) => {
            const newItem: InventoryItem = {
                key: (data.length + 1).toString(),
                name: values.name,
                category: values.category,
                quantity: values.quantity,
                price: values.price,
                total: values.quantity * values.price,
            };
            setData([...data, newItem]);
            form.resetFields();
            setIsModalVisible(false);
        });
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditModalVisible(false);
    };


    const showEditModal = (record: InventoryItem) => {
        setEditingItem(record);
        editForm.setFieldsValue(record);
        setIsEditModalVisible(true);
    };


    const handleEditOk = () => {
        editForm.validateFields().then((values) => {
            setData((prevData) =>
                prevData.map((item) =>
                    item.key === editingItem?.key ? { ...item, ...values, total: values.quantity * values.price } : item
                )
            );
            setIsEditModalVisible(false);
            setEditingItem(null);
        });
    };


    const handleDelete = (key: string) => {
        setData((prevData) => prevData.filter(item => item.key !== key));
    };


    const columns = [
        { title: "ID", dataIndex: "key", key: "key" },
        { title: "Item Name", dataIndex: "name", key: "name" },
        { title: "Category", dataIndex: "category", key: "category" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Unit Price", dataIndex: "price", key: "price", render: (price: number) => `Rs ${price}` },
        { title: "Total Value", dataIndex: "total", key: "total", render: (total: number) => `Rs ${total}` },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: InventoryItem) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{
          
        }}>
            {/* <h2 style={{ color: "" }}>Inventory Management Table</h2>

            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: "10px" }}>
                Add Inventory Item
            </Button> */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Inventory</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                Create New Inventory
            </Button>
            </div>


            <Table
                // columns={columns}
                // dataSource={data}
                // style={{ width: "80%", height: "80%", flex: 1, overflow: "auto" }}
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 5 }}
                bordered
                style={{ width: "100%", maxWidth: "1200px", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}
            />


            <Modal title="Add Inventory Item" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Item Name" rules={[{ required: true, message: "Please enter item name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
                        <Select>
                            <Option value="Electronics">Electronics</Option>
                            <Option value="Furniture">Furniture</Option>
                            <Option value="Accessories">Accessories</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="price" label="Unit Price (Rs)" rules={[{ required: true, message: "Please enter price" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>


            <Modal title="Edit Inventory Item" open={isEditModalVisible} onOk={handleEditOk} onCancel={handleCancel}>
                <Form form={editForm} layout="vertical">
                    <Form.Item name="name" label="Item Name" rules={[{ required: true, message: "Please enter item name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
                        <Select>
                            <Option value="Electronics">Electronics</Option>
                            <Option value="Furniture">Furniture</Option>
                            <Option value="Accessories">Accessories</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="price" label="Unit Price (Rs)" rules={[{ required: true, message: "Please enter price" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Inventory;
