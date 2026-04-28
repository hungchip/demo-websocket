import { BellOutlined, DisconnectOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Statistic, Typography } from "antd";

const { Text } = Typography;

export default function LiveStatsCard({
  connected,
  unreadCount,
  latestRandom,
  wsUrlInUse,
}) {
  return (
    <Card title="Live Stats">
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Statistic
            title="Connection"
            value={connected ? "Online" : "Offline"}
            valueStyle={{ color: connected ? "#3f8600" : "#cf1322" }}
            prefix={connected ? <ThunderboltOutlined /> : <DisconnectOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic title="Unread Alerts" value={unreadCount} prefix={<BellOutlined />} />
        </Col>
        <Col span={24}>
          <Statistic
            title="Latest Signal"
            value={typeof latestRandom === "number" ? latestRandom : 0}
            suffix="/ 1000"
          />
          <Progress
            percent={
              typeof latestRandom === "number"
                ? Math.round((latestRandom / 1000) * 100)
                : 0
            }
            size="small"
          />
        </Col>
        <Col span={24}>
          <Text type="secondary">Endpoint: {wsUrlInUse || "Pending..."}</Text>
        </Col>
      </Row>
    </Card>
  );
}
