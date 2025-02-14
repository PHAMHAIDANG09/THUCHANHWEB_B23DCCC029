import React, { useState, useEffect } from "react";
import { Input, Button, List, Modal, Form, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

type Task = {
  id: number;
  title: string;
  details: string;
  color: string;
};


const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdateTask = (values: any) => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? { ...task, ...values } : task))
      );
      setEditingTask(null);
    } else {
      setTasks([...tasks, { id: Date.now(), ...values }]);
    }
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
        Thêm Task
      </Button>

      <List
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => {
                  setEditingTask(task);
                  form.setFieldsValue(task);
                  setIsModalOpen(true);
                }}
              />,
              <DeleteOutlined key="delete" onClick={() => handleDeleteTask(task.id)} />
            ]}
          >
            <Tag color={task.color}>{task.title}</Tag> - {task.details}
          </List.Item>
        )}
      />

<Modal
  title={editingTask ? "Sửa Task" : "Thêm Task"}
  visible={isModalOpen} 
  onCancel={() => {
    setEditingTask(null);
    setIsModalOpen(false);
    form.resetFields();
  }}
  onOk={() => form.submit()}
>

        <Form form={form} onFinish={handleAddOrUpdateTask} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="details" label="Chi tiết" rules={[{ required: true, message: "Vui lòng nhập chi tiết" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc" rules={[{ required: true, message: "Vui lòng chọn màu" }]}>
            <Input type="color" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;