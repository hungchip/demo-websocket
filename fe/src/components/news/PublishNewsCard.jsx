import { NotificationOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

export default function PublishNewsCard({ onPublish, onSimulate }) {
  return (
    <Card
      title="Publish News Notification"
      extra={
        <Button icon={<PlusCircleOutlined />} onClick={onSimulate}>
          Simulate
        </Button>
      }
    >
      <Form layout="vertical" onFinish={onPublish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title" }]}
        >
          <Input placeholder="Breaking: ..." />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input content" }]}
        >
          <Input.TextArea rows={4} placeholder="Write brief news summary..." />
        </Form.Item>
        <Button type="primary" htmlType="submit" block icon={<NotificationOutlined />}>
          Publish to WebSocket
        </Button>
      </Form>
    </Card>
  );
}
