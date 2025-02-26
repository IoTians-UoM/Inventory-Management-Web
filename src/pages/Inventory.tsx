import React, { useEffect, useState } from "react";
import { Table, Button, Space, InputNumber, Modal, Form, Input, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { InventoryItem } from "../types/types";
import { getAllInventory } from "../api/inventory";

const { Option } = Select;


export default function Inventory({items}:{items:InventoryItem[]}) {
    const [data, setData] = useState<InventoryItem[]>([
    
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    const showModal = () => {
        setIsModalVisible(true);
    };

    useEffect(() => {
        getAllInventory();
    }, []);

    const handleOk = () => {
        form.validateFields().then((values) => {
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
                    item.product_id === editingItem?.product_id ? { ...item, ...values, total: values.quantity * values.price } : item
                )
            );
            setIsEditModalVisible(false);
            setEditingItem(null);
        });
    };

    const handleDelete = (key: string) => {
        setData((prevData) => prevData.filter(item => item.product_id !== key));
    };

    const columns = [
        { title: "ID", dataIndex: "product_id", key: "key" },
        { title: "Item Name", dataIndex: "product_name", key: "name" },
      
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: InventoryItem) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                    <Popconfirm
                        title="Are you sure you want to delete this item?"
                        onConfirm={() => handleDelete(record.product_id)}
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
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Inventory</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Create New Inventory
                </Button>
            </div>

            <Table<InventoryItem>
                columns={columns}
                dataSource={items || []}
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
}
