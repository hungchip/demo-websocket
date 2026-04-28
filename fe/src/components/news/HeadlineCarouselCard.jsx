import { Card, Carousel, Tag, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function HeadlineCarouselCard({ featuredNews }) {
  return (
    <Card title="Headline Carousel" extra={<Tag color="blue">Live</Tag>}>
      <Carousel autoplay dots>
        {featuredNews.map((item) => (
          <div key={item.title}>
            <div className="headline-slide">
              <Tag color="geekblue">{item.category}</Tag>
              <Title level={4}>{item.title}</Title>
              <Paragraph type="secondary">{item.summary}</Paragraph>
            </div>
          </div>
        ))}
      </Carousel>
    </Card>
  );
}
