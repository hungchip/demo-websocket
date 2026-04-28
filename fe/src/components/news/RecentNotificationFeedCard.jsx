import { NotificationOutlined } from "@ant-design/icons";
import { Avatar, Card, Divider, List, Space, Typography } from "antd";
import { formatTime } from "../../utils/notificationUtils";

const { Text } = Typography;

export default function RecentNotificationFeedCard({ notifications }) {
  return (
    <Card title="Recent Notification Feed">
      <List
        dataSource={notifications}
        locale={{ emptyText: "No realtime updates received yet." }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<NotificationOutlined />} />}
              title={item.title}
              description={
                <Space direction="vertical" size={0}>
                  <Text>{item.content}</Text>
                  <Text type="secondary">{formatTime(item.sentAt)}</Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
      <Divider style={{ margin: "12px 0" }} />
      <Text type="secondary">
        Click the bell icon in header to open the compact notification center.
      </Text>
    </Card>
  );
}
