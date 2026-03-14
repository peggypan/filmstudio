import { Layout, Avatar, Dropdown, Space, message } from 'antd'
import { UserOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth'

const { Header } = Layout

function AppHeader() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    message.success('已退出登录')
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => message.info('个人设置功能开发中...'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      background: '#fff', 
      padding: '0 24px', 
      boxShadow: '0 1px 4px rgba(0,21,41,.08)' 
    }}>
      <div style={{ flex: 1, fontSize: '18px', fontWeight: 'bold' }}>
        🎬 FilmStudio
      </div>
      <Space>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              src={user?.avatar} 
              icon={!user?.avatar && <UserOutlined />} 
            />
            <span>{user?.name || user?.email || '用户'}</span>
            <DownOutlined style={{ fontSize: 12 }} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader
