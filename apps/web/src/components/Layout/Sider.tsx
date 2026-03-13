import { Layout, Menu, Button } from 'antd'
import {
  HomeOutlined,
  FileTextOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  PictureOutlined,
  AudioOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'

const { Sider } = Layout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: <Link to="/">工作台</Link> },
  { key: '/scripts', icon: <FileTextOutlined />, label: <Link to="/scripts">剧本管理</Link> },
  { key: '/cast', icon: <TeamOutlined />, label: <Link to="/cast">演员管理</Link> },
  { key: '/music', icon: <CustomerServiceOutlined />, label: <Link to="/music">配乐管理</Link> },
  { key: '/storyboard', icon: <PictureOutlined />, label: <Link to="/storyboard">分镜设计</Link> },
  { key: '/dubbing', icon: <AudioOutlined />, label: <Link to="/dubbing">配音合成</Link> },
  { key: '/projects', icon: <ProjectOutlined />, label: <Link to="/projects">项目管理</Link> },
]

function AppSider() {
  const location = useLocation()

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  )
}

export default AppSider
