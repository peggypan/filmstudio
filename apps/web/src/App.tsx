import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from './components/Layout/Header'
import AppSider from './components/Layout/Sider'
import Dashboard from './pages/Dashboard'
import ScriptEditor from './pages/Script/Editor'
import ScriptList from './pages/Script/List'
import CastList from './pages/Cast/List'
import MusicLibrary from './pages/Music/Library'
import StoryboardEditor from './pages/Storyboard/Editor'
import DubbingStudio from './pages/Dubbing/Studio'
import ProjectList from './pages/Project/List'
import './App.css'

const { Content } = Layout

function App() {
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

export default App
