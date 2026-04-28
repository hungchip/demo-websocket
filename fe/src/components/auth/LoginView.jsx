import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Layout, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function LoginView({ error, authLoading, onLogin }) {
  return (
    <Layout className="auth-layout">
      <Card className="auth-card" bordered>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            News Portal Login
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Login to receive real-time breaking news notifications via WebSocket.
          </Paragraph>
          {error && <Alert type="error" showIcon message={error} />}
          <Form
            layout="vertical"
            initialValues={{ username: "admin", password: "123456" }}
            onFinish={onLogin}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input username" }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input password" }]}
            >
              <Input.Password />
            </Form.Item>
            <Button
              icon={<LoginOutlined />}
              type="primary"
              htmlType="submit"
              loading={authLoading}
              block
            >
              Login
            </Button>
          </Form>
          <Alert type="info" showIcon message="Demo account: admin / 123456" />
        </Space>
      </Card>
    </Layout>
  );
}
