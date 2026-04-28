import { NotificationOutlined } from "@ant-design/icons";
import { Avatar, Empty, List, Segmented, Space, Typography } from "antd";
import { formatTime } from "../../utils/notificationUtils";

const { Text } = Typography;

export default function NotificationPopoverContent({
  filter,
  onFilterChange,
  notifications,
}) {
  return (
    <div className="notification-popover">
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Segmented
          block
          value={filter}
          options={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread" },
          ]}
          onChange={onFilterChange}
        />
        <List
          size="small"
          dataSource={notifications}
          locale={{
            emptyText: (
              <Empty
                description="No notifications yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<NotificationOutlined />} />}
                title={item.title}
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">{item.content}</Text>
                    <Text type="secondary">{formatTime(item.sentAt)}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Space>
    </div>
  );
}
