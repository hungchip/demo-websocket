import { Card, List, Tabs, Tag } from "antd";

export default function NewsSectionsCard({ newsByTab }) {
  return (
    <Card title="News Sections">
      <Tabs
        defaultActiveKey="Top Stories"
        items={Object.keys(newsByTab).map((key) => ({
          key,
          label: key,
          children: (
            <List
              itemLayout="vertical"
              dataSource={newsByTab[key]}
              renderItem={(item) => (
                <List.Item extra={<Tag color="purple">{item.tag}</Tag>}>
                  <List.Item.Meta title={item.title} description={item.summary} />
                </List.Item>
              )}
            />
          ),
        }))}
      />
    </Card>
  );
}
