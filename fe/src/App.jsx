import { useCallback, useMemo, useState } from "react";
import { Alert, Col, Layout, Row, Space, Typography } from "antd";
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
const { Paragraph, Title } = Typography;

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
    resetFeed,
    addLocalNotification,
    markNotificationAsRead,
    disconnect,
  } = useRealtimeNews(token, handleRealtimeError);

  const visibleNotifications = useMemo(() => {
    if (notificationFilter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }
    return notifications;
  }, [notificationFilter, notifications]);

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
      onNotificationClick={markNotificationAsRead}
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

          <section className="scroll-test-section">
            <Title level={4}>Scroll test content</Title>
            <Paragraph type="secondary">
              This area is intentionally long so you can test page scrolling
              behavior and sticky header interactions.
            </Paragraph>
            {Array.from({ length: 18 }, (_, index) => (
              <article
                className="scroll-test-block"
                key={`scroll-test-block-${index}`}
              >
                <h4>Sample section #{index + 1}</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  vehicula eros non arcu egestas, at gravida purus feugiat.
                </p>
                <p>
                  Integer commodo, lorem eu convallis laoreet, erat erat
                  suscipit ligula, non cursus tellus justo et velit.
                </p>
              </article>
            ))}
          </section>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
