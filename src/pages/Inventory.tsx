import { useEffect, useState } from "react";
import { Table, Button, Space, InputNumber, Modal, Form, Input, Select, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { InventoryItem } from "../types/types";
import { createInventory, deleteInventory } from "../api/inventory";



export default function Inventory({ items }: { items: InventoryItem[] }) {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    setData(items || []); // Fetch inventory on load
     // Populate table with incoming props
  }, [items]);

  const showModal = () => {
    setIsModalVisible(true);
  };


  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const newItem: InventoryItem = {
        product_id: "1",
        product_name: values.name,
        quantity: values.quantity,
        timestamp: new Date().toISOString(),
      };

      await createInventory([newItem]); // Call the createInventory API function to create a new item
      setData((prev) => [...prev, newItem]);
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to create inventory item:", error);
    }
  };

  const showEditModal = (record: InventoryItem) => {
    setEditingItem(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const updatedItem: InventoryItem = {
        ...editingItem!,
        product_name: values.name,
        quantity: values.quantity,
        timestamp: new Date().toISOString(),
      };

      await createInventory([updatedItem], ); // Reuse create for editing
      setData((prev) =>
        prev.map((item) => (item.product_id === updatedItem.product_id ? updatedItem : item))
      );
      setIsEditModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to edit inventory item:", error);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteInventory(key); // Call the deleteInventory API function to delete the item from the server
  
      // Update the local data state by removing the deleted item
      setData((prev) => prev.filter((item) => item.product_id !== key));
  
      message.success("Inventory item deleted successfully");
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      message.error("Failed to delete inventory item");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "product_id", key: "key" },
    { title: "Item Name", dataIndex: "product_name", key: "name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { 
      title: "Date/Time", 
      dataIndex: "timestamp", 
      key: "timestamp",
      render: (text: string) => new Date(text).toLocaleString() 
    },
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2>Inventory</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create New Inventory
        </Button>
      </div>

      <Table<InventoryItem>
        columns={columns}
        dataSource={data}
        rowKey="product_id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal title="Add Inventory Item" open={isModalVisible} onOk={handleCreate} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit Inventory Item" open={isEditModalVisible} onOk={handleEdit} onCancel={() => setIsEditModalVisible(false)}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
