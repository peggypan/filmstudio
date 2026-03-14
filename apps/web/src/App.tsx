import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from './components/Layout/Header'
import AppSider from './components/Layout/Sider'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ScriptEditor from './pages/Script/Editor'
import ScriptList from './pages/Script/List'
import CastList from './pages/Cast/List'
import MusicLibrary from './pages/Music/Library'
import StoryboardEditor from './pages/Storyboard/Editor'
import DubbingStudio from './pages/Dubbing/Studio'
import ProjectList from './pages/Project/List'
import Login from './pages/Login'
import { useAuthStore } from './stores/auth'
import './App.css'

const { Content } = Layout

// 主布局（需要登录）
function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSider />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scripts" element={<ScriptList />} />
            <Route path="/scripts/:id" element={<ScriptEditor />} />
            <Route path="/cast" element={<CastList />} />
            <Route path="/music" element={<MusicLibrary />} />
            <Route path="/storyboard" element={<StoryboardEditor />} />
            <Route path="/dubbing" element={<DubbingStudio />} />
            <Route path="/projects" element={<ProjectList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* 登录页 - 已登录则跳转首页 */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      
      {/* 受保护的路由 */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
