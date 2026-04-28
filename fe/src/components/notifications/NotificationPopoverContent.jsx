import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import { Avatar, Empty, List, Segmented, Space, Spin, Typography } from "antd";
import { formatTime } from "../../utils/notificationUtils";

const { Text } = Typography;
const BATCH_SIZE = 10;
const SCROLL_BOTTOM_THRESHOLD = 24;
const LOAD_MORE_DELAY_MS = 3000;

export default function NotificationPopoverContent({
  filter,
  onFilterChange,
  notifications,
}) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTimerRef = useRef(null);

  useEffect(() => () => {
    if (loadMoreTimerRef.current) {
      clearTimeout(loadMoreTimerRef.current);
      loadMoreTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (loadMoreTimerRef.current) {
      clearTimeout(loadMoreTimerRef.current);
      loadMoreTimerRef.current = null;
    }
    setIsLoadingMore(false);
    setVisibleCount(BATCH_SIZE);
  }, [filter]);

  useEffect(() => {
    setVisibleCount((prev) => Math.min(Math.max(prev, BATCH_SIZE), notifications.length || BATCH_SIZE));
  }, [notifications.length]);

  const visibleNotifications = useMemo(
    () => notifications.slice(0, visibleCount),
    [notifications, visibleCount]
  );

  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const reachedBottom =
        scrollTop + clientHeight >= scrollHeight - SCROLL_BOTTOM_THRESHOLD;
      if (
        !reachedBottom ||
        visibleCount >= notifications.length ||
        isLoadingMore
      ) {
        return;
      }
      setIsLoadingMore(true);
      loadMoreTimerRef.current = setTimeout(() => {
        setVisibleCount((prev) =>
          Math.min(prev + BATCH_SIZE, notifications.length)
        );
        setIsLoadingMore(false);
        loadMoreTimerRef.current = null;
      }, LOAD_MORE_DELAY_MS);
    },
    [isLoadingMore, notifications.length, visibleCount]
  );

  return (
    <div className="notification-popover" onScroll={handleScroll}>
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
          dataSource={visibleNotifications}
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
        {isLoadingMore && (
          <Space
            align="center"
            style={{ width: "100%", justifyContent: "center", paddingBottom: 8 }}
          >
            <Spin size="small" />
            <Text type="secondary">Loading more notifications...</Text>
          </Space>
        )}
      </Space>
    </div>
  );
}
