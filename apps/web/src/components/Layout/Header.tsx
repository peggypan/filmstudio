import { Layout, Avatar, Dropdown, Space } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'

const { Header } = Layout

function AppHeader() {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
      <div style={{ flex: 1, fontSize: '18px', fontWeight: 'bold' }}>
        🎬 FilmStudio
      </div>
      <Space>
        <Dropdown menu={{ items: [{ key: 'logout', label: '退出登录' }] }}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>用户名</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader
