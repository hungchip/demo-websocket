import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Col, Layout, Row, Space } from "antd";
import LoginView from "./components/auth/LoginView";
import NewsHeader from "./components/layout/NewsHeader";
import HeadlineCarouselCard from "./components/news/HeadlineCarouselCard";
import LiveStatsCard from "./components/news/LiveStatsCard";
import NewsSectionsCard from "./components/news/NewsSectionsCard";
import PublishNewsCard from "./components/news/PublishNewsCard";
import RecentNotificationFeedCard from "./components/news/RecentNotificationFeedCard";
import NotificationPopoverContent from "./components/notifications/NotificationPopoverContent";
import { TOKEN_KEY, USERNAME_KEY } from "./constants/appConfig";
import { FEATURED_NEWS, NEWS_BY_TAB } from "./constants/newsData";
import { useRealtimeNews } from "./hooks/useRealtimeNews";
import { loginRequest } from "./services/authService";
import { publishNotification } from "./services/notificationService";

const { Content } = Layout;

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState(
    () => localStorage.getItem(USERNAME_KEY) || ""
  );
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");

  const handleRealtimeError = useCallback((message) => {
    setError(message);
  }, []);

  const {
    connected,
    wsUrlInUse,
    notifications,
    latestRandom,
    unreadCount,
    clearUnread,
    resetFeed,
    addLocalNotification,
    disconnect,
  } = useRealtimeNews(token, handleRealtimeError);

  useEffect(() => {
    if (notifOpen) {
      clearUnread();
    }
  }, [notifOpen, clearUnread]);

  const visibleNotifications = useMemo(() => {
    if (notificationFilter === "unread") {
      return notifications.slice(0, unreadCount);
    }
    return notifications;
  }, [notificationFilter, notifications, unreadCount]);

  const handleLogin = async (credentials) => {
    setError("");
    setAuthLoading(true);
    try {
      const data = await loginRequest(credentials);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USERNAME_KEY, data.username || credentials.username);
      setToken(data.token);
      setUsername(data.username || credentials.username);
      resetFeed();
      setNotifOpen(false);
    } catch (err) {
      setError(err.message || "Cannot login.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await disconnect();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken("");
    setUsername("");
    setNotifOpen(false);
    setError("");
    resetFeed();
  };

  const handlePublishNotification = async (values) => {
    setError("");
    try {
      await publishNotification(token, values);
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const handleSimulateNotification = () => {
    addLocalNotification({
      title: "Simulated Breaking News",
      content: "A demo notification arrived from the local simulator.",
      sentAt: new Date().toISOString(),
    });
  };

  const notificationPanel = (
    <NotificationPopoverContent
      filter={notificationFilter}
      onFilterChange={setNotificationFilter}
      notifications={visibleNotifications}
    />
  );

  if (!token) {
    return (
      <LoginView error={error} authLoading={authLoading} onLogin={handleLogin} />
    );
  }

  return (
    <Layout className="news-layout">
      <NewsHeader
        username={username}
        unreadCount={unreadCount}
        notifOpen={notifOpen}
        onNotifOpenChange={setNotifOpen}
        notificationPanel={notificationPanel}
        onLogout={handleLogout}
      />

      <Content className="news-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {error && <Alert type="error" showIcon message={error} />}

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <HeadlineCarouselCard featuredNews={FEATURED_NEWS} />
            </Col>
            <Col xs={24} xl={8}>
              <LiveStatsCard
                connected={connected}
                unreadCount={unreadCount}
                latestRandom={latestRandom}
                wsUrlInUse={wsUrlInUse}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={15}>
              <NewsSectionsCard newsByTab={NEWS_BY_TAB} />
            </Col>
            <Col xs={24} lg={9}>
              <PublishNewsCard
                onPublish={handlePublishNotification}
                onSimulate={handleSimulateNotification}
              />
            </Col>
          </Row>

          <RecentNotificationFeedCard notifications={notifications} />
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
