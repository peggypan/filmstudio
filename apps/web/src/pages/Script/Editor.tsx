import { useState, useEffect } from 'react'
import { Card, Input, Button, Space, message, Spin, Select, Tag } from 'antd'
import { 
  SaveOutlined, 
  ThunderboltOutlined, 
  ArrowLeftOutlined,
  CopyOutlined
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { scriptApi, projectApi } from '../../services/api'
import type { Script } from '../../types/script'

const { TextArea } = Input

function ScriptEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [script, setScript] = useState<Script | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [genre, setGenre] = useState('')
  const [projectId, setProjectId] = useState<string>()

  // 加载剧本详情
  useEffect(() => {
    if (!id) return
    
    const loadData = async () => {
      try {
        const [scriptData, projectsData] = await Promise.all([
          scriptApi.getScript(id),
          projectApi.getProjects(),
        ])
        setScript(scriptData)
        setProjects(projectsData)
        setTitle(scriptData.title)
        setContent(scriptData.content || '')
        setGenre(scriptData.genre || '')
        setProjectId(scriptData.projectId)
      } catch (error: any) {
        message.error('加载剧本失败: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  // 保存剧本
  const handleSave = async () => {
    if (!id) return
    
    setSaving(true)
    try {
      await scriptApi.updateScript(id, {
        title,
        content,
        genre,
      })
      message.success('保存成功')
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // AI 续写/优化
  const handleAiAssist = async () => {
    if (!content) {
      message.warning('请先输入一些内容')
      return
    }
    
    setAiLoading(true)
    try {
      const result = await scriptApi.generateScript({
        prompt: `基于以下剧本内容继续创作或优化：\n\n${content}\n\n请继续创作或优化这段剧本：`,
        genre,
      })
      
      // 追加内容
      setContent(prev => prev + '\n\n' + result.content)
      message.success('AI 生成完成')
    } catch (error: any) {
      message.error('生成失败: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  // 复制内容
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!script) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <p>剧本不存在或已被删除</p>
        <Button type="primary" onClick={() => navigate('/scripts')}>
          返回列表
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/scripts')}>
            返回
          </Button>
          <h1 style={{ margin: 0 }}>剧本编辑</h1>
          {script.aiGenerated && <Tag color="purple">AI 生成</Tag>}
        </Space>
        <Space>
          <Button icon={<CopyOutlined />} onClick={handleCopy}>
            复制
          </Button>
          <Button 
            icon={<ThunderboltOutlined />} 
            onClick={handleAiAssist}
            loading={aiLoading}
          >
            AI 续写
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={saving}
          >
            保存
          </Button>
        </Space>
      </div>

      <Card>
        {/* 剧本信息 */}
        <Space style={{ marginBottom: 16, width: '100%' }} wrap>
          <Input
            placeholder="剧本标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="类型"
            value={genre || undefined}
            onChange={setGenre}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="short">短视频</Select.Option>
            <Select.Option value="movie">电影</Select.Option>
            <Select.Option value="tv">电视剧</Select.Option>
            <Select.Option value="ad">广告</Select.Option>
            <Select.Option value="animation">动画</Select.Option>
            <Select.Option value="documentary">纪录片</Select.Option>
          </Select>
          <Select
            placeholder="关联项目"
            value={projectId}
            onChange={setProjectId}
            style={{ width: 200 }}
            allowClear
          >
            {projects.map(p => (
              <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
            ))}
          </Select>
        </Space>

        {/* 剧本内容 */}
        <TextArea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={25}
          placeholder="在此输入或编辑剧本内容..."
          style={{ 
            fontSize: 14, 
            lineHeight: 1.8,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        />
      </Card>

      {/* 底部信息 */}
      <div style={{ marginTop: 16, color: '#888', textAlign: 'right' }}>
        字数统计: {content.length} 字符 | 
        上次更新: {new Date(script.updatedAt).toLocaleString()}
      </div>
    </div>
  )
}

export default ScriptEditor
