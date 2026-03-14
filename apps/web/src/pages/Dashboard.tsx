import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Spin, Progress } from 'antd'
import { 
  FileTextOutlined, 
  TeamOutlined, 
  ProjectOutlined, 
  CustomerServiceOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { projectApi, scriptApi, castApi, musicApi } from '../services/api'

interface DashboardStats {
  projects: number
  scripts: number
  casts: number
  music: number
  recentProjects: any[]
  recentScripts: any[]
  projectStatus: {
    active: number
    completed: number
    paused: number
  }
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    scripts: 0,
    casts: 0,
    music: 0,
    recentProjects: [],
    recentScripts: [],
    projectStatus: { active: 0, completed: 0, paused: 0 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, scripts, casts, music] = await Promise.all([
          projectApi.getProjects(),
          scriptApi.getScripts(),
          castApi.getCasts(),
          musicApi.getMusic(),
        ])

        // 统计项目状态
        const projectStatus = {
          active: projects.filter((p: any) => p.status === 'active').length,
          completed: projects.filter((p: any) => p.status === 'completed').length,
          paused: projects.filter((p: any) => p.status === 'paused').length,
        }

        setStats({
          projects: projects.length,
          scripts: scripts.length,
          casts: casts.length,
          music: music.length,
          recentProjects: projects.slice(0, 5),
          recentScripts: scripts.slice(0, 5),
          projectStatus,
        })
      } catch (error) {
        console.error('加载统计数据失败', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>工作台</h1>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="进行中的项目" 
              value={stats.projectStatus.active} 
              prefix={<ProjectOutlined style={{ color: '#1890ff' }} />} 
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">进行中 {stats.projectStatus.active}</Tag>
              <Tag color="green">已完成 {stats.projectStatus.completed}</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="剧本数量" 
              value={stats.scripts} 
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />} 
            />
            <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
              创意内容管理
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="演员库" 
              value={stats.casts} 
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />} 
            />
            <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
              演员/配音/模特
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="音乐库" 
              value={stats.music} 
              prefix={<CustomerServiceOutlined style={{ color: '#eb2f96' }} />} 
            />
            <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
              配乐/音效资源
            </div>
          </Card>
        </Col>
      </Row>

      {/* 项目进度和最近内容 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title={<><ProjectOutlined /> 最近项目</>} 
            extra={<a href="/projects">查看全部</a>}
          >
            <List
              dataSource={stats.recentProjects}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Tag key="status" color={
                      item.status === 'active' ? 'blue' :
                      item.status === 'completed' ? 'green' :
                      item.status === 'paused' ? 'orange' : 'default'
                    }>
                      {item.status === 'active' ? '进行中' :
                       item.status === 'completed' ? '已完成' :
                       item.status === 'paused' ? '已暂停' : item.status}
                    </Tag>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={
                      <div>
                        <Progress percent={item.progress} size="small" showInfo={false} />
                        <span style={{ fontSize: 12, color: '#888' }}>
                          进度 {item.progress}%
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={<><FileTextOutlined /> 最近剧本</>} 
            extra={<a href="/scripts">查看全部</a>}
          >
            <List
              dataSource={stats.recentScripts}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    item.aiGenerated && <Tag key="ai" color="purple">AI</Tag>,
                    <Tag key="status" color={
                      item.status === 'completed' ? 'green' :
                      item.status === 'draft' ? 'default' : 'orange'
                    }>
                      {item.status === 'completed' ? '已完成' :
                       item.status === 'draft' ? '草稿' : item.status}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <span style={{ fontSize: 12, color: '#888' }}>
                        {item.genre || '未分类'} · {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={<><ClockCircleOutlined /> 快捷操作</>}>
            <Row gutter={16}>
              <Col span={6}>
                <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                  <a href="/projects">
                    <ProjectOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <div style={{ marginTop: 8 }}>新建项目</div>
                  </a>
                </Card.Grid>
              </Col>
              <Col span={6}>
                <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                  <a href="/scripts">
                    <FileTextOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    <div style={{ marginTop: 8 }}>创建剧本</div>
                  </a>
                </Card.Grid>
              </Col>
              <Col span={6}>
                <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                  <a href="/scripts">
                    <ThunderboltOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                    <div style={{ marginTop: 8 }}>AI 生成</div>
                  </a>
                </Card.Grid>
              </Col>
              <Col span={6}>
                <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                  <a href="/cast">
                    <TeamOutlined style={{ fontSize: 24, color: '#eb2f96' }} />
                    <div style={{ marginTop: 8 }}>添加演员</div>
                  </a>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
