import {
  BellOutlined,
  BookOutlined,
  GlobalOutlined,
  HomeOutlined,
  LaptopOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Layout, Menu, Popover, Space } from "antd";

const { Header } = Layout;

export default function NewsHeader({
  username,
  unreadCount,
  notifOpen,
  onNotifOpenChange,
  notificationPanel,
  onLogout,
}) {
  return (
    <Header className="news-header">
      <div className="header-brand">
        <BookOutlined />
        <span>Realtime Newsroom</span>
      </div>

      <Menu
        mode="horizontal"
        className="header-menu"
        defaultSelectedKeys={["home"]}
        items={[
          { key: "home", icon: <HomeOutlined />, label: "Home" },
          { key: "world", icon: <GlobalOutlined />, label: "World" },
          { key: "tech", icon: <LaptopOutlined />, label: "Technology" },
        ]}
      />

      <Space size="middle">
        <Input.Search placeholder="Search articles..." allowClear className="header-search" />

        <Popover
          content={notificationPanel}
          trigger="click"
          placement="bottomRight"
          open={notifOpen}
          onOpenChange={onNotifOpenChange}
        >
          <Badge count={unreadCount} size="small" offset={[-2, 2]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Popover>

        <Dropdown
          menu={{
            items: [
              { key: "name", label: `Signed in as ${username}`, disabled: true },
              { type: "divider" },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: onLogout,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Avatar icon={<UserOutlined />} className="clickable-avatar" />
        </Dropdown>
      </Space>
    </Header>
  );
}
